import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCBG_WcxSE4ldH0tIFq9QU1vhqztJuLI68",
  authDomain: "thanhdat-505108.firebaseapp.com",
  projectId: "thanhdat-505108",
  storageBucket: "thanhdat-505108.firebasestorage.app",
  messagingSenderId: "521620102936",
  appId: "1:521620102936:web:9dc359eb8268aa0d88486d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function checkStudentData() {
  try {
    await signInAnonymously(auth);
    const studentsRef = collection(db, 'students');
    const snapshot = await getDocs(studentsRef);
    
    let anomalies = 0;
    
    // find a student who has many checkin logs but completedStations is 1
    snapshot.docs.forEach(doc => {
      const s = doc.data();
      const numHistory = s.checkinHistory ? s.checkinHistory.length : 0;
      const numStations = (s.completedStations || []).length;
      
      if (numHistory > 2 && numStations === 1) {
        console.log(`Anomaly: MSSV ${s.mssv}, history=${numHistory}, stations=${numStations}`);
        console.log('History:', s.checkinHistory);
        console.log('Stations:', s.completedStations);
        anomalies++;
      }
    });

    console.log(`Total anomalies found: ${anomalies}`);
    
    // Also let's check one normal student who we manually updated
    const mssvTest = '3124500051'; // or just any
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkStudentData();
