import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Mic2, 
  Gift, 
  Music, 
  Bookmark, 
  ChevronRight, 
  Layers,
  Award,
  Bell,
  CheckCircle2,
  Users,
  ShieldCheck,
  Zap,
  Flame,
  ArrowRight
} from 'lucide-react';
import { TimelineEvent, Station } from '../types';
import { TIMELINE_EVENTS } from '../data/mockData';

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
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-tr from-blue-700 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-blue-600/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            HỘI SINH VIÊN TRƯỜNG ĐẠI HỌC SÀI GÒN
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Ngày Hội Tân Sinh Viên: “SGU’s Day 2025”
          </h1>

          <p className="text-blue-100 text-xs sm:text-base leading-relaxed">
            Chào mừng tân sinh viên Khóa 2025 với chuỗi <strong>18 hoạt động thực tế</strong> sôi nổi, <strong>8 trạm điểm danh một chạm NFC/QR</strong>, sân chơi rèn luyện Sinh viên 5 tốt và Đại nhạc hội Gala Chung kết bùng nổ!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="hero-register-btn"
              onClick={onOpenRegisterModal}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-400/30 transition-all transform hover:-translate-y-0.5"
            >
              🎉 Đăng ký & Nhận Thẻ Tân Sinh Viên
            </button>

            <button
              id="hero-checkin-btn"
              onClick={onOpenCheckin}
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/30 backdrop-blur-xs transition-all"
            >
              ⚡ Quét Thẻ NFC / QR Trạm
            </button>
          </div>
        </div>
      </div>

      {/* 8 STATIONS QUICK PREVIEW GRID */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>8 Trạm Điểm Danh Tương Tác NFC/QR</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tương ứng các hoạt động số 3, 6, 8, 9, 10, 12, 13, 17 trong Kế hoạch số 10/KH-BTK
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            Tích lũy tối thiểu 5/8 trạm để nhận quà BTC
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stations.map((st) => (
            <div
              key={st.id}
              onClick={() => onSelectStation(st)}
              className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-100">
                  Trạm {st.stationNumber} (HĐ {st.activityNumber})
                </span>
                <span className="text-xl group-hover:scale-125 transition-transform">{st.stampBadge}</span>
              </div>
              <div className="mt-2.5">
                <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{st.shortName}</h4>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{st.location}</p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-blue-600">
                <span className="text-slate-500 truncate pr-1">{st.assignedUnit || 'LCH Khoa'}</span>
                <span className="shrink-0">Chi tiết &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 18 TIMELINE SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Toàn Bộ 18 Hoạt Động Kế Hoạch “SGU’s Day 2025”</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chủ Nhật, ngày 19/10/2025 • Từ 07g15 đến 21g00 tại Cơ sở chính ĐH Sài Gòn
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedFilter === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả (18 HĐ)
            </button>
            <button
              onClick={() => setSelectedFilter('checkin_stations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedFilter === 'checkin_stations' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⭐ 8 Trạm Điểm Danh
            </button>
            <button
              onClick={() => setSelectedFilter('main_stage')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedFilter === 'main_stage' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sân khấu chính
            </button>
            <button
              onClick={() => setSelectedFilter('talkshow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedFilter === 'talkshow' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Toạ đàm & Workshop
            </button>
            <button
              onClick={() => setSelectedFilter('exhibition')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedFilter === 'exhibition' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Triển lãm & Chợ
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
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  evt.isCheckinStation
                    ? 'bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white border-blue-300 shadow-xs ring-1 ring-blue-400/20'
                    : evt.isHighlight
                    ? 'bg-gradient-to-r from-amber-50/40 to-white border-amber-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Time Badge */}
                  <div className="bg-slate-900 text-white rounded-2xl p-2.5 sm:p-3 text-center min-w-[85px] shrink-0 shadow-xs">
                    <span className="block text-[10px] font-mono uppercase text-slate-400">
                      HĐ #{evt.activityNumber}
                    </span>
                    <span className="block text-xs font-bold text-blue-400 font-mono mt-0.5">{evt.time}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">đến {evt.endTime}</span>
                  </div>

                  {/* Content Details */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-slate-900">
                        {evt.activityNumber}. {evt.title}
                      </span>

                      {evt.isCheckinStation && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-2xs flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                          TRẠM ĐIỂM DANH ({correspondingStation?.stampBadge})
                        </span>
                      )}

                      {evt.isHighlight && !evt.isCheckinStation && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          ⭐ Trọng tâm
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate"><strong>Địa điểm:</strong> {evt.location}</span>
                      </div>

                      {evt.inCharge && (
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
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
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
                    className={`p-2.5 rounded-xl border transition-all ${
                      isBookmarked
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
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
