import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Award, 
  Radio, 
  UserCheck, 
  CheckCircle2, 
  Sparkles,
  Phone,
  Layers,
  ArrowRight,
  Gamepad2,
  Trophy
} from 'lucide-react';
import { Station, Student } from '../types';

interface StationDetailModalProps {
  station: Station | null;
  onClose: () => void;
  student: Student | null;
  onOpenCheckin: () => void;
}

export const StationDetailModal: React.FC<StationDetailModalProps> = ({
  station,
  onClose,
  student,
  onOpenCheckin,
}) => {
  if (!station) return null;

  const isCompleted = student?.completedStations.includes(station.id);
  const checkinInfo = student?.checkinHistory.find((c) => c.stationId === station.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-orange-500 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Arcade Moodboard Style */}
        <div className={`p-6 text-white bg-gradient-to-r ${station.color} relative overflow-hidden`}>
          <div className="flex items-center justify-between">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black font-mono uppercase tracking-wider backdrop-blur-xs border border-white/30">
              TRẠM SỐ {station.stationNumber} • KHU {station.zone}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center text-3xl shadow-lg backdrop-blur-xs border-2 border-white/40 shrink-0">
              {station.stampBadge}
            </div>
            <div>
              <h3 className="font-display text-xl font-black leading-tight text-white drop-shadow-xs">
                {station.name}
              </h3>
              <p className="text-xs text-white/95 font-bold mt-0.5">
                {station.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Completed banner */}
          {isCompleted && (
            <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-2xl text-emerald-950 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-display font-black block text-xs">🎉 BẠN ĐÃ CHINH PHỤC TRẠM NÀY!</span>
                <span className="text-[11px] text-emerald-800 font-bold">
                  Thời gian ghi nhận: {checkinInfo?.timestamp || 'Đã đóng dấu'}
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="font-display font-black text-slate-900 text-sm">Mô tả hoạt động</h4>
            <p className="text-slate-600 leading-relaxed text-xs font-medium">
              {station.description}
            </p>
          </div>

          {/* Requirements & Mission */}
          <div className="p-4 bg-amber-500/10 border-2 border-orange-200 rounded-2xl space-y-1.5">
            <span className="font-display font-black text-orange-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-600" />
              Nhiệm vụ cần hoàn thành để nhận con dấu:
            </span>
            <p className="text-slate-800 font-bold pl-5 leading-relaxed">
              {station.requirements}
            </p>
          </div>

          {/* Location & Station Manager */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
            <div>
              <span className="text-slate-500 block font-bold text-[11px]">Vị trí trạm</span>
              <span className="text-slate-900 font-bold mt-0.5 block">{station.location}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-bold text-[11px]">Thời gian ước tính</span>
              <span className="text-slate-900 font-bold mt-0.5 block">{station.estimatedMinutes} phút</span>
            </div>
            <div>
              <span className="text-slate-500 block font-bold text-[11px]">Quản lý trạm</span>
              <span className="text-slate-900 font-bold mt-0.5 block">{station.managerName}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-bold text-[11px]">Thẻ NFC UID</span>
              <span className="text-orange-600 font-mono font-bold mt-0.5 block">{station.nfcTagId}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Đóng
          </button>

          {!isCompleted ? (
            <button
              onClick={() => {
                onClose();
                onOpenCheckin();
              }}
              className="arcade-btn-orange px-5 py-2.5 rounded-xl text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer uppercase"
            >
              <Radio className="w-4 h-4" />
              <span>Chạm NFC / Điểm danh Trạm này</span>
            </button>
          ) : (
            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl">✓ Đã có trong Hộ chiếu</span>
          )}
        </div>
      </div>
    </div>
  );
};
