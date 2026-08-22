import React from 'react';
import { 
  Calendar, 
  MapPin, 
  QrCode, 
  UserCheck, 
  Radio, 
  BarChart3, 
  BookOpen, 
  Sparkles,
  Users,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { Student } from '../types';

interface NavbarProps {
  activeTab: 'timeline' | 'student_pass' | 'map' | 'checkin' | 'manager' | 'nfc_guide' | 'analytics';
  setActiveTab: (tab: 'timeline' | 'student_pass' | 'map' | 'checkin' | 'manager' | 'nfc_guide' | 'analytics') => void;
  activeStudent: Student | null;
  onOpenRegisterModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeStudent,
  onOpenRegisterModal,
}) => {
  const completedCount = activeStudent?.completedStations.length || 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center justify-center bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              🎉 2026
            </span>
            <span className="truncate">Chào mừng Tân Sinh Viên! Tham gia 6 trạm sự kiện để nhận ngay phần quà đặc biệt</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-white/90">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-300" />
              <span>Hệ thống Điểm danh NFC & QR Trạm đang hoạt động</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Branding */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
            onClick={() => setActiveTab('timeline')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 leading-tight text-base sm:text-lg flex items-center gap-1.5">
                <span>NGÀY HỘI TÂN SINH VIÊN</span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Cổng thông tin & Điểm danh Hộ chiếu Sự kiện
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-timeline-btn"
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Lịch trình</span>
            </button>

            <button
              id="nav-pass-btn"
              onClick={() => setActiveTab('student_pass')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'student_pass'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Thẻ e-Pass & Dấu Trạm</span>
              {activeStudent && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                  {completedCount}/6
                </span>
              )}
            </button>

            <button
              id="nav-map-btn"
              onClick={() => setActiveTab('map')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Sơ đồ 6 Trạm</span>
            </button>

            <button
              id="nav-checkin-btn"
              onClick={() => setActiveTab('checkin')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'checkin'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Quét NFC / Điểm danh</span>
            </button>

            <button
              id="nav-manager-btn"
              onClick={() => setActiveTab('manager')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'manager'
                  ? 'bg-amber-100 text-amber-900 font-bold'
                  : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Quản lý Trạm (BTC)</span>
            </button>

            <button
              id="nav-nfc-guide-btn"
              onClick={() => setActiveTab('nfc_guide')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'nfc_guide'
                  ? 'bg-purple-100 text-purple-900 font-bold'
                  : 'text-purple-800 bg-purple-50 hover:bg-purple-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>HD Ghi thẻ NFC</span>
            </button>

            <button
              id="nav-analytics-btn"
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Thống kê</span>
            </button>
          </nav>

          {/* Right Action: Active Student Info / Switch Student */}
          <div className="flex items-center gap-2">
            {activeStudent ? (
              <div 
                id="active-user-badge"
                onClick={onOpenRegisterModal}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all"
                title="Bấm để đổi tài khoản sinh viên hoặc xem chi tiết"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {activeStudent.fullName.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-none">
                    {activeStudent.fullName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {activeStudent.mssv} • {completedCount}/6 Trạm
                  </div>
                </div>
              </div>
            ) : (
              <button
                id="header-register-btn"
                onClick={onOpenRegisterModal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Users className="w-4 h-4" />
                <span>Đăng ký tham gia</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar border-t border-slate-100">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 ${
              activeTab === 'timeline' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Lịch trình</span>
          </button>

          <button
            onClick={() => setActiveTab('student_pass')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 ${
              activeTab === 'student_pass' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Thẻ Tân SV ({completedCount}/6)</span>
          </button>

          <button
            onClick={() => setActiveTab('checkin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 ${
              activeTab === 'checkin' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Điểm danh NFC/QR</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 ${
              activeTab === 'map' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Sơ đồ 6 Trạm</span>
          </button>

          <button
            onClick={() => setActiveTab('manager')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 ${
              activeTab === 'manager' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Quản lý Trạm</span>
          </button>

          <button
            onClick={() => setActiveTab('nfc_guide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 ${
              activeTab === 'nfc_guide' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>HD Ghi thẻ</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 ${
              activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Thống kê</span>
          </button>
        </div>
      </div>
    </header>
  );
};
