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
  Bell
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['evt-2', 'evt-3', 'evt-6']);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredEvents = selectedCategory === 'all'
    ? TIMELINE_EVENTS
    : TIMELINE_EVENTS.filter((e) => e.category === selectedCategory);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-tr from-blue-700 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-blue-600/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            CHÀO ĐÓN TÂN SINH VIÊN KHOÁ 2026
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Ngày Hội Tân Sinh Viên 2026: Vươn Ra Biển Lớn
          </h1>

          <p className="text-blue-100 text-xs sm:text-base leading-relaxed">
            Hòa mình vào không khí sôi động với 6 trạm trải nghiệm tương tác, điểm danh một chạm bằng thẻ NFC / mã QR, kết nối bạn bè cùng khóa và mở khóa các phần quà cực xịn từ Ban Tổ chức!
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

      {/* 6 STATIONS QUICK PREVIEW GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>6 Hoạt Động & Trạm Điểm Danh NFC</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mỗi trạm có quản lý trang bị thẻ NFC để điểm danh ghi nhận con dấu Hộ chiếu của bạn
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 hidden sm:block">
            Tích lũy tối thiểu 4/6 trạm để nhận quà
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stations.map((st) => (
            <div
              key={st.id}
              onClick={() => onSelectStation(st)}
              className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  Trạm {st.stationNumber}
                </span>
                <span className="text-xl group-hover:scale-125 transition-transform">{st.stampBadge}</span>
              </div>
              <div className="mt-3">
                <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{st.shortName}</h4>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{st.location}</p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-blue-600">
                <span>{st.rewardPoints} điểm</span>
                <span>Chi tiết &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TIMELINE SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Khung Giờ & Lịch Trình Chi Tiết Ngày Hội</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Thời gian diễn ra các chương trình chính từ 07:30 đến 18:00
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedCategory('main_stage')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'main_stage' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sân khấu chính
            </button>
            <button
              onClick={() => setSelectedCategory('station_activity')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'station_activity' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              6 Trạm sự kiện
            </button>
            <button
              onClick={() => setSelectedCategory('talkshow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'talkshow' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Talkshow
            </button>
            <button
              onClick={() => setSelectedCategory('gala')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'gala' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gala Nhạc hội
            </button>
          </div>
        </div>

        {/* Timeline Events List */}
        <div className="space-y-4">
          {filteredEvents.map((evt) => {
            const isBookmarked = bookmarkedIds.includes(evt.id);

            return (
              <div
                key={evt.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  evt.isHighlight
                    ? 'bg-gradient-to-r from-blue-50/60 to-indigo-50/40 border-blue-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Time Badge */}
                  <div className="bg-slate-900 text-white rounded-2xl p-3 text-center min-w-[80px] shrink-0 shadow-xs">
                    <span className="block text-xs font-bold text-blue-400 font-mono">{evt.time}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">đến {evt.endTime}</span>
                  </div>

                  {/* Content Details */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-slate-900">
                        {evt.title}
                      </h4>
                      {evt.isHighlight && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          ⭐ Trọng tâm
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <strong className="text-slate-700 font-semibold">{evt.location}</strong>
                      </span>

                      {evt.speakers && (
                        <span className="flex items-center gap-1">
                          <Mic2 className="w-3.5 h-3.5 text-purple-600" />
                          <span>Diễn giả: {evt.speakers.join(', ')}</span>
                        </span>
                      )}
                    </div>
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
