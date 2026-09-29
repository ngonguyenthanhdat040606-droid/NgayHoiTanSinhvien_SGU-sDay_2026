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

async function checkDetailed9() {
  try {
    await signInAnonymously(auth);
    const studentsRef = collection(db, 'students');
    const snapshot = await getDocs(studentsRef);
    
    let total9 = 0;
    let manual9 = 0;
    let web9 = 0;
    let both9 = 0;
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const completed = data.completedStations || [];
      const history = data.checkinHistory || [];
      
      if (completed.includes('station-9')) {
        total9++;
        
        const hasManual = history.some(h => h.stationId === 'station-9' && h.method === 'manual_excel');
        const hasWeb = history.some(h => h.stationId === 'station-9' && h.method !== 'manual_excel');
        
        if (hasManual && hasWeb) both9++;
        else if (hasManual) manual9++;
        else if (hasWeb) web9++;
        else {
            // Check if there is NO history for station-9, but it's in completed.
            // This might happen if full_restore didn't touch them but they were in completed
            console.log(`Anomaly: Student ${data.mssv} has station-9 in completed but no history!`);
        }
      }
    });

    console.log(`Total Station 9 in completedStations: ${total9}`);
    console.log(`- Only from Excel (manual): ${manual9}`);
    console.log(`- Only from Web/App: ${web9}`);
    console.log(`- Both Web and Excel (overlap): ${both9}`);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkDetailed9();
