import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import fs from 'fs';

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

async function applyManualCheckins() {
  try {
    const rawData = fs.readFileSync('manual_checkins.json', 'utf8');
    const manualData = JSON.parse(rawData); // { 'booth-vietcombank': [...], 'station-3': [...], 'station-7': [...] }
    
    // Create mapping: MSSV -> { stations: Set, booths: Set }
    const mssvUpdates = new Map();
    
    for (const [stationId, mssvList] of Object.entries(manualData)) {
      for (const mssv of mssvList) {
        if (!mssvUpdates.has(mssv)) {
          mssvUpdates.set(mssv, { stations: new Set(), booths: new Set() });
        }
        if (stationId.startsWith('booth-')) {
          mssvUpdates.get(mssv).booths.add(stationId);
        } else {
          mssvUpdates.get(mssv).stations.add(stationId);
        }
      }
    }

    console.log("Signing in anonymously...");
    await signInAnonymously(auth);
    console.log("Signed in. Fetching students...");

    const studentsRef = collection(db, 'students');
    const snapshot = await getDocs(studentsRef);
    console.log(`Found ${snapshot.size} students. Processing manual check-ins...`);

    let batch = writeBatch(db);
    let updateCount = 0;
    let totalUpdated = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const mssv = data.mssv;
      
      if (mssvUpdates.has(mssv)) {
        const updateData = mssvUpdates.get(mssv);
        const currentStations = data.completedStations || [];
        const currentBooths = data.completedBooths || [];
        
        let hasChanges = false;
        const mergedStations = new Set(currentStations);
        const mergedBooths = new Set(currentBooths);

        updateData.stations.forEach(s => {
          if (!mergedStations.has(s)) {
            mergedStations.add(s);
            hasChanges = true;
          }
        });

        updateData.booths.forEach(b => {
          if (!mergedBooths.has(b)) {
            mergedBooths.add(b);
            hasChanges = true;
          }
        });

        if (hasChanges) {
          batch.update(doc.ref, {
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

    console.log(`SUCCESS: Applied manual check-ins for ${totalUpdated} students.`);
    process.exit(0);

  } catch (error) {
    console.error("Error applying manual check-ins:", error);
    process.exit(1);
  }
}

applyManualCheckins();
