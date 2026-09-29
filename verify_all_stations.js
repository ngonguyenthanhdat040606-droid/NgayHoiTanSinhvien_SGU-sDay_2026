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

async function verifyAllStations() {
  try {
    await signInAnonymously(auth);
    const studentsRef = collection(db, 'students');
    const snapshot = await getDocs(studentsRef);
    
    // stationId -> { total, manual, web, both, onlyManual, onlyWeb }
    const stats = {};
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const completed = [...(data.completedStations || []), ...(data.completedBooths || [])];
      const history = data.checkinHistory || [];
      
      completed.forEach(stId => {
        if (!stats[stId]) {
          stats[stId] = { total: 0, manual: 0, web: 0, both: 0, onlyManual: 0, onlyWeb: 0, noHistory: 0 };
        }
        
        stats[stId].total++;
        
        const hasManual = history.some(h => h.stationId === stId && h.method === 'manual_excel');
        const hasWeb = history.some(h => h.stationId === stId && h.method !== 'manual_excel');
        
        if (hasManual && hasWeb) {
            stats[stId].both++;
            stats[stId].manual++;
            stats[stId].web++;
        } else if (hasManual) {
            stats[stId].onlyManual++;
            stats[stId].manual++;
        } else if (hasWeb) {
            stats[stId].onlyWeb++;
            stats[stId].web++;
        } else {
            stats[stId].noHistory++;
        }
      });
    });

    console.log("=========================================");
    console.log("THỐNG KÊ CHI TIẾT TỪNG TRẠM VÀ GIAN HÀNG");
    console.log("=========================================\n");
    
    // Sort keys logically
    const sortedKeys = Object.keys(stats).sort((a, b) => {
        if (a.startsWith('station-') && b.startsWith('station-')) {
            return parseInt(a.replace('station-', '')) - parseInt(b.replace('station-', ''));
        }
        if (a.startsWith('station-')) return -1;
        if (b.startsWith('station-')) return 1;
        return a.localeCompare(b);
    });

    sortedKeys.forEach(stId => {
        const s = stats[stId];
        console.log(`[${stId.toUpperCase()}] Tổng số bạn hoàn thành: ${s.total}`);
        console.log(`  - Điểm danh qua Web/App (NFC/QR): ${s.web}`);
        console.log(`  - Điểm danh từ file Excel (Thủ công): ${s.manual}`);
        if (s.manual > 0) {
            console.log(`  - Trùng lặp (vừa Web vừa Excel): ${s.both}`);
            console.log(`  - SỐ BẠN MỚI THÊM VÀO TỪ EXCEL (chưa từng check Web): ${s.onlyManual}`);
        }
        if (s.noHistory > 0) {
            console.log(`  - [Cảnh báo] Có trong danh sách nhưng không có lịch sử (lỗi): ${s.noHistory}`);
        }
        console.log("-----------------------------------------");
    });
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

verifyAllStations();
