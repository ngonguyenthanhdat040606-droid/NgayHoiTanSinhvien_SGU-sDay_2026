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
  projectId: "vibrant-lamp-6q6d2",
  appId: "1:405881521326:web:4882c2f6df9b02a12ad93f",
  apiKey: "AIzaSyCk76BqLNrxLLnYUAHn6iEVZY9K0DmTMPQ",
  authDomain: "vibrant-lamp-6q6d2.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-sgusday2025ngyhi-5077913d-9538-4f09-acf4-1e73237301ac",
  storageBucket: "vibrant-lamp-6q6d2.firebasestorage.app",
  messagingSenderId: "405881521326",
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
            registeredAt: data.registeredAt || '',
            completedStations: Array.isArray(data.completedStations) ? data.completedStations : [],
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
