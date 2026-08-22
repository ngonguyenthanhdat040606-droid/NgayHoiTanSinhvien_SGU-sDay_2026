import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Navbar 
} from './components/Navbar';
import { 
  StudentCard 
} from './components/StudentCard';
import { 
  InteractiveMap 
} from './components/InteractiveMap';
import { 
  EventTimeline 
} from './components/EventTimeline';
import { 
  StationMasterView 
} from './components/StationMasterView';
import { 
  NFCSetupGuide 
} from './components/NFCSetupGuide';
import { 
  AdminAnalytics 
} from './components/AdminAnalytics';
import { 
  OrganizerAuthGuard 
} from './components/OrganizerAuthGuard';
import { 
  StudentCheckinModal 
} from './components/StudentCheckinModal';
import { 
  RegistrationModal 
} from './components/RegistrationModal';
import { 
  StationDetailModal 
} from './components/StationDetailModal';
import { 
  Station, 
  Student 
} from './types';
import { 
  getStoredStudents, 
  saveStudents, 
  getStoredStations, 
  saveStations, 
  getActiveStudentId, 
  setActiveStudentId, 
  checkinStudentToStation 
} from './utils/storage';
import { 
  Radio, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Heart, 
  ShieldCheck 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'student_pass' | 'map' | 'checkin' | 'manager' | 'nfc_guide' | 'analytics'>('timeline');
  const [students, setStudents] = useState<Student[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [activeStudentId, setStudentIdState] = useState<string | null>(null);
  const [pendingNfcStation, setPendingNfcStation] = useState<Station | null>(null);

  // Modals state
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [selectedDetailStation, setSelectedDetailStation] = useState<Station | null>(null);

  // Global Toast Alert
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Helper function: Robust URL detector for all NFC link formats
  const parseStationFromUrl = (stationsList: Station[]): Station | null => {
    if (typeof window === 'undefined' || !stationsList.length) return null;

    try {
      // 1. Search Query Parameters (e.g. ?checkin=station-1 or ?station=1 or ?tram=1)
      const searchParams = new URLSearchParams(window.location.search);
      const queryVal = searchParams.get('checkin') || searchParams.get('station') || searchParams.get('stationId') || searchParams.get('s') || searchParams.get('tram');
      if (queryVal) {
        const cleanQuery = queryVal.trim().toLowerCase();
        const matched = stationsList.find(
          (s) => s.id.toLowerCase() === cleanQuery || 
                 s.stationNumber.toString() === cleanQuery ||
                 s.id.toLowerCase().replace('station-', '') === cleanQuery
        );
        if (matched) return matched;
      }

      // 2. Hash fragments (e.g. #checkin=station-1, #station=1, #station-1, #tram-1, #s1)
      const hash = window.location.hash;
      if (hash) {
        const cleanHash = hash.replace(/^#\/?/, '').trim();
        if (cleanHash.includes('checkin=')) {
          const val = cleanHash.split('checkin=')[1].split('&')[0].trim().toLowerCase();
          const matched = stationsList.find(
            (s) => s.id.toLowerCase() === val || 
                   s.stationNumber.toString() === val ||
                   s.id.toLowerCase().replace('station-', '') === val
          );
          if (matched) return matched;
        }
        if (cleanHash.includes('station=')) {
          const val = cleanHash.split('station=')[1].split('&')[0].trim().toLowerCase();
          const matched = stationsList.find(
            (s) => s.id.toLowerCase() === val || 
                   s.stationNumber.toString() === val ||
                   s.id.toLowerCase().replace('station-', '') === val
          );
          if (matched) return matched;
        }
        // Direct hash check e.g. #station-1
        const directMatched = stationsList.find(
          (s) => cleanHash.toLowerCase() === s.id.toLowerCase() ||
                 cleanHash.toLowerCase() === `station-${s.stationNumber}` ||
                 cleanHash.toLowerCase() === `tram-${s.stationNumber}` ||
                 cleanHash.toLowerCase() === `s${s.stationNumber}`
        );
        if (directMatched) return directMatched;
      }

      // 3. Pathname segments (e.g. /station-1, /tram-1)
      const pathname = window.location.pathname;
      if (pathname && pathname !== '/') {
        const segments = pathname.toLowerCase().split('/').filter(Boolean);
        for (const seg of segments) {
          const matched = stationsList.find(
            (s) => s.id.toLowerCase() === seg ||
                   `station-${s.stationNumber}` === seg ||
                   `tram-${s.stationNumber}` === seg
          );
          if (matched) return matched;
        }
      }
    } catch (e) {
      console.warn('Error parsing NFC URL', e);
    }

    return null;
  };

  // Initial Load from Storage and URL handling
  useEffect(() => {
    const loadedStudents = getStoredStudents();
    const loadedStations = getStoredStations();
    const currentActiveId = getActiveStudentId();

    setStudents(loadedStudents);
    setStations(loadedStations);
    setStudentIdState(currentActiveId || (loadedStudents[0]?.id ?? null));

    // Handle deep-link tag tapping for both iOS Safari and Android
    const handleUrlCheckin = () => {
      const matched = parseStationFromUrl(loadedStations);
      if (matched) {
        const currentStudent = loadedStudents.find((s) => s.id === currentActiveId) || loadedStudents[0];
        if (currentStudent) {
          const res = checkinStudentToStation(currentStudent.id, matched.id, 'nfc_tap', 'Thẻ NFC Trạm');
          setStudents(getStoredStudents());
          if (res.success) {
            showToast(`🎉 Đã nhận diện thẻ NFC trạm: ${matched.name}!`, 'success');
            setActiveTab('student_pass');
            try {
              confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            } catch (e) {}
          } else {
            showToast(res.message, 'info');
            setActiveTab('student_pass');
          }
        } else {
          // If no student exists yet on this phone (fresh iOS Safari)
          setPendingNfcStation(matched);
          setIsRegisterModalOpen(true);
          showToast(`📱 Đã nhận diện NFC ${matched.name}. Mời bạn đăng ký nhận Thẻ e-Pass!`, 'info');
        }
      }
    };

    handleUrlCheckin();
    window.addEventListener('hashchange', handleUrlCheckin);
    window.addEventListener('popstate', handleUrlCheckin);
    return () => {
      window.removeEventListener('hashchange', handleUrlCheckin);
      window.removeEventListener('popstate', handleUrlCheckin);
    };
  }, []);

  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0] || null;

  // Handler: Checkin from student scanner
  const handleStudentCheckin = (stationId: string, method: 'nfc_tap' | 'qr_scan' | 'manual_mssv') => {
    if (!activeStudent) {
      setIsRegisterModalOpen(true);
      return;
    }

    const res = checkinStudentToStation(activeStudent.id, stationId, method);
    const updatedList = getStoredStudents();
    setStudents(updatedList);

    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'warning');
    }
  };

  // Handler: Organizer Checkin
  const handleOrganizerCheckin = (
    studentMssvOrId: string, 
    stationId: string, 
    method: 'manual_mssv' | 'manager_scan' | 'nfc_tap',
    managerName?: string
  ) => {
    const res = checkinStudentToStation(studentMssvOrId, stationId, method, managerName);
    if (res.success) {
      const updatedList = getStoredStudents();
      setStudents(updatedList);
    }
    return res;
  };

  // Handler: Undo Checkin
  const handleUndoCheckin = (studentId: string, stationId: string) => {
    const updated = students.map((stu) => {
      if (stu.id === studentId) {
        const newStations = stu.completedStations.filter((id) => id !== stationId);
        const newHistory = stu.checkinHistory.filter((c) => c.stationId !== stationId);
        return {
          ...stu,
          completedStations: newStations,
          checkinHistory: newHistory,
          isEligibleForReward: newStations.length >= 5,
        };
      }
      return stu;
    });

    setStudents(updated);
    saveStudents(updated);
    showToast('Đã hủy ghi nhận điểm danh thành công.', 'info');
  };

  // Handler: Register New Student
  const handleRegisterStudent = (data: Omit<Student, 'id' | 'registeredAt' | 'completedStations' | 'checkinHistory' | 'isEligibleForReward' | 'rewardClaimed' | 'luckyDrawCode'>): Student => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const now = new Date();
    const timestamp = now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    let initialCompleted: string[] = [];
    let initialHistory: any[] = [];

    // If student arrived by tapping an NFC tag before registering
    if (pendingNfcStation) {
      initialCompleted = [pendingNfcStation.id];
      initialHistory = [
        {
          stationId: pendingNfcStation.id,
          stationName: pendingNfcStation.name,
          timestamp,
          method: 'nfc_tap',
          verifiedBy: 'Thẻ NFC Trạm',
        },
      ];
    }

    const newStudent: Student = {
      ...data,
      id: `stu-${Date.now()}`,
      registeredAt: timestamp,
      completedStations: initialCompleted,
      checkinHistory: initialHistory,
      isEligibleForReward: initialCompleted.length >= 5,
      rewardClaimed: false,
      luckyDrawCode: `SGU-${randomSuffix}`,
    };

    const updated = [newStudent, ...students];
    setStudents(updated);
    saveStudents(updated);
    setActiveStudentId(newStudent.id);
    setStudentIdState(newStudent.id);

    if (pendingNfcStation) {
      showToast(`🎉 Chào mừng ${newStudent.fullName}! Đã cấp Thẻ e-Pass & đóng dấu ${pendingNfcStation.name}!`, 'success');
      setPendingNfcStation(null);
    } else {
      showToast(`Chào mừng tân sinh viên ${newStudent.fullName}! Đã cấp Thẻ e-Pass.`, 'success');
    }

    setActiveTab('student_pass');
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    return newStudent;
  };

  // Handler: Select Student
  const handleSelectStudent = (student: Student) => {
    setActiveStudentId(student.id);
    setStudentIdState(student.id);
    showToast(`Đã chuyển sang tài khoản: ${student.fullName} (${student.mssv})`, 'info');
  };

  // Handler: Claim Reward
  const handleClaimReward = (studentId: string) => {
    const updated = students.map((s) => {
      if (s.id === studentId) {
        return { ...s, rewardClaimed: true };
      }
      return s;
    });
    setStudents(updated);
    saveStudents(updated);
    showToast('Đã xác nhận trao quà thành công!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'checkin') {
            setIsCheckinModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        activeStudent={activeStudent}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
      />

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-4 duration-200 max-w-md">
          <div className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 ${
            toastMessage.type === 'success'
              ? 'bg-slate-900 text-white border-emerald-500/50'
              : toastMessage.type === 'warning'
              ? 'bg-amber-900 text-white border-amber-500/50'
              : 'bg-blue-900 text-white border-blue-500/50'
          }`}>
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs font-semibold">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'timeline' && (
          <EventTimeline
            stations={stations}
            onOpenCheckin={() => setIsCheckinModalOpen(true)}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            onSelectStation={(st) => setSelectedDetailStation(st)}
          />
        )}

        {activeTab === 'student_pass' && (
          activeStudent ? (
            <StudentCard
              student={activeStudent}
              stations={stations}
              onOpenCheckin={() => setIsCheckinModalOpen(true)}
              onSelectStation={(st) => setSelectedDetailStation(st)}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            />
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mx-auto">
                🎫
              </div>
              <h3 className="text-xl font-bold text-slate-900">Chưa có Thẻ Tân Sinh Viên</h3>
              <p className="text-xs text-slate-500">
                Hãy đăng ký thông tin để nhận ngay thẻ e-Pass cá nhân hóa và bắt đầu thu thập 8 con dấu trạm sự kiện SGU’s Day 2025!
              </p>
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Đăng ký nhận thẻ ngay
              </button>
            </div>
          )
        )}

        {activeTab === 'map' && (
          <InteractiveMap
            stations={stations}
            student={activeStudent}
            onSelectStation={(st) => setSelectedDetailStation(st)}
            onOpenCheckin={() => setIsCheckinModalOpen(true)}
          />
        )}

        {activeTab === 'manager' && (
          <OrganizerAuthGuard
            title="Bàn Quản Lý 8 Trạm Sự Kiện (BTC)"
            subtitle="Chỉ dành cho Ban Tổ Chức & Trưởng Trạm để điểm danh thủ công, tra cứu sinh viên và xuất dữ liệu."
            onBackToStudent={() => setActiveTab('student_pass')}
          >
            <StationMasterView
              stations={stations}
              students={students}
              onCheckinStudent={handleOrganizerCheckin}
              onUndoCheckin={handleUndoCheckin}
              onOpenNfcGuide={() => setActiveTab('nfc_guide')}
            />
          </OrganizerAuthGuard>
        )}

        {activeTab === 'nfc_guide' && (
          <OrganizerAuthGuard
            title="Hướng Dẫn & Nạp 8 Thẻ NFC Trạm (BTC)"
            subtitle="Khu vực cấu hình và ghi dữ liệu thẻ NFC dành cho Ban Kỹ thuật & Tổ chức."
            onBackToStudent={() => setActiveTab('student_pass')}
          >
            <NFCSetupGuide stations={stations} />
          </OrganizerAuthGuard>
        )}

        {activeTab === 'analytics' && (
          <OrganizerAuthGuard
            title="Trung Tâm Thống Kê & Danh Sách Quà (BTC)"
            subtitle="Quản lý tiến độ toàn trường, duyệt đổi quà và xuất file danh sách sinh viên."
            onBackToStudent={() => setActiveTab('student_pass')}
          >
            <AdminAnalytics
              students={students}
              stations={stations}
              onClaimReward={handleClaimReward}
            />
          </OrganizerAuthGuard>
        )}
      </main>

      {/* Modals */}
      <StudentCheckinModal
        isOpen={isCheckinModalOpen}
        onClose={() => setIsCheckinModalOpen(false)}
        student={activeStudent}
        stations={stations}
        onCheckinSuccess={handleStudentCheckin}
      />

      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => {
          setIsRegisterModalOpen(false);
          setPendingNfcStation(null);
        }}
        students={students}
        activeStudent={activeStudent}
        pendingStation={pendingNfcStation}
        onSelectStudent={handleSelectStudent}
        onRegisterStudent={handleRegisterStudent}
      />

      <StationDetailModal
        station={selectedDetailStation}
        onClose={() => setSelectedDetailStation(null)}
        student={activeStudent}
        onOpenCheckin={() => {
          setSelectedDetailStation(null);
          setIsCheckinModalOpen(true);
        }}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white/80 backdrop-blur-xs py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SGU’s Day 2025</span>
            <span>•</span>
            <span>Đoàn Thanh niên - Hội Sinh viên Trường Đại học Sài Gòn</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Hỗ trợ thẻ NFC ISO 14443-3A (Mifare Classic 1K)</span>
            <span>•</span>
            <span>Web NFC & QR Dynamic Check-in 8 Trạm</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
