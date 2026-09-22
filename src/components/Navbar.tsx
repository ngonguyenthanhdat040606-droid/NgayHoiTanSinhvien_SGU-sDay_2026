import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Radio, 
  BarChart3, 
  BookOpen, 
  Sparkles,
  Users,
  ShieldCheck,
  CreditCard,
  Lock,
  Gamepad2,
  Trophy
} from 'lucide-react';
import sguLogo from '@/CỤM LOGO SGU.png';
import { Student } from '../types';
import { isOrganizerAuthenticated } from '../utils/storage';

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
  const isOrganizer = isOrganizerAuthenticated();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-orange-500 shadow-md">
      {/* Top Banner Notice: SGU's Day Moodboard Arcade Marquee */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-blue-600 text-white text-xs py-1.5 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold tracking-wide">
            <span className="inline-flex items-center gap-1 bg-white text-orange-600 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase shadow-sm">
              <Gamepad2 className="w-3.5 h-3.5 text-orange-600" />
              SGU’S DAY 2026
            </span>
            <span className="truncate text-white drop-shadow-xs">
              🎉 Ngày Hội Tân Sinh Viên • Thu thập 8 dấu trạm & Chinh phục SGU’s Day 2026!
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-white font-semibold">
            <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-0.5 rounded-full text-[11px] border border-white/20">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-300" />
              <span>Chạm NFC & QR 9 trạm Siêu Tốc</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Branding - SGU Official Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none shrink-0 group"
            onClick={() => setActiveTab('timeline')}
          >
            {/* SGU Official Logo Cluster */}
            <div className="relative flex items-center justify-center p-1 bg-white rounded-2xl shadow-sm border border-slate-200/90 group-hover:border-orange-400 group-hover:shadow-md transition-all">
              <img 
                src={sguLogo} 
                alt="Cụm Logo SGU - Hội Sinh Viên Trường Đại Học Sài Gòn" 
                className="h-10 sm:h-12 w-auto object-contain transform group-hover:scale-105 transition-transform"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-arcade-title font-black text-slate-950 text-xl sm:text-2xl tracking-wide uppercase drop-shadow-2xs">
                  SGU’S <span className="text-orange-600">DAY</span>
                </span>
                <span className="bg-gradient-to-b from-blue-600 to-indigo-700 text-amber-300 font-arcade text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg shadow-[0_2px_0_#1e3a8a] border border-blue-400/40">
                  2025
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-bold hidden sm:block">
                Hội Sinh Viên Trường Đại Học Sài Gòn
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              id="nav-timeline-btn"
              onClick={() => setActiveTab('timeline')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 ring-2 ring-orange-400'
                  : 'text-slate-700 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>18 Lịch Trình</span>
            </button>

            <button
              id="nav-pass-btn"
              onClick={() => setActiveTab('student_pass')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === 'student_pass'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Thẻ e-Pass ({completedCount}/9 trạm)</span>
              {activeStudent && (
                <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  completedCount >= 5 ? 'bg-amber-400 text-slate-950 animate-pulse' : 'bg-white/20 text-white'
                }`}>
                  {completedCount}/8
                </span>
              )}
            </button>

            <button
              id="nav-map-btn"
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 ring-2 ring-amber-300'
                  : 'text-slate-700 hover:text-amber-700 hover:bg-amber-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Sơ Đồ Khuôn Viên</span>
            </button>

            <button
              id="nav-checkin-btn"
              onClick={() => setActiveTab('checkin')}
              className="arcade-btn-orange px-4 py-2 rounded-xl text-white font-black text-xs flex items-center gap-1.5 uppercase tracking-wide cursor-pointer"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>⚡ Quét NFC / QR</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1.5" />

            {/* Organizer Tools Section */}
            <button
              id="nav-manager-btn"
              onClick={() => setActiveTab('manager')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'manager'
                  ? 'bg-slate-900 text-amber-300 shadow-md'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
              }`}
              title="Dành cho Ban Tổ Chức & Trưởng Trạm"
            >
              {isOrganizer ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <Lock className="w-3.5 h-3.5 text-slate-500" />}
              <span>QL Trạm (BTC)</span>
            </button>

            <button
              id="nav-nfc-guide-btn"
              onClick={() => setActiveTab('nfc_guide')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'nfc_guide'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-900 bg-purple-50 hover:bg-purple-100'
              }`}
              title="Cẩm nang nạp link 8 thẻ NFC cho BTC"
            >
              {isOrganizer ? <BookOpen className="w-4 h-4 text-white" /> : <Lock className="w-3.5 h-3.5 text-purple-700" />}
              <span>HD Ghi Thẻ</span>
            </button>

            <button
              id="nav-analytics-btn"
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-blue-900 bg-blue-50 hover:bg-blue-100'
              }`}
              title="Thống kê và phát thưởng BTC"
            >
              {isOrganizer ? <Trophy className="w-4 h-4 text-amber-300" /> : <Lock className="w-3.5 h-3.5 text-blue-700" />}
              <span>Thống Kê</span>
            </button>
          </nav>

          {/* Right Action: Active Student Info / Switch Student */}
          <div className="flex items-center gap-2">
            {activeStudent ? (
              <div 
                id="active-user-badge"
                onClick={onOpenRegisterModal}
                className="flex items-center gap-2.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-2 border-orange-300 px-3 py-1.5 rounded-2xl cursor-pointer transition-all shadow-xs"
                title="Bấm để đổi tài khoản hoặc chỉnh sửa thông tin"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-xs border border-white">
                  {activeStudent.fullName.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-black text-slate-900 leading-tight line-clamp-1">
                    {activeStudent.fullName}
                  </div>
                  <div className="text-[10px] text-orange-700 font-bold font-mono">
                    {activeStudent.mssv} • <span className="text-emerald-700 font-extrabold">{completedCount}/9 trạm</span>
                  </div>
                </div>
              </div>
            ) : (
              <button
                id="header-register-btn"
                onClick={onOpenRegisterModal}
                className="arcade-btn-blue px-3.5 py-2 rounded-xl text-white font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Users className="w-4 h-4" />
                <span>Đăng ký e-Pass</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar border-t border-slate-100">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 ${
              activeTab === 'timeline' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>18 Lịch Trình</span>
          </button>

          <button
            onClick={() => setActiveTab('student_pass')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 ${
              activeTab === 'student_pass' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>e-Pass ({completedCount}/8)</span>
          </button>

          <button
            onClick={() => setActiveTab('checkin')}
            className="px-3 py-1.5 rounded-xl text-xs font-black shrink-0 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Điểm Danh</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 ${
              activeTab === 'map' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Sơ Đồ 9 trạm</span>
          </button>

          <button
            onClick={() => setActiveTab('manager')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 ${
              activeTab === 'manager' ? 'bg-slate-900 text-amber-300' : 'bg-amber-100 text-amber-900'
            }`}
          >
            {isOrganizer ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Lock className="w-3 h-3 text-amber-700" />}
            <span>QL Trạm</span>
          </button>

          <button
            onClick={() => setActiveTab('nfc_guide')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 ${
              activeTab === 'nfc_guide' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-900'
            }`}
          >
            {isOrganizer ? <BookOpen className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3 text-purple-700" />}
            <span>Ghi Thẻ NFC</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 ${
              activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Thống Kê</span>
          </button>
        </div>
      </div>
    </header>
  );
};
