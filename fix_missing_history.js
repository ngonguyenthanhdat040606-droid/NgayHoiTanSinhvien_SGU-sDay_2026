import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch } from 'firebase/firestore';
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

async function fixHistory() {
  try {
    await signInAnonymously(auth);
    const studentsRef = collection(db, 'students');
    const snapshot = await getDocs(studentsRef);
    
    let batch = writeBatch(db);
    let operationCount = 0;
    let totalUpdated = 0;
    
    for (const studentDoc of snapshot.docs) {
      const data = studentDoc.data();
      const history = data.checkinHistory || [];
      const completedStations = data.completedStations || [];
      const completedBooths = data.completedBooths || [];
      
      let changed = false;
      let newHistory = [...history];
      
      const allCompleted = [...completedStations, ...completedBooths];
      
      for (const stId of allCompleted) {
        // Check if this station is in history
        const hasHistory = newHistory.some(h => h.stationId === stId);
        if (!hasHistory) {
          // Add a synthetic history entry
          newHistory.push({
            stationId: stId,
            stationName: stationNames[stId] || stId,
            timestamp: 'Ghi nhận thủ công từ danh sách Excel',
            method: 'manual_excel',
            recordedBy: 'BTC'
          });
          changed = true;
        }
      }
      
      if (changed) {
        batch.update(studentDoc.ref, { checkinHistory: newHistory });
        operationCount++;
        totalUpdated++;
        
        if (operationCount >= 400) {
          await batch.commit();
          console.log(`Committed a batch of 400. Total updated: ${totalUpdated}`);
          batch = writeBatch(db);
          operationCount = 0;
        }
      }
    }
    
    if (operationCount > 0) {
      await batch.commit();
      console.log(`Committed remaining ${operationCount} records. Total updated: ${totalUpdated}`);
    }
    
    console.log(`SUCCESS: Fixed history for ${totalUpdated} students.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fixHistory();
