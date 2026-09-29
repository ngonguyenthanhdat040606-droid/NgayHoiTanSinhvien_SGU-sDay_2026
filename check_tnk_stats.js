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

async function checkTnkStats() {
  try {
    await signInAnonymously(auth);
    const studentsRef = collection(db, 'students');
    const snapshot = await getDocs(studentsRef);
    
    let count = 0;
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const completedStations = data.completedStations || [];
      if (completedStations.includes('station-9')) {
        count++;
      }
    });

    console.log(`Total students with station-9: ${count}`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkTnkStats();
