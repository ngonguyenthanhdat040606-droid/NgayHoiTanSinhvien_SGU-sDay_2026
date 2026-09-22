import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  ArrowRight, 
  Radio, 
  Clock, 
  Users,
  Compass,
  Zap,
  Building2,
  Flag,
  Flame,
  Award,
  Gamepad2,
  Trophy
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
  const [selectedZone, setSelectedZone] = useState<'all' | 'A' | 'B' | 'C'>('all');
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null);

  const filteredStations = selectedZone === 'all'
    ? stations
    : stations.filter((s) => s.zone === selectedZone);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Map Header & Zone Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-orange-600" />
            <span>Sơ Đồ Khuôn Viên & 9 trạm Ngày Hội SGU’s Day 2026</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
            Cơ sở chính Trường ĐH Sài Gòn (273 An Dương Vương, P. Chợ Quán, TP.HCM).
          </p>
        </div>

        {/* Zone Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl shrink-0 overflow-x-auto no-scrollbar border border-slate-200">
          <button
            onClick={() => setSelectedZone('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              selectedZone === 'all' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-700 hover:text-orange-600'
            }`}
          >
            Tất cả (9 trạm)
          </button>
          <button
            onClick={() => setSelectedZone('A')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              selectedZone === 'A' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            Khu A (Hội trường A & Sảnh)
          </button>
          <button
            onClick={() => setSelectedZone('B')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              selectedZone === 'B' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            Khu B (Sân KLF & Sân Thể Thao)
          </button>
          <button
            onClick={() => setSelectedZone('C')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              selectedZone === 'C' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            Khu C (Sân Nghệ Thuật & HT E)
          </button>
        </div>
      </div>

      {/* SGU Landmark Quick Strip - Moodboard Style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-2xl border-2 border-orange-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block line-clamp-1">Bia Tưởng Niệm</span>
            <span className="text-[11px] text-slate-500 font-medium">628-630 Võ Văn Kiệt (Rước đuốc)</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border-2 border-orange-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-black shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block line-clamp-1">Sân KLF & Sân A</span>
            <span className="text-[11px] text-slate-500 font-medium">Triển lãm 14 LCH, Ẩm thực & Chợ</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border-2 border-orange-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block line-clamp-1">Sảnh HT A & HT E</span>
            <span className="text-[11px] text-slate-500 font-medium">Check-in, VR, Toạ đàm SV5T</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border-2 border-orange-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block line-clamp-1">Sân Khấu Chính</span>
            <span className="text-[11px] text-slate-500 font-medium">Khai mạc, Flashmob & Gala</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Campus Map Layout */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border-2 border-orange-500 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-black tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            BẢN ĐỒ TỌA ĐỘ SGU’S DAY 2026 • 273 AN DƯƠNG VƯƠNG
          </span>
          <span className="text-xs text-orange-200 hidden sm:block font-medium">
            Chạm vào trạm để xem nhiệm vụ và quà tặng
          </span>
        </div>

        {/* Map Diagram Canvas Container */}
        <div className="relative w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 overflow-hidden space-y-6">
          {/* Subtle Halftone Background */}
          <div className="absolute inset-0 bg-halftone opacity-10 pointer-events-none" />

          {/* Sân Khấu Chính & Hội Trường Banner (Center North) */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-2">
            <div className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white text-[11px] font-black shadow-lg border border-red-400/40 flex items-center gap-1.5">
              <span>🔥 BIA TƯỞNG NIỆM NHÀ ĐÈN CHỢ QUÁN</span>
            </div>
            <div className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-slate-950 text-xs font-black shadow-lg border border-white/40 flex items-center gap-2">
              <span>🎭 SÂN KHẤU CHÍNH (KHAI MẠC, ACOUSTIC, FLASHMOB, GALA CHUNG KẾT)</span>
            </div>
          </div>

          {/* 8 CHECK-IN STATIONS PLACED ON CAMPUS GRID */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-stretch">
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
                  className={`relative p-3.5 rounded-2xl border-2 transition-all cursor-pointer transform hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
                    isCheckedIn
                      ? 'bg-gradient-to-br from-emerald-950/90 to-teal-950/90 border-emerald-500 shadow-emerald-900/30'
                      : 'bg-slate-900 border-slate-700 hover:border-orange-400'
                  } ${isDimmed ? 'opacity-30 scale-95' : 'opacity-100'}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-white/10 text-amber-300">
                        Trạm {st.stationNumber} • Khu {st.zone}
                      </span>
                      {isCheckedIn ? (
                        <span className="text-[9px] font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                          Đã qua
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-mono font-bold">
                          {st.estimatedMinutes}p
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-md ${
                        isCheckedIn ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'
                      }`}>
                        {st.stampBadge}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-white truncate">
                          {st.shortName}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {st.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate pr-1 text-slate-400">{st.assignedUnit || 'LCH SV'}</span>
                    <span className="text-amber-400 font-bold shrink-0 flex items-center">
                      Xem <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Campus Landmarks Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 border-t border-slate-800/90 pt-3 relative z-10 font-medium">
            <div className="flex flex-wrap items-center gap-3">
              <span>📍 Sân KLF: Triển Lãm 14 Khoa & CLB</span>
              <span>🍲 Sân Khu A: Phiên Chợ & Ẩm Thực</span>
              <span>🥽 Sảnh HT A: Không Gian Thực Tế Ảo VR</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
              <span className="text-emerald-400 font-bold">Bản đồ trực quan thời gian thực SGU</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 8 Detailed Station Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStations.map((station) => {
          const isDone = student?.completedStations.includes(station.id);

          return (
            <div
              key={station.id}
              className={`bg-white rounded-3xl border-2 p-4 transition-all hover:shadow-lg flex flex-col justify-between space-y-3 ${
                isDone ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-orange-200 hover:border-orange-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-orange-100 text-orange-900">
                    Khu {station.zone} • Trạm {station.stationNumber}
                  </span>
                  {isDone && (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Đã xong
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 mt-2.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
                    {station.stampBadge}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">{station.shortName}</h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
                      <span className="truncate">{station.location}</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed font-medium">
                  {station.description}
                </p>

                <div className="mt-2.5 p-2.5 rounded-2xl bg-amber-500/10 border border-orange-200 text-[11px] space-y-1">
                  <div className="text-orange-950 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    <span>Nhiệm vụ trạm:</span>
                  </div>
                  <div className="text-slate-700 pl-4 truncate font-medium">{station.requirements}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectStation(station)}
                  className="text-xs font-black text-orange-600 hover:text-orange-800 transition-colors cursor-pointer"
                >
                  Chi tiết &rarr;
                </button>

                <button
                  onClick={onOpenCheckin}
                  className="px-3 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-500 hover:text-white text-orange-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Điểm danh
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
