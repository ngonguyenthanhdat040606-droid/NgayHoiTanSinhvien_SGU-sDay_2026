import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  ArrowRight, 
  Radio, 
  Gift, 
  Clock, 
  Users,
  Compass,
  Zap
} from 'lucide-react';
import { Station, Student } from '../types';

interface InteractiveMapProps {
  stations: Station[];
  student: Student | null;
  onSelectStation: (station: Station) => void;
  onOpenCheckin: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  stations,
  student,
  onSelectStation,
  onOpenCheckin,
}) => {
  const [selectedZone, setSelectedZone] = useState<'all' | 'A' | 'B' | 'C' | 'D'>('all');
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null);

  const filteredStations = selectedZone === 'all'
    ? stations
    : stations.filter((s) => s.zone === selectedZone);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Map Header & Zone Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-blue-600" />
            <span>Sơ Đồ Khuôn Viên 6 Trạm Ngày Hội</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Khám phá vị trí các trạm trải nghiệm, sân khấu trung tâm và khu vực đổi quà lưu niệm.
          </p>
        </div>

        {/* Zone Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedZone('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedZone === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả (6 Trạm)
          </button>
          <button
            onClick={() => setSelectedZone('A')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedZone === 'A' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Khu A (Sảnh Chính)
          </button>
          <button
            onClick={() => setSelectedZone('B')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedZone === 'B' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Khu B (Tech & Game)
          </button>
          <button
            onClick={() => setSelectedZone('C')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedZone === 'C' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Khu C (CLB & Kỹ Năng)
          </button>
          <button
            onClick={() => setSelectedZone('D')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedZone === 'D' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Khu D (Đổi Quà Gala)
          </button>
        </div>
      </div>

      {/* SVG Interactive Campus Map Layout */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold font-mono tracking-wider uppercase text-blue-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            CAMPUS 2026 - BẢN ĐỒ TỌA ĐỘ TRỰC QUAN
          </span>
          <span className="text-xs text-slate-400 hidden sm:block">
            Nhấp vào bất kỳ trạm nào để xem chi tiết & nhiệm vụ
          </span>
        </div>

        {/* Map Diagram Canvas Container */}
        <div className="relative w-full aspect-16/10 bg-slate-950/80 rounded-2xl border border-slate-800 p-4 overflow-hidden flex flex-col justify-between">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

          {/* Sân Khấu Chính & Hội Trường (Center North) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-lg border border-violet-400/40 flex items-center gap-2">
            <span>🎭 SÂN KHẤU TRUNG TÂM & HỘI TRƯỜNG LỚN</span>
          </div>

          {/* 6 STATIONS PLACED ON CAMPUS GRID */}
          <div className="relative z-10 w-full h-full my-8 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 items-center">
            {stations.map((st) => {
              const isCheckedIn = student?.completedStations.includes(st.id);
              const isDimmed = selectedZone !== 'all' && st.zone !== selectedZone;

              return (
                <div
                  key={st.id}
                  id={`map-node-${st.id}`}
                  onClick={() => onSelectStation(st)}
                  onMouseEnter={() => setHoveredStation(st)}
                  onMouseLeave={() => setHoveredStation(null)}
                  className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer transform hover:-translate-y-1 hover:shadow-xl ${
                    isCheckedIn
                      ? 'bg-gradient-to-br from-emerald-950/90 to-teal-950/80 border-emerald-500/70 shadow-emerald-900/30'
                      : 'bg-slate-900/90 border-slate-700/80 hover:border-blue-400'
                  } ${isDimmed ? 'opacity-30 scale-95' : 'opacity-100'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                      Trạm {st.stationNumber} • Khu {st.zone}
                    </span>
                    {isCheckedIn ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-600/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Đã qua trạm
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-mono">
                        {st.estimatedMinutes} phút
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-md ${
                      isCheckedIn ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {st.stampBadge}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-1">
                        {st.shortName}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {st.location}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Thẻ NFC: <strong className="font-mono text-blue-300">{st.nfcTagId}</strong></span>
                    <span className="text-blue-400 font-semibold flex items-center gap-0.5">
                      Chi tiết <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Campus Landmarks Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 relative z-10">
            <div className="flex items-center gap-4">
              <span>🏥 Trạm Y Tế (Sảnh Cổng Tây)</span>
              <span>☕ Khu Ẩm Thực & Nghỉ Chân (Căn Tin D1)</span>
              <span>ℹ️ Quầy Thông Tin Tân Sinh Viên (Sảnh A)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-ping" />
              <span className="text-emerald-400 font-medium">Trực quan thời gian thực</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 6 Detailed Station Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.map((station) => {
          const isDone = student?.completedStations.includes(station.id);

          return (
            <div
              key={station.id}
              className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-md flex flex-col justify-between space-y-4 ${
                isDone ? 'border-emerald-300 ring-1 ring-emerald-400/20' : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Khu vực {station.zone} • Trạm số {station.stationNumber}
                  </span>
                  {isDone && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Đã hoàn thành
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-xs shrink-0">
                    {station.stampBadge}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{station.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                      <span className="line-clamp-1">{station.location}</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {station.description}
                </p>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="text-slate-700 font-semibold flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-amber-500" />
                    <span>Quà tặng trạm:</span>
                  </div>
                  <div className="text-slate-600 pl-4">{station.highlightGift}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectStation(station)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Xem thể lệ trạm &rarr;
                </button>

                <button
                  onClick={onOpenCheckin}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold transition-all"
                >
                  Điểm danh ngay
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
