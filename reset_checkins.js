import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore';
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

async function resetCheckins() {
  try {
    console.log("Signing in anonymously...");
    await signInAnonymously(auth);
    console.log("Signed in. Fetching students...");

    const studentsRef = collection(db, 'students');
    const snapshot = await getDocs(studentsRef);
    
    console.log(`Found ${snapshot.size} students. Resetting check-ins...`);

    let batch = writeBatch(db);
    let count = 0;
    
    for (const studentDoc of snapshot.docs) {
      batch.update(studentDoc.ref, {
        completedStations: [],
        completedBooths: [],
        checkinHistory: []
      });
      count++;
      
      // Firestore batch has a limit of 500 writes
      if (count === 400) {
        await batch.commit();
        console.log("Committed a batch of 400");
        batch = writeBatch(db);
        count = 0;
      }
    }
    
    if (count > 0) {
      await batch.commit();
      console.log(`Committed remaining ${count} records.`);
    }

    console.log("Fetching station_checkins to delete...");
    const checkinsRef = collection(db, 'station_checkins');
    const checkinsSnap = await getDocs(checkinsRef);
    console.log(`Found ${checkinsSnap.size} checkin logs. Deleting...`);
    
    let deleteBatch = writeBatch(db);
    let delCount = 0;
    for (const doc of checkinsSnap.docs) {
        deleteBatch.delete(doc.ref);
        delCount++;
        if (delCount === 400) {
            await deleteBatch.commit();
            deleteBatch = writeBatch(db);
            delCount = 0;
        }
    }
    if (delCount > 0) {
        await deleteBatch.commit();
    }

    console.log("SUCCESS: All student check-ins and logs have been reset.");
    process.exit(0);
  } catch (error) {
    console.error("Error resetting check-ins:", error);
    process.exit(1);
  }
}

resetCheckins();
