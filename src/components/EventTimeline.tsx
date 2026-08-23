import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Bookmark, 
  Award, 
  Users, 
  ShieldCheck, 
  Zap, 
  Gamepad2,
  Flame,
  ArrowRight,
  Trophy,
  Compass,
  Star,
  CheckCircle2,
  PartyPopper
} from 'lucide-react';
import { TimelineEvent, Station } from '../types';
import { TIMELINE_EVENTS } from '../data/mockData';
import campusImg from '@/ẢNH TRƯỜNG.webp';
import sguLogo from '@/CỤM LOGO SGU.png';

interface EventTimelineProps {
  stations: Station[];
  onOpenCheckin: () => void;
  onOpenRegisterModal: () => void;
  onSelectStation: (station: Station) => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  stations,
  onOpenCheckin,
  onOpenRegisterModal,
  onSelectStation,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['act-1', 'act-2', 'act-3', 'act-18']);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredEvents = TIMELINE_EVENTS.filter((evt) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'checkin_stations') return evt.isCheckinStation;
    if (selectedFilter === 'highlight') return evt.isHighlight;
    if (selectedFilter === 'main_stage') return evt.category === 'main_stage' || evt.category === 'ceremony' || evt.category === 'gala';
    if (selectedFilter === 'talkshow') return evt.title.toLowerCase().includes('tọa đàm') || evt.title.toLowerCase().includes('toạ đàm') || evt.title.toLowerCase().includes('workshop');
    if (selectedFilter === 'exhibition') return evt.category === 'exhibition' || evt.category === 'market_food';
    return true;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* SGU'S DAY 2025 - HERO BANNER WITH SGU CAMPUS PHOTO BACKGROUND */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-orange-400/80 p-1 sm:p-2 text-white">
        {/* Campus Photo Background */}
        <img 
          src={campusImg} 
          alt="Khuôn viên Trường Đại học Sài Gòn" 
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        {/* Cinematic Dark Gradient & Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/75 to-slate-950/90 pointer-events-none" />
        
        {/* Decorative Top Arcade Header Strip */}
        <div className="relative z-10 backdrop-blur-[1px] rounded-2xl p-4 sm:p-8 overflow-hidden">
          {/* Halftone & Glow Overlays */}
          <div className="absolute inset-0 bg-halftone opacity-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-500/0 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Marquee Badges Row */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-white/20">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/95 text-slate-900 font-extrabold text-[11px] uppercase tracking-wider shadow-md border border-white/40 backdrop-blur-xs">
              <img 
                src={sguLogo} 
                alt="Cụm Logo SGU" 
                className="h-6 w-auto object-contain"
              />
              <span className="text-blue-950 font-black">HỘI SINH VIÊN TRƯỜNG ĐẠI HỌC SÀI GÒN</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black font-mono px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                ĐẠI HỘI IX (2025 - 2028)
              </span>
              <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                LEVEL UP 2025
              </span>
            </div>
          </div>

          {/* Main Hero Title & Visual Arcade Centerpiece */}
          <div className="relative z-10 my-6 sm:my-8 text-center space-y-4">
            <div className="inline-block animate-arcade-glow">
              {/* Logo Cluster with Arcade Frame */}
              <div className="flex items-center justify-center mb-3">
                <div className="p-2.5 bg-white/95 rounded-3xl shadow-[0_8px_0_#ea580c,0_15px_30px_rgba(0,0,0,0.4)] border-2 border-amber-300 inline-flex items-center justify-center backdrop-blur-md hover:scale-105 transition-transform duration-200">
                  <img 
                    src={sguLogo} 
                    alt="Cụm Logo Trường Đại Học Sài Gòn & Hội Sinh Viên" 
                    className="h-14 sm:h-20 w-auto object-contain"
                  />
                </div>
              </div>

              {/* Arcade Sub-badge */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="inline-flex items-center gap-2 bg-black/40 border border-amber-300/60 backdrop-blur-md px-4 py-1 rounded-full text-amber-300 text-xs sm:text-sm font-arcade tracking-widest uppercase shadow-md">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>CHÀO ĐÓN TÂN SINH VIÊN KHÓA 2025</span>
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                </span>
              </div>

              {/* 3D Impressive Arcade Hero Title */}
              <div className="py-2">
                <h1 className="font-arcade-title text-5xl sm:text-7xl md:text-8xl tracking-wider leading-none select-none flex items-center justify-center flex-wrap gap-x-3 sm:gap-x-4 gap-y-2">
                  <span className="text-white drop-shadow-[0_4px_0_#0284c7] sm:drop-shadow-[0_8px_0_#0369a1] filter">
                    SGU’S
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-orange-500 arcade-text-3d-orange">
                    DAY
                  </span>
                  <span className="inline-flex items-center px-3.5 py-1 sm:px-5 sm:py-1.5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-blue-600 via-indigo-600 to-blue-900 text-amber-300 font-arcade text-3xl sm:text-5xl md:text-6xl border-2 sm:border-4 border-amber-300 shadow-[0_6px_0_#1e3a8a,0_12px_24px_rgba(0,0,0,0.6)] transform -rotate-3 hover:rotate-0 transition-transform duration-200">
                    2025
                  </span>
                </h1>
              </div>

              {/* Arcade Action Ribbon */}
              <div className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white px-5 sm:px-6 py-1.5 sm:py-2 rounded-full font-arcade text-xs sm:text-sm tracking-wider uppercase shadow-[0_4px_0_#c2410c,0_8px_20px_rgba(234,88,12,0.4)] border-2 border-white/90">
                <Gamepad2 className="w-4 h-4 text-white animate-bounce" />
                <span>HỘ CHIẾU ĐIỆN TỬ & CHINH PHỤC 8 TRẠM NGÀY HỘI</span>
              </div>
            </div>

            <p className="max-w-2xl mx-auto text-orange-100 text-xs sm:text-sm leading-relaxed font-medium">
              Chủ Nhật, ngày <strong>19/10/2025</strong> tại Cơ sở chính ĐH Sài Gòn (273 An Dương Vương). Khám phá chuỗi <strong>18 hoạt động</strong> bùng nổ, điểm danh <strong>8 trạm NFC một chạm</strong> để hoàn thành Hộ chiếu điện tử và tham gia Gala Chung kết!
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                id="hero-register-pass-btn"
                onClick={onOpenRegisterModal}
                className="arcade-btn-orange px-6 py-3 rounded-2xl text-white font-black text-xs sm:text-sm tracking-wide uppercase cursor-pointer flex items-center gap-2"
              >
                <PartyPopper className="w-4 h-4 text-amber-300" />
                <span>Nhận Thẻ e-Pass Tân Sinh Viên</span>
              </button>

              <button
                id="hero-scan-nfc-btn"
                onClick={onOpenCheckin}
                className="arcade-btn-blue px-6 py-3 rounded-2xl text-white font-black text-xs sm:text-sm tracking-wide uppercase cursor-pointer flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Chạm NFC / Quét QR Trạm</span>
              </button>
            </div>
          </div>

          {/* Arcade Stats Counter Footer */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-white/15 text-center">
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
              <span className="block text-2xl font-black text-amber-300 font-display">18</span>
              <span className="text-[10px] text-orange-100 font-bold uppercase">Hoạt động thực tế</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
              <span className="block text-2xl font-black text-emerald-300 font-display">8 TRẠM</span>
              <span className="text-[10px] text-orange-100 font-bold uppercase">Điểm danh NFC/QR</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
              <span className="block text-2xl font-black text-blue-300 font-display">5/8+</span>
              <span className="text-[10px] text-orange-100 font-bold uppercase">Mốc hoàn thành tốt</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
              <span className="block text-2xl font-black text-pink-300 font-display">100%</span>
              <span className="text-[10px] text-orange-100 font-bold uppercase">Sinh Viên 5 Tốt SGU</span>
            </div>
          </div>
        </div>
      </div>

      {/* 8 CHECK-IN STATIONS ARCADE GRID (Moodboard Style Level Badges) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-display font-black text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-600" />
              <span>8 Trạm Điểm Danh Một Chạm (NFC / QR)</span>
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              8 trạm điểm danh cốt lõi ngày hội theo Kế hoạch 10/KH-BTK.
            </p>
          </div>
          <div className="bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1 rounded-xl text-xs font-black self-start sm:self-auto flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>Chinh phục 8 trạm ngày hội để ghi dấu ấn vào Hộ Chiếu Điện Tử</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {stations.map((st) => (
            <div
              key={st.id}
              onClick={() => onSelectStation(st)}
              className="bg-white p-4 rounded-2xl border-2 border-orange-200 hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group transform hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-100/50 rounded-bl-full pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-orange-600 text-white shadow-2xs">
                  TRẠM {st.stationNumber}
                </span>
                <span className="text-2xl group-hover:scale-125 transition-transform">{st.stampBadge}</span>
              </div>

              <div className="mt-3 relative z-10">
                <span className="text-[10px] text-blue-600 font-bold uppercase font-mono block">
                  Khu {st.zone}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 mt-0.5">
                  {st.shortName}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {st.location}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-orange-600 relative z-10">
                <span className="text-slate-600 truncate pr-1 text-[10px]">{st.assignedUnit || 'LCH Khoa'}</span>
                <span className="shrink-0 flex items-center gap-0.5">
                  Khám phá &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 18 ACTIVITIES TIMELINE SECTION */}
      <div className="bg-white rounded-3xl border-2 border-orange-200 shadow-md p-5 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-display font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Lịch Trình Hoạt Động “SGU’s Day 2025”</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Từ 07g15 đến 21g00 • Đầy đủ thời gian, địa điểm và đơn vị thực hiện
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-100 p-1.5 rounded-2xl shrink-0">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedFilter === 'all' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-700 hover:text-orange-600'
              }`}
            >
              Tất cả hoạt động
            </button>
            <button
              onClick={() => setSelectedFilter('checkin_stations')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedFilter === 'checkin_stations' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:text-blue-600'
              }`}
            >
              ⭐ 8 Trạm Điểm Danh
            </button>
            <button
              onClick={() => setSelectedFilter('main_stage')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedFilter === 'main_stage' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-700 hover:text-orange-600'
              }`}
            >
              Sân khấu chính
            </button>
            <button
              onClick={() => setSelectedFilter('talkshow')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedFilter === 'talkshow' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-700 hover:text-orange-600'
              }`}
            >
              Toạ đàm & Workshop
            </button>
            <button
              onClick={() => setSelectedFilter('exhibition')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedFilter === 'exhibition' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-700 hover:text-orange-600'
              }`}
            >
              Triển lãm & Ẩm thực
            </button>
          </div>
        </div>

        {/* 18 Timeline Events List */}
        <div className="space-y-4">
          {filteredEvents.map((evt) => {
            const isBookmarked = bookmarkedIds.includes(evt.id);
            const correspondingStation = evt.stationId ? stations.find((s) => s.id === evt.stationId) : null;

            return (
              <div
                key={evt.id}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  evt.isCheckinStation
                    ? 'bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-white border-orange-300 shadow-xs ring-2 ring-orange-400/20'
                    : evt.isHighlight
                    ? 'bg-gradient-to-r from-blue-50/50 to-white border-blue-200'
                    : 'bg-white border-slate-200 hover:border-orange-200'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Time Badge - Clean Time Only */}
                  <div className={`rounded-2xl p-2.5 sm:p-3 text-center min-w-[90px] sm:min-w-[105px] shrink-0 shadow-xs flex flex-col items-center justify-center ${
                    evt.isCheckinStation ? 'bg-orange-600 text-white' : 'bg-slate-900 text-white'
                  }`}>
                    <Clock className="w-3.5 h-3.5 text-amber-300 mb-1" />
                    <span className="block text-xs sm:text-sm font-extrabold text-white font-mono leading-tight">{evt.time}</span>
                    <span className="block text-[10px] text-slate-300 font-mono mt-0.5">đến {evt.endTime}</span>
                  </div>

                  {/* Content Details */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display font-black text-sm sm:text-base text-slate-950">
                        {evt.title}
                      </span>

                      {evt.isCheckinStation && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white shadow-xs flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                          TRẠM ĐIỂM DANH ({correspondingStation?.stampBadge})
                        </span>
                      )}

                      {evt.isHighlight && !evt.isCheckinStation && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          ⭐ Trọng tâm
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {evt.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span className="truncate"><strong>Địa điểm:</strong> {evt.location}</span>
                      </div>

                      {evt.inCharge && (
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate"><strong>Phụ trách:</strong> {evt.inCharge}</span>
                        </div>
                      )}

                      {evt.assignedUnit && (
                        <div className="flex items-center gap-1.5 sm:col-span-2">
                          <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-slate-700"><strong>Phân công:</strong> {evt.assignedUnit}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick action for check-in stations */}
                    {correspondingStation && (
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => onSelectStation(correspondingStation)}
                          className="text-xs font-black text-orange-600 hover:text-orange-800 flex items-center gap-1"
                        >
                          Xem thông tin trạm #{correspondingStation.stationNumber} &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bookmark Toggle */}
                <div className="sm:self-center shrink-0 flex items-center justify-end">
                  <button
                    onClick={() => toggleBookmark(evt.id)}
                    className={`p-2.5 rounded-xl border-2 transition-all ${
                      isBookmarked
                        ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                    title={isBookmarked ? 'Đã lưu vào lịch nhắc' : 'Lưu vào lịch nhắc'}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
