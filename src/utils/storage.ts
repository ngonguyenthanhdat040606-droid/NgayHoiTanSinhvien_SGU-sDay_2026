import { Student, Station } from '../types';
import { INITIAL_STATIONS, INITIAL_STUDENTS } from '../data/mockData';

const STUDENTS_KEY = 'tsv_students_v5';
const STATIONS_KEY = 'tsv_stations_v5';
const ACTIVE_STUDENT_ID_KEY = 'tsv_active_student_id_v5';

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

export function getActiveStudent(): Student | null {
  const students = getStoredStudents();
  if (!students.length) return null;
  
  const activeId = getActiveStudentId();
  if (activeId) {
    const found = students.find((s) => s.id === activeId);
    if (found) return found;
  }

  // Fallback to first student and save as active
  const fallback = students[0];
  setActiveStudentId(fallback.id);
  return fallback;
}

export function registerOrUpdateStudent(
  data: {
    mssv: string;
    fullName: string;
    faculty: string;
    major: string;
    studentClass: string;
    email: string;
    phone: string;
  },
  pendingStationId?: string
): Student {
  const students = getStoredStudents();
  const stations = getStoredStations();
  const cleanMssv = data.mssv.trim().toUpperCase();
  const now = new Date();
  const timestamp = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + now.toLocaleDateString('vi-VN');

  const existingIndex = students.findIndex((s) => s.mssv.trim().toUpperCase() === cleanMssv);

  let targetStudent: Student;

  if (existingIndex !== -1) {
    // Update existing student
    const existing = students[existingIndex];
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
      id: `stu-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      mssv: cleanMssv,
      fullName: data.fullName.trim(),
      faculty: data.faculty,
      major: data.major.trim() || 'Chuyên ngành Tân Sinh Viên',
      studentClass: data.studentClass.trim() || '24KHOA01',
      email: data.email.trim() || `${cleanMssv.toLowerCase()}@student.edu.vn`,
      phone: data.phone.trim() || '0901234567',
      registeredAt: timestamp,
      completedStations: initialCompleted,
      checkinHistory: initialHistory,
    };

    students.unshift(targetStudent);
  }

  // Save updated list & immediately make this student the active student
  saveStudents(students);
  setActiveStudentId(targetStudent.id);

  return targetStudent;
}

const ORGANIZER_PIN_KEY = 'tsv_organizer_pin_v5';
const ORGANIZER_AUTH_KEY = 'tsv_organizer_auth_status_v5';
const DEFAULT_PIN = '2025';

export function getOrganizerPin(): string {
  try {
    return localStorage.getItem(ORGANIZER_PIN_KEY) || DEFAULT_PIN;
  } catch {
    return DEFAULT_PIN;
  }
}

export function setOrganizerPin(newPin: string): void {
  try {
    localStorage.setItem(ORGANIZER_PIN_KEY, newPin);
  } catch (e) {
    console.error('Failed to set organizer pin', e);
  }
}

export function isOrganizerAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(ORGANIZER_AUTH_KEY) === 'true' || localStorage.getItem(ORGANIZER_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setOrganizerAuthenticated(status: boolean, remember: boolean = true): void {
  try {
    if (status) {
      sessionStorage.setItem(ORGANIZER_AUTH_KEY, 'true');
      if (remember) {
        localStorage.setItem(ORGANIZER_AUTH_KEY, 'true');
      }
    } else {
      sessionStorage.removeItem(ORGANIZER_AUTH_KEY);
      localStorage.removeItem(ORGANIZER_AUTH_KEY);
    }
  } catch (e) {
    console.error('Failed to save organizer auth status', e);
  }
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
    message: `Điểm danh thành công! ${student.fullName} đã thu thập thêm con dấu "${station.shortName}". (${newCompletedStations.length}/8 trạm)`,
    student: updatedStudent,
  };
}
