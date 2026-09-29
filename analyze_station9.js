import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
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

async function analyzeStation9() {
  try {
    await signInAnonymously(auth);
    const checkinsRef = collection(db, 'station_checkins');
    const snap = await getDocs(checkinsRef);
    
    let logsForStation9 = 0;
    let uniqueStudentsStation9 = new Set();
    
    snap.docs.forEach(doc => {
      const data = doc.data();
      if (data.stationId === 'station-9') {
        logsForStation9++;
        if (data.studentId) uniqueStudentsStation9.add(data.studentId);
      }
    });

    console.log(`Station 9 total audit logs: ${logsForStation9}`);
    console.log(`Station 9 unique students in audit log: ${uniqueStudentsStation9.size}`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

analyzeStation9();
