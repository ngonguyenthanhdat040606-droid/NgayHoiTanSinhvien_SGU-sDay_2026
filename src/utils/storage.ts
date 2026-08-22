import { Student, Station } from '../types';
import { INITIAL_STATIONS, INITIAL_STUDENTS } from '../data/mockData';

const STUDENTS_KEY = 'tsv_students_v1';
const STATIONS_KEY = 'tsv_stations_v1';
const ACTIVE_STUDENT_ID_KEY = 'tsv_active_student_id_v1';

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
    return JSON.parse(raw);
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
  return localStorage.getItem(ACTIVE_STUDENT_ID_KEY) || 'stu-1';
}

export function setActiveStudentId(id: string | null): void {
  if (id) {
    localStorage.setItem(ACTIVE_STUDENT_ID_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_STUDENT_ID_KEY);
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
  const isEligible = newCompletedStations.length >= 4;

  const updatedStudent: Student = {
    ...student,
    completedStations: newCompletedStations,
    isEligibleForReward: isEligible,
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
    message: `Điểm danh thành công! ${student.fullName} đã thu thập thêm con dấu "${station.shortName}". (${newCompletedStations.length}/6 trạm)`,
    student: updatedStudent,
  };
}
