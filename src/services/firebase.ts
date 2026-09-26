import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  serverTimestamp, 
  writeBatch
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import type { Student, StationCheckin } from '../types';

let firebaseConfig: any = {
  apiKey: "AIzaSyCBG_WcxSE4ldH0tIFq9QU1vhqztJuLI68",
  authDomain: "thanhdat-505108.firebaseapp.com",
  projectId: "thanhdat-505108",
  storageBucket: "thanhdat-505108.firebasestorage.app",
  messagingSenderId: "521620102936",
  appId: "1:521620102936:web:9dc359eb8268aa0d88486d",
  measurementId: "G-GN8XTLZZT4"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
export const auth = getAuth(app);

// Authenticate anonymously so firestore rules allow access
let currentUser: User | null = null;

export const ensureFirebaseAuth = async (): Promise<User | null> => {
  if (currentUser) return currentUser;
  try {
    const userCred = await signInAnonymously(auth);
    currentUser = userCred.user;
    return currentUser;
  } catch (err) {
    console.warn('Anonymous auth error, will continue with fallback:', err);
    return null;
  }
};

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});
ensureFirebaseAuth();

const STUDENTS_COLLECTION = 'students';
const CHECKINS_COLLECTION = 'station_checkins';

/**
 * Real-time listener for students collection
 */
export const subscribeToStudents = (
  onData: (students: Student[]) => void,
  onError?: (err: Error) => void
) => {
  try {
    const colRef = collection(db, STUDENTS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: Student[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            mssv: data.mssv || '',
            fullName: data.fullName || '',
            faculty: data.faculty || '',
            major: data.major || 'Tân Sinh Viên SGU',
            studentClass: data.studentClass || '',
            email: data.email || '',
            phone: data.phone || '',
            pinCode: data.pinCode || '',
            registeredAt: data.registeredAt || '',
            completedStations: Array.isArray(data.completedStations) ? data.completedStations : [],
            completedBooths: Array.isArray(data.completedBooths) ? data.completedBooths : [],
            checkinHistory: Array.isArray(data.checkinHistory) ? data.checkinHistory : []
          });
        });
        onData(list);
      },
      (error) => {
        console.error('Firestore students subscription error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.error('Failed to setup Firestore subscription:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Real-time listener for a SINGLE student document (Quota friendly)
 */
export const subscribeToSingleStudent = (
  studentId: string,
  onData: (student: Student | null) => void,
  onError?: (err: Error) => void
) => {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, studentId);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          onData(null);
          return;
        }
        const data = docSnap.data();
        const student: Student = {
          id: docSnap.id,
          mssv: data.mssv || '',
          fullName: data.fullName || '',
          faculty: data.faculty || '',
          major: data.major || 'Tân Sinh Viên SGU',
          studentClass: data.studentClass || '',
          email: data.email || '',
          phone: data.phone || '',
          pinCode: data.pinCode || '',
          registeredAt: data.registeredAt || '',
          completedStations: Array.isArray(data.completedStations) ? data.completedStations : [],
          completedBooths: Array.isArray(data.completedBooths) ? data.completedBooths : [],
          checkinHistory: Array.isArray(data.checkinHistory) ? data.checkinHistory : []
        };
        onData(student);
      },
      (error) => {
        console.error(`Firestore single student subscription error for ${studentId}:`, error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.error('Failed to setup Firestore single student subscription:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Fetch a student by MSSV directly from Firestore
 */
export const getStudentByMssvFromFirestore = async (mssv: string): Promise<Student | null> => {
  try {
    await ensureFirebaseAuth();
    const cleanMssv = mssv.trim().toUpperCase();
    const docId = `stu-${cleanMssv.toLowerCase()}`;
    const docRef = doc(db, STUDENTS_COLLECTION, docId);
    const docSnap = await getDocs(collection(db, STUDENTS_COLLECTION));
    let found: Student | null = null;
    docSnap.forEach((d) => {
      const data = d.data();
      if ((data.mssv || '').trim().toUpperCase() === cleanMssv) {
        found = {
          id: d.id,
          mssv: data.mssv || '',
          fullName: data.fullName || '',
          faculty: data.faculty || '',
          major: data.major || '',
          studentClass: data.studentClass || '',
          email: data.email || '',
          phone: data.phone || '',
          pinCode: data.pinCode || '',
          registeredAt: data.registeredAt || '',
          completedStations: Array.isArray(data.completedStations) ? data.completedStations : [],
          completedBooths: Array.isArray(data.completedBooths) ? data.completedBooths : [],
          checkinHistory: Array.isArray(data.checkinHistory) ? data.checkinHistory : []
        };
      }
    });
    return found;
  } catch (err) {
    console.error('Error fetching student by MSSV from Firestore:', err);
    return null;
  }
};

/**
 * Verify student PIN with Firestore directly
 */
export const verifyStudentPinWithFirestore = async (
  mssv: string,
  pin: string
): Promise<{ success: boolean; student?: Student; message: string }> => {
  try {
    const student = await getStudentByMssvFromFirestore(mssv);
    if (!student) {
      return { success: false, message: `Không tìm thấy thẻ sinh viên với MSSV ${mssv.toUpperCase()}` };
    }
    const cleanPin = pin.trim();
    if (student.pinCode && student.pinCode !== cleanPin) {
      const last4 = student.phone ? student.phone.replace(/\D/g, '').slice(-4) : '';
      if (cleanPin !== last4) {
        return { success: false, message: 'Mã PIN bảo mật không chính xác!' };
      }
    }
    return { success: true, student, message: 'Xác thực thành công!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Lỗi kết nối máy chủ' };
  }
};

/**
 * Save or update student record in Firestore
 */
export const saveStudentToFirestore = async (student: Student): Promise<boolean> => {
  try {
    await ensureFirebaseAuth();
    const docRef = doc(db, STUDENTS_COLLECTION, student.id);
    await setDoc(docRef, {
      ...student,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving student to Firestore:', error);
    return false;
  }
};

/**
 * Record a check-in event in Firestore
 */
export const recordStationCheckinInFirestore = async (
  student: Student,
  stationId: string,
  checkinData: StationCheckin
): Promise<boolean> => {
  try {
    await ensureFirebaseAuth();
    // 1. Update student document
    const studentRef = doc(db, STUDENTS_COLLECTION, student.id);
    await setDoc(studentRef, {
      ...student,
      updatedAt: serverTimestamp()
    }, { merge: true });

    // 2. Add to central check-ins ledger for organizer reporting
    const logRef = doc(collection(db, CHECKINS_COLLECTION));
    await setDoc(logRef, {
      checkinId: logRef.id,
      studentId: student.id,
      mssv: student.mssv,
      fullName: student.fullName,
      faculty: student.faculty,
      studentClass: student.studentClass,
      stationId,
      stationName: checkinData.stationName,
      timestamp: checkinData.timestamp,
      method: checkinData.method,
      recordedBy: checkinData.recordedBy || 'Hệ Thống Trạm',
      createdAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error recording checkin in Firestore:', error);
    return false;
  }
};

/**
 * Batch sync mock / local students to Firestore if Firestore is empty
 */
export const seedInitialFirestoreStudents = async (initialStudents: Student[]): Promise<boolean> => {
  try {
    await ensureFirebaseAuth();
    const colRef = collection(db, STUDENTS_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty && initialStudents.length > 0) {
      console.log('Seeding initial students to Firestore...');
      const batch = writeBatch(db);
      initialStudents.forEach((st) => {
        const docRef = doc(db, STUDENTS_COLLECTION, st.id);
        batch.set(docRef, {
          ...st,
          createdAt: serverTimestamp()
        });
      });
      await batch.commit();
      console.log('Successfully seeded students to Firestore');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error seeding Firestore students:', error);
    return false;
  }
};
