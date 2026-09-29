import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import * as fs from 'fs';

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

const files = [
  'manual_checkins.json',
  'manual_checkins_tnk.json',
  'manual_checkins_tram8.json',
  'manual_checkins_oppo.json',
  'manual_checkins_batch3.json',
  'manual_checkins_tram12.json',
  'manual_checkins_batch4.json'
];

const stationNames = {
  'station-1': 'Trạm 1: Workshop “Green Vibes SGU – Xanh cùng SGU!”',
  'station-2': 'Trạm 2: Sân Chơi “Kỳ Thủ SGU Tranh Tài”',
  'station-3': 'Trạm 3: Khu vực “SGUers’ Cultural Nexus - Giao điểm Văn hoá”',
  'station-4': 'Trạm 4: Kỷ nguyên AI: Xây dựng "người bạn số"',
  'station-5': 'Trạm 5: Toạ đàm “Sinh viên 5 tốt - Hành trình tiến đến danh hiệu cao quý”',
  'station-6': 'Trạm 6: Tập huấn “Kỹ năng Sơ cấp cứu cơ bản và An toàn giao thông”',
  'station-7': 'Trạm 7: Talkshow “Chăm sóc sức khỏe Tinh thần – Decode Stress”',
  'station-8': 'Trạm 8: Tọa đàm “Decode Stress - Gỡ rối nút thắt”',
  'station-9': 'Trạm 9: Sân chơi “Thanh niên khỏe SGU 2026”',
  'station-10': 'Trạm 10: Khu vực “Check - in” Ngày hội',
  'station-11': 'Trạm 11: Phiên chợ sinh viên',
  'station-12': 'Trạm 12: Đăng ký Câu lạc bộ - Đội - Nhóm',
  'booth-agribank': 'Gian hàng Agribank (Trạm 11)',
  'booth-vietcombank': 'Gian hàng Vietcombank (Trạm 11)',
  'booth-oppo': 'Gian hàng Oppo (Trạm 11)',
  'booth-viettel': 'Gian hàng Viettel (Trạm 11)',
  'booth-im': 'Trung tâm tiếng Anh IM (Trạm 11)',
  'booth-weset': 'Gian hàng Weset (Trạm 11)'
};

async function importAllManual() {
  try {
    const mssvUpdates = new Map(); // mssv -> Set of station/booth IDs
    
    // Read all JSON files
    for (const file of files) {
      if (fs.existsSync(file)) {
        console.log(`Reading ${file}...`);
        const raw = fs.readFileSync(file, 'utf8');
        const data = JSON.parse(raw);
        
        for (const [stationId, mssvList] of Object.entries(data)) {
          for (const mssv of mssvList) {
            if (!mssvUpdates.has(mssv)) {
              mssvUpdates.set(mssv, new Set());
            }
            mssvUpdates.get(mssv).add(stationId);
          }
        }
      }
    }
    
    console.log(`Parsed manual data for ${mssvUpdates.size} unique students.`);
    
    console.log("Signing in anonymously...");
    await signInAnonymously(auth);
    console.log("Fetching students...");
    
    const studentsRef = collection(db, 'students');
    const snapshot = await getDocs(studentsRef);
    console.log(`Found ${snapshot.size} students. Merging manual check-ins...`);
    
    let batch = writeBatch(db);
    let updateCount = 0;
    let totalUpdated = 0;
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const mssv = data.mssv || doc.id;
      
      if (mssvUpdates.has(mssv)) {
        const manualIds = mssvUpdates.get(mssv);
        
        const currentStations = new Set(data.completedStations || []);
        const currentBooths = new Set(data.completedBooths || []);
        const currentHistory = data.checkinHistory || [];
        
        let hasChanges = false;
        
        for (const stId of manualIds) {
          if (stId.startsWith('booth-')) {
            if (!currentBooths.has(stId)) {
              currentBooths.add(stId);
              hasChanges = true;
            }
          } else {
            if (!currentStations.has(stId)) {
              currentStations.add(stId);
              hasChanges = true;
            }
          }
          
          // Check if history already has manual_excel for this station
          const hasManualHistory = currentHistory.some(h => h.stationId === stId && h.method === 'manual_excel');
          if (!hasManualHistory) {
            currentHistory.push({
              stationId: stId,
              stationName: stationNames[stId] || stId,
              timestamp: 'Ghi nhận thủ công từ danh sách Excel',
              method: 'manual_excel',
              recordedBy: 'BTC'
            });
            hasChanges = true;
          }
        }
        
        if (hasChanges) {
          batch.update(doc.ref, {
            completedStations: Array.from(currentStations),
            completedBooths: Array.from(currentBooths),
            checkinHistory: currentHistory
          });
          
          updateCount++;
          totalUpdated++;
          
          if (updateCount === 400) {
            await batch.commit();
            console.log(`Committed batch of 400. Total updated: ${totalUpdated}`);
            batch = writeBatch(db);
            updateCount = 0;
          }
        }
      }
    }
    
    if (updateCount > 0) {
      await batch.commit();
      console.log(`Committed remaining ${updateCount}. Total updated: ${totalUpdated}`);
    }
    
    console.log(`SUCCESS: Successfully restored all manual Excel checkins for ${totalUpdated} students.`);
    process.exit(0);
    
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

importAllManual();
