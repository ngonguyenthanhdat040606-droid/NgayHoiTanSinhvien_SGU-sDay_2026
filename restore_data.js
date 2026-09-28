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

async function restoreData() {
  try {
    console.log("Signing in anonymously...");
    await signInAnonymously(auth);
    console.log("Signed in.");

    console.log("Fetching station_checkins audit log...");
    const checkinsRef = collection(db, 'station_checkins');
    const checkinsSnap = await getDocs(checkinsRef);
    console.log(`Found ${checkinsSnap.size} checkin logs.`);

    // Group by studentId
    const studentCheckins = new Map(); // studentId -> { stations: Set, booths: Set }
    
    checkinsSnap.docs.forEach(doc => {
      const data = doc.data();
      const studentId = data.studentId;
      const stationId = data.stationId;
      
      if (!studentId || !stationId) return;

      if (!studentCheckins.has(studentId)) {
        studentCheckins.set(studentId, { stations: new Set(), booths: new Set() });
      }

      if (stationId.startsWith('booth-')) {
        studentCheckins.get(studentId).booths.add(stationId);
      } else {
        studentCheckins.get(studentId).stations.add(stationId);
      }
    });

    console.log(`Grouped checkins for ${studentCheckins.size} unique students.`);
    console.log("Fetching students collection...");

    const studentsRef = collection(db, 'students');
    const studentsSnap = await getDocs(studentsRef);
    console.log(`Found ${studentsSnap.size} students. Beginning restoration...`);

    let batch = writeBatch(db);
    let updateCount = 0;
    let totalUpdated = 0;

    for (const studentDoc of studentsSnap.docs) {
      const studentId = studentDoc.id;
      const data = studentDoc.data();
      
      const currentStations = data.completedStations || [];
      const currentBooths = data.completedBooths || [];
      
      const loggedCheckins = studentCheckins.get(studentId);
      
      if (loggedCheckins) {
        let hasChanges = false;
        
        const mergedStations = new Set(currentStations);
        const mergedBooths = new Set(currentBooths);

        loggedCheckins.stations.forEach(s => {
          if (!mergedStations.has(s)) {
            mergedStations.add(s);
            hasChanges = true;
          }
        });

        loggedCheckins.booths.forEach(b => {
          if (!mergedBooths.has(b)) {
            mergedBooths.add(b);
            hasChanges = true;
          }
        });

        if (hasChanges) {
          batch.update(studentDoc.ref, {
            completedStations: Array.from(mergedStations),
            completedBooths: Array.from(mergedBooths)
          });
          updateCount++;
          totalUpdated++;

          if (updateCount === 400) {
            await batch.commit();
            console.log(`Committed a batch of 400. Total updated: ${totalUpdated}`);
            batch = writeBatch(db);
            updateCount = 0;
          }
        }
      }
    }

    if (updateCount > 0) {
      await batch.commit();
      console.log(`Committed remaining ${updateCount} records. Total updated: ${totalUpdated}`);
    }

    console.log(`SUCCESS: Restored data for ${totalUpdated} students.`);
    process.exit(0);

  } catch (error) {
    console.error("Error restoring data:", error);
    process.exit(1);
  }
}

restoreData();
