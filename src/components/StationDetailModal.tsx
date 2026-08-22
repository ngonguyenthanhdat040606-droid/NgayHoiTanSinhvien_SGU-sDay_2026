import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Gift, 
  Award, 
  Radio, 
  UserCheck, 
  CheckCircle2, 
  Sparkles,
  Phone,
  Layers,
  ArrowRight
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`p-6 text-white bg-gradient-to-r ${station.color} relative overflow-hidden`}>
          <div className="flex items-center justify-between">
            <span className="bg-white/20 px-2.5 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider backdrop-blur-xs">
              Trạm số {station.stationNumber} • Khu {station.zone}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center text-3xl shadow-md backdrop-blur-xs shrink-0">
              {station.stampBadge}
            </div>
            <div>
              <h3 className="text-xl font-extrabold leading-tight text-white">
                {station.name}
              </h3>
              <p className="text-xs text-white/90 font-medium mt-0.5">
                {station.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Completed banner */}
          {isCompleted && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">Bạn đã vượt qua trạm này!</span>
                <span className="text-[11px] text-emerald-700">
                  Thời gian ghi nhận: {checkinInfo?.timestamp || 'Đã đóng dấu'}
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-800 text-sm">Mô tả hoạt động</h4>
            <p className="text-slate-600 leading-relaxed text-xs">
              {station.description}
            </p>
          </div>

          {/* Requirements & Mission */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Thử thách cần hoàn thành để nhận dấu:
            </span>
            <p className="text-slate-700 font-medium pl-5">
              {station.requirements}
            </p>
          </div>

          {/* Location & Station Manager */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-400 block font-medium">Vị trí trạm</span>
              <span className="text-slate-800 font-bold mt-0.5 block">{station.location}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Thời gian ước tính</span>
              <span className="text-slate-800 font-bold mt-0.5 block">{station.estimatedMinutes} phút</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Quản lý trạm</span>
              <span className="text-slate-800 font-bold mt-0.5 block">{station.managerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Thẻ NFC UID</span>
              <span className="text-blue-600 font-mono font-bold mt-0.5 block">{station.nfcTagId}</span>
            </div>
          </div>

          {/* Highlight Gift */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
            <Gift className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold text-amber-950 block">Quà tặng / Phần thưởng Trạm:</span>
              <span className="text-amber-900 font-medium">{station.highlightGift} (+{station.rewardPoints} điểm)</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
          >
            Đóng
          </button>

          {!isCompleted ? (
            <button
              onClick={() => {
                onClose();
                onOpenCheckin();
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Radio className="w-4 h-4" />
              <span>Chạm NFC / Điểm danh Trạm này</span>
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-700">✓ Đã có trong Hộ chiếu</span>
          )}
        </div>
      </div>
    </div>
  );
};
