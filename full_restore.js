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

async function fullRestore() {
  try {
    console.log("Signing in anonymously...");
    await signInAnonymously(auth);

    console.log("Fetching station_checkins audit log...");
    const checkinsRef = collection(db, 'station_checkins');
    const checkinsSnap = await getDocs(checkinsRef);
    console.log(`Found ${checkinsSnap.size} audit logs.`);

    // Group by mssv
    const mssvData = new Map(); // mssv -> { stations: Set, booths: Set, history: Map(stationId -> historyObj) }
    
    checkinsSnap.docs.forEach(doc => {
      const data = doc.data();
      let mssv = data.mssv;
      if (!mssv && data.studentId && data.studentId.startsWith('stu-')) {
        mssv = data.studentId.replace('stu-', '');
      }
      
      if (!mssv) return;
      const stationId = data.stationId;
      if (!stationId) return;

      if (!mssvData.has(mssv)) {
        mssvData.set(mssv, { stations: new Set(), booths: new Set(), history: new Map() });
      }

      const studentRecord = mssvData.get(mssv);

      if (stationId.startsWith('booth-')) {
        studentRecord.booths.add(stationId);
      } else {
        studentRecord.stations.add(stationId);
      }

      // We use stationId + timestamp as key to avoid exact duplicates
      const histKey = `${stationId}_${data.timestamp}`;
      studentRecord.history.set(histKey, {
        stationId: stationId,
        stationName: data.stationName || stationId,
        timestamp: data.timestamp || '',
        method: data.method || 'unknown',
        recordedBy: data.recordedBy || 'Hệ thống'
      });
    });

    console.log(`Grouped checkins for ${mssvData.size} unique students.`);
    console.log("Fetching students collection...");

    const studentsRef = collection(db, 'students');
    const studentsSnap = await getDocs(studentsRef);
    console.log(`Found ${studentsSnap.size} students. Beginning restoration...`);

    let batch = writeBatch(db);
    let updateCount = 0;
    let totalUpdated = 0;

    for (const studentDoc of studentsSnap.docs) {
      const docMssv = studentDoc.id; // Usually the MSSV is the doc ID
      const data = studentDoc.data();
      
      // Fallback if doc.id is not mssv
      const actualMssv = data.mssv || docMssv;
      
      const loggedData = mssvData.get(actualMssv);
      
      if (loggedData) {
        let hasChanges = false;
        
        const mergedStations = new Set(data.completedStations || []);
        const mergedBooths = new Set(data.completedBooths || []);
        const currentHistory = data.checkinHistory || [];
        
        // Convert current history to Map to deduplicate easily
        const historyMap = new Map();
        currentHistory.forEach(h => {
          // using stationId + timestamp as key, if timestamp is generic we just keep it
          const key = `${h.stationId}_${h.timestamp}`;
          historyMap.set(key, h);
        });

        // Merge stations
        loggedData.stations.forEach(s => {
          if (!mergedStations.has(s)) {
            mergedStations.add(s);
            hasChanges = true;
          }
        });

        // Merge booths
        loggedData.booths.forEach(b => {
          if (!mergedBooths.has(b)) {
            mergedBooths.add(b);
            hasChanges = true;
          }
        });

        // Merge history
        for (const [key, histItem] of loggedData.history.entries()) {
          if (!historyMap.has(key)) {
            historyMap.set(key, histItem);
            hasChanges = true;
          }
        }

        if (hasChanges) {
          // Sort history by timestamp roughly (if they are formatted as HH:mm:ss DD/MM/YYYY)
          // Since it's hard to parse arbitrary strings, we'll just convert map to array
          const newHistoryArray = Array.from(historyMap.values());
          
          batch.update(studentDoc.ref, {
            completedStations: Array.from(mergedStations),
            completedBooths: Array.from(mergedBooths),
            checkinHistory: newHistoryArray
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

fullRestore();
