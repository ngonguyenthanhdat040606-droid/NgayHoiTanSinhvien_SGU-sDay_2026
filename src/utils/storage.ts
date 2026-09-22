import { Student, Station, OrganizerSession } from '../types';
import { INITIAL_STATIONS, INITIAL_STUDENTS } from '../data/mockData';

const STUDENTS_KEY = 'tsv_students_v5';
const STATIONS_KEY = 'tsv_stations_v5';
const ACTIVE_STUDENT_ID_KEY = 'tsv_active_student_id_v5';
const ORGANIZER_SESSION_KEY = 'tsv_organizer_session_v5';
const ORGANIZER_PIN_KEY = 'tsv_organizer_pin_v5';
const DEFAULT_ADMIN_PIN = '2026';

export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STUDENTS_KEY);
    if (!raw) {
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load students', e);
    return INITIAL_STUDENTS;
  }
}

export function saveStudents(students: Student[]): void {
  try {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students', e);
  }
}

export function getStoredStations(): Station[] {
  try {
    const raw = localStorage.getItem(STATIONS_KEY);
    if (!raw) {
      localStorage.setItem(STATIONS_KEY, JSON.stringify(INITIAL_STATIONS));
      return INITIAL_STATIONS;
    }
    const parsed: Station[] = JSON.parse(raw);
    // If old cached data has fewer stations than initial 8 stations, refresh to INITIAL_STATIONS
    if (parsed.length < INITIAL_STATIONS.length) {
      localStorage.setItem(STATIONS_KEY, JSON.stringify(INITIAL_STATIONS));
      return INITIAL_STATIONS;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load stations', e);
    return INITIAL_STATIONS;
  }
}

export function saveStations(stations: Station[]): void {
  try {
    localStorage.setItem(STATIONS_KEY, JSON.stringify(stations));
  } catch (e) {
    console.error('Failed to save stations', e);
  }
}

export function getActiveStudentId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_STUDENT_ID_KEY) || null;
  } catch (e) {
    console.error('Failed to load active student id', e);
    return null;
  }
}

export function setActiveStudentId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(ACTIVE_STUDENT_ID_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_STUDENT_ID_KEY);
    }
  } catch (e) {
    console.error('Failed to save active student id', e);
  }
}

/**
 * Get active student. Fixed: NO auto-fallback to students[0] to prevent account collision!
 */
export function getActiveStudent(): Student | null {
  const activeId = getActiveStudentId();
  if (!activeId) return null;

  const students = getStoredStudents();
  const found = students.find((s) => s.id === activeId);
  return found || null;
}

/**
 * Logout active student on this device
 */
export function logoutActiveStudent(): void {
  setActiveStudentId(null);
}

/**
 * Authenticate student by MSSV and PIN
 */
export function authenticateStudent(
  mssv: string,
  pin: string
): { success: boolean; message: string; student?: Student } {
  const cleanMssv = mssv.trim().toUpperCase();
  const cleanPin = pin.trim();
  const students = getStoredStudents();

  const student = students.find((s) => s.mssv.trim().toUpperCase() === cleanMssv);

  if (!student) {
    return {
      success: false,
      message: `Không tìm thấy thẻ sinh viên với MSSV ${cleanMssv}. Vui lòng đăng ký Thẻ mới!`,
    };
  }

  // If student has a PIN set, verify it
  if (student.pinCode && student.pinCode !== cleanPin) {
    // Fallback: check if pin matches last 4 digits of phone
    const last4Phone = student.phone ? student.phone.replace(/\D/g, '').slice(-4) : '';
    if (cleanPin !== last4Phone) {
      return {
        success: false,
        message: 'Mã PIN bảo mật không chính xác. Vui lòng nhập đúng 4 số PIN khi đăng ký!',
      };
    }
  }

  // If student didn't have a PIN, set it now
  if (!student.pinCode && cleanPin) {
    student.pinCode = cleanPin;
    saveStudents(students);
  }

  setActiveStudentId(student.id);
  return {
    success: true,
    message: `Đăng nhập thành công! Chào mừng ${student.fullName} (${student.mssv}) trở lại.`,
    student,
  };
}

/**
 * Register or update student with secure PIN
 */
export function registerOrUpdateStudent(
  data: {
    mssv: string;
    fullName: string;
    faculty: string;
    major: string;
    studentClass: string;
    email: string;
    phone: string;
    pinCode?: string;
  },
  pendingStationId?: string
): { success: boolean; message: string; student: Student } {
  const students = getStoredStudents();
  const stations = getStoredStations();
  const cleanMssv = data.mssv.trim().toUpperCase();
  const cleanPin = (data.pinCode || '').trim() || '1234';
  const now = new Date();
  const timestamp = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + now.toLocaleDateString('vi-VN');

  const existingIndex = students.findIndex((s) => s.mssv.trim().toUpperCase() === cleanMssv);

  let targetStudent: Student;

  if (existingIndex !== -1) {
    // Update existing student: Validate PIN to avoid unauthorized overwriting
    const existing = students[existingIndex];
    if (existing.pinCode && existing.pinCode !== cleanPin) {
      const last4Phone = existing.phone ? existing.phone.replace(/\D/g, '').slice(-4) : '';
      if (cleanPin !== last4Phone) {
        return {
          success: false,
          message: `MSSV ${cleanMssv} đã được đăng ký trước đó. Vui lòng nhập đúng mã PIN bảo vệ để cập nhật hoặc đăng nhập!`,
          student: existing,
        };
      }
    }

    let completed = [...existing.completedStations];
    let history = [...existing.checkinHistory];

    if (pendingStationId && !completed.includes(pendingStationId)) {
      const station = stations.find((st) => st.id === pendingStationId);
      completed.push(pendingStationId);
      history.unshift({
        stationId: pendingStationId,
        stationName: station?.name || 'Trạm sự kiện',
        timestamp,
        method: 'nfc_tap',
        recordedBy: station?.managerName || 'Thẻ NFC Trạm',
      });
    }

    targetStudent = {
      ...existing,
      fullName: data.fullName.trim() || existing.fullName,
      faculty: data.faculty || existing.faculty,
      major: data.major.trim() || existing.major,
      studentClass: data.studentClass.trim() || existing.studentClass,
      email: data.email.trim() || existing.email,
      phone: data.phone.trim() || existing.phone,
      pinCode: cleanPin || existing.pinCode || '1234',
      completedStations: completed,
      checkinHistory: history,
    };

    students[existingIndex] = targetStudent;
  } else {
    // Create new student
    let initialCompleted: string[] = [];
    let initialHistory: any[] = [];

    if (pendingStationId) {
      const station = stations.find((st) => st.id === pendingStationId);
      initialCompleted = [pendingStationId];
      initialHistory = [
        {
          stationId: pendingStationId,
          stationName: station?.name || 'Trạm sự kiện',
          timestamp,
          method: 'nfc_tap',
          recordedBy: station?.managerName || 'Thẻ NFC Trạm',
        },
      ];
    }

    targetStudent = {
      id: `stu-${cleanMssv.toLowerCase()}`,
      mssv: cleanMssv,
      fullName: data.fullName.trim(),
      faculty: data.faculty,
      major: data.major.trim() || 'Chuyên ngành Tân Sinh Viên',
      studentClass: data.studentClass.trim() || '24KHOA01',
      email: data.email.trim() || `${cleanMssv.toLowerCase()}@student.edu.vn`,
      phone: data.phone.trim() || '0901234567',
      pinCode: cleanPin,
      registeredAt: timestamp,
      completedStations: initialCompleted,
      checkinHistory: initialHistory,
    };

    students.unshift(targetStudent);
  }

  // Save updated list & immediately make this student the active student
  saveStudents(students);
  setActiveStudentId(targetStudent.id);

  return {
    success: true,
    message: `Đăng ký Thẻ e-Pass thành công cho sinh viên ${targetStudent.fullName}!`,
    student: targetStudent,
  };
}

// =========================================================================
// ORGANIZER AUTHENTICATION & ROLE MANAGEMENT
// =========================================================================

export function getOrganizerPin(): string {
  try {
    return localStorage.getItem(ORGANIZER_PIN_KEY) || DEFAULT_ADMIN_PIN;
  } catch {
    return DEFAULT_ADMIN_PIN;
  }
}

export function setOrganizerPin(newPin: string): void {
  try {
    localStorage.setItem(ORGANIZER_PIN_KEY, newPin);
  } catch (e) {
    console.error('Failed to set organizer pin', e);
  }
}

export function getOrganizerSession(): OrganizerSession | null {
  try {
    const raw = sessionStorage.getItem(ORGANIZER_SESSION_KEY) || localStorage.getItem(ORGANIZER_SESSION_KEY);
    if (!raw) return null;
    const parsed: OrganizerSession = JSON.parse(raw);
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      clearOrganizerSession();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setOrganizerSession(session: OrganizerSession | null, remember: boolean = true): void {
  try {
    if (session) {
      const payload = JSON.stringify(session);
      sessionStorage.setItem(ORGANIZER_SESSION_KEY, payload);
      if (remember) {
        localStorage.setItem(ORGANIZER_SESSION_KEY, payload);
      }
    } else {
      clearOrganizerSession();
    }
  } catch (e) {
    console.error('Failed to save organizer session', e);
  }
}

export function clearOrganizerSession(): void {
  try {
    sessionStorage.removeItem(ORGANIZER_SESSION_KEY);
    localStorage.removeItem(ORGANIZER_SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear organizer session', e);
  }
}

export function isOrganizerAuthenticated(): boolean {
  const session = getOrganizerSession();
  return session !== null && session.authenticated === true;
}

export function setOrganizerAuthenticated(status: boolean, remember: boolean = true): void {
  if (status) {
    setOrganizerSession({
      authenticated: true,
      role: 'admin',
      managerName: 'Ban Tổ Chức SGU',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    }, remember);
  } else {
    clearOrganizerSession();
  }
}

export function verifyOrganizerCredentials(
  pinOrKey: string,
  selectedStationId?: string
): { success: boolean; session?: OrganizerSession; message: string } {
  const cleanInput = pinOrKey.trim();
  const currentPin = getOrganizerPin();

  // 1. Admin Master Passwords
  if (
    cleanInput === currentPin ||
    cleanInput === 'SGU2026' ||
    cleanInput === 'ADMIN_SGU_2026' ||
    cleanInput === 'BTC@SGU2026'
  ) {
    const session: OrganizerSession = {
      authenticated: true,
      role: 'admin',
      managerName: 'Ban Chỉ Đạo & Tổ Chức SGU',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };
    setOrganizerSession(session, true);
    return { success: true, session, message: 'Đăng nhập Ban Tổ Chức (Toàn quyền) thành công!' };
  }

  // 2. Station Manager Keys (e.g., TRAM1, TRAM2, etc.)
  const stationMatch = cleanInput.toUpperCase().match(/^TRAM([1-9])(_2026)?$/);
  if (stationMatch) {
    const stationNum = parseInt(stationMatch[1], 10);
    const stationId = `station-${stationNum}`;
    const stations = getStoredStations();
    const station = stations.find((s) => s.id === stationId);

    const session: OrganizerSession = {
      authenticated: true,
      role: 'station_manager',
      stationId,
      managerName: station?.managerName || `Trưởng Trạm ${stationNum}`,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };
    setOrganizerSession(session, true);
    return {
      success: true,
      session,
      message: `Đăng nhập quyền Trưởng Trạm ${stationNum} (${station?.shortName || ''}) thành công!`,
    };
  }

  return {
    success: false,
    message: 'Mã PIN hoặc Khóa bảo mật không chính xác. Vui lòng kiểm tra lại!',
  };
}

export function checkinStudentToStation(
  studentMssvOrId: string,
  stationId: string,
  method: 'nfc_tap' | 'qr_scan' | 'manual_mssv' | 'manager_scan',
  recordedBy?: string
): { success: boolean; message: string; student?: Student } {
  const students = getStoredStudents();
  const stations = getStoredStations();

  const station = stations.find((s) => s.id === stationId);
  if (!station) {
    return { success: false, message: 'Không tìm thấy trạm hoạt động tương ứng.' };
  }

  const studentIndex = students.findIndex(
    (s) => s.id === studentMssvOrId || s.mssv.toLowerCase() === studentMssvOrId.toLowerCase()
  );

  if (studentIndex === -1) {
    return {
      success: false,
      message: `Không tìm thấy sinh viên có MSSV/ID: ${studentMssvOrId}. Vui lòng kiểm tra lại hoặc đăng ký mới.`,
    };
  }

  const student = students[studentIndex];
  const isAlreadyCheckedIn = student.completedStations.includes(stationId);

  if (isAlreadyCheckedIn) {
    return {
      success: true,
      message: `Sinh viên ${student.fullName} (${student.mssv}) đã được điểm danh tại "${station.shortName}" trước đó rồi!`,
      student,
    };
  }

  // Add station checkin
  const now = new Date();
  const timestamp = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + now.toLocaleDateString('vi-VN');

  const newCompletedStations = [...student.completedStations, stationId];

  const updatedStudent: Student = {
    ...student,
    completedStations: newCompletedStations,
    checkinHistory: [
      {
        stationId,
        stationName: station.name,
        timestamp,
        method,
        recordedBy: recordedBy || station.managerName,
      },
      ...student.checkinHistory,
    ],
  };

  students[studentIndex] = updatedStudent;
  saveStudents(students);

  return {
    success: true,
    message: `Điểm danh thành công! ${student.fullName} đã thu thập thêm con dấu "${station.shortName}". (${newCompletedStations.length}/11 trạm)`,
    student: updatedStudent,
  };
}
