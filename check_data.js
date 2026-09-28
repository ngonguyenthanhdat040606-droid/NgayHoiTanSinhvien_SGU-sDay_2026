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

async function checkData() {
  try {
    console.log("Signing in anonymously...");
    await signInAnonymously(auth);
    console.log("Signed in. Fetching students...");

    const studentsRef = collection(db, 'students');
    const snapshot = await getDocs(studentsRef);
    
    let totalStudents = snapshot.size;
    let studentsWithCheckins = 0;
    let totalStationCheckins = 0;
    let totalBoothCheckins = 0;
    
    console.log(`Found ${totalStudents} students in Firestore.`);

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const completedStations = data.completedStations || [];
      const completedBooths = data.completedBooths || [];
      
      if (completedStations.length > 0 || completedBooths.length > 0) {
        studentsWithCheckins++;
        totalStationCheckins += completedStations.length;
        totalBoothCheckins += completedBooths.length;
      }
    });

    console.log(`\n--- STUDENT COLLECTION STATS ---`);
    console.log(`Total Students: ${totalStudents}`);
    console.log(`Students with at least 1 check-in: ${studentsWithCheckins}`);
    console.log(`Total Station Check-in marks: ${totalStationCheckins}`);
    console.log(`Total Booth Check-in marks: ${totalBoothCheckins}`);

    console.log("\nFetching station_checkins audit log...");
    const checkinsRef = collection(db, 'station_checkins');
    const checkinsSnap = await getDocs(checkinsRef);
    console.log(`\n--- AUDIT LOG STATS ---`);
    console.log(`Total check-in records in station_checkins: ${checkinsSnap.size}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error checking data:", error);
    process.exit(1);
  }
}

checkData();
