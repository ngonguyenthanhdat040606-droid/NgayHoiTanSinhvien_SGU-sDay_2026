import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Sparkles,
  CheckCircle2,
  Award,
  Clock,
  QrCode,
  UserCheck,
  ShieldCheck,
  Zap,
  Flame,
  Gamepad2,
  Trophy,
  ArrowRight,
  Star,
  PartyPopper
} from 'lucide-react';
import { Student, Station } from '../types';
import { DRUG_PREVENTION_PRIORITY_MSSV } from '../data/priorityData';

interface StudentCardProps {
  student: Student;
  stations: Station[];
  onOpenCheckin: () => void;
  onSelectStation: (station: Station) => void;
  onOpenRegisterModal: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  stations,
  onOpenCheckin,
  onSelectStation,
  onOpenRegisterModal,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Generate QR for student e-Pass: contains MSSV and student ID
    const payload = JSON.stringify({
      type: 'FRESHMAN_PASS_SGU_2026',
      mssv: student.mssv,
      id: student.id,
      name: student.fullName,
      faculty: student.faculty,
    });

    QRCode.toDataURL(payload, {
      width: 260,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code', err));
  }, [student]);

  const totalStations = stations.length || 9;
  const completedStationsCount = student.completedStations.length;
  const isFullComplete = completedStationsCount === totalStations;
  
  const isDrugPreventionVIP = DRUG_PREVENTION_PRIORITY_MSSV.includes(student.mssv);

  const handleCopyMSSV = () => {
    navigator.clipboard.writeText(student.mssv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner Alert / SGU Station Completion Progress */}
      <div className={`p-4 sm:p-5 rounded-3xl border-2 transition-all shadow-lg ${isFullComplete
          ? 'bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-white border-amber-300 shadow-orange-500/20'
          : completedStationsCount > 0
            ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white border-blue-400 shadow-blue-500/20'
            : 'bg-gradient-to-r from-amber-50 to-orange-50 border-orange-300 text-slate-900'
        }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md ${isFullComplete || completedStationsCount > 0 ? 'bg-white/20 text-white' : 'bg-orange-500 text-white'
              }`}>
              {isFullComplete ? '👑' : completedStationsCount > 0 ? '⭐' : '🎮'}
            </div>
            <div>
              <div className="font-display font-black text-base sm:text-lg flex items-center gap-2">
                <span>
                  {isFullComplete
                    ? `CHÚC MỪNG! Bạn đã hoàn thành trọn vẹn 9/11 Trạm SGU’s Day 2026!`
                    : completedStationsCount > 0
                      ? `Tiến độ Hộ Chiếu Tân Sinh Viên: Đã điểm danh ${completedStationsCount}/11 trạm!`
                      : `Hành trình Hộ Chiếu Tân Sinh Viên SGU (0/11 trạm)`}
                </span>
              </div>
              <p className={`text-xs sm:text-sm mt-0.5 font-medium ${isFullComplete || completedStationsCount > 0 ? 'text-white/90' : 'text-slate-700'
                }`}>
                {isFullComplete
                  ? 'Bạn đã hoàn tất toàn bộ các trạm trải nghiệm! Hãy tiếp tục tham gia các hoạt động sân khấu, toạ đàm và Gala Âm nhạc.'
                  : completedStationsCount > 0
                    ? `Hãy tiếp tục di chuyển và điểm danh ${totalStations - completedStationsCount} trạm còn lại để hoàn thành hành trình ngày hội.`
                    : 'Hãy mang thẻ e-Pass đến các trạm hoạt động để chạm NFC hoặc quét QR điểm danh lưu lại con dấu.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              id="quick-checkin-passport-btn"
              onClick={onOpenCheckin}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer uppercase ${isFullComplete || completedStationsCount > 0
                  ? 'bg-white text-slate-950 hover:bg-amber-100'
                  : 'arcade-btn-orange text-white'
                }`}
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Chạm NFC / Quét Trạm</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Left = Electronic Pass Card, Right = Stamp Passport Rally */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT: Digital Freshman Pass (e-Pass) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-orange-300 shadow-xl overflow-hidden relative">
          {/* Card Top Header - SGU Moodboard Blue/Orange Arcade */}
          <div className="bg-gradient-to-tr from-blue-700 via-blue-800 to-indigo-900 p-4 sm:p-6 text-white relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase shadow-xs">
                  Thẻ Tân Sinh Viên
                </span>
              </div>
              <span className="text-[11px] font-arcade bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2.5 py-0.5 rounded-lg shadow-[0_2px_0_#9a3412] border border-white/30">
                SGU’S DAY 2026
              </span>
            </div>

            <div className="mt-5 flex items-center gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white shrink-0">
                {student.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="font-display text-xl font-black tracking-tight text-white line-clamp-1">
                  {student.fullName}
                </h3>
                <p className="text-xs text-amber-200 font-bold mt-0.5">
                  {student.major}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-white/20 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold text-white border border-white/20">
                    MSSV: <strong className="text-amber-300">{student.mssv}</strong>
                  </span>
                  <button
                    onClick={handleCopyMSSV}
                    className="text-[11px] text-amber-300 hover:text-white underline underline-offset-2 font-bold cursor-pointer"
                  >
                    {copied ? 'Đã copy!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card Body - Details & QR Code */}
          <div className="p-4 sm:p-6 space-y-5">
            <div className="grid grid-cols-2 gap-3 text-xs bg-amber-500/10 p-3.5 rounded-2xl border border-orange-200">
              <div>
                <span className="text-slate-500 font-bold block text-[11px]">Khoa</span>
                <span className="text-slate-900 font-bold mt-0.5 line-clamp-1">{student.faculty}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-[11px]">Lớp sinh hoạt</span>
                <span className="text-slate-900 font-bold mt-0.5">{student.studentClass}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-[11px]">Số điện thoại</span>
                <span className="text-slate-900 font-bold mt-0.5 font-mono">{student.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-[11px]">Trạng thái Thẻ</span>
                <span className="text-emerald-700 font-black mt-0.5 font-mono">Đã kích hoạt</span>
              </div>
            </div>

            {/* QR Code Container for Station Manager Scanning */}
            <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-white rounded-2xl border-2 border-dashed border-orange-300 text-center">
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-orange-600" />
                Mã QR e-Pass (Quản lý trạm quét điểm danh)
              </span>

              {qrDataUrl ? (
                <div className="p-2 bg-white rounded-2xl shadow-md border-2 border-orange-400">
                  <img
                    src={qrDataUrl}
                    alt="Mã QR Thẻ Tân Sinh Viên"
                    className="w-44 h-44 object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-44 h-44 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-slate-400">
                  Đang tạo mã QR...
                </div>
              )}
              <p className="text-[11px] text-slate-500 font-medium mt-2 max-w-xs">
                Xuất trình mã này tại 11 trạm sự kiện để Quản lý trạm quét điểm danh nhanh.
              </p>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={onOpenRegisterModal}
                className="flex-1 py-2.5 px-3 rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-orange-500" />
                <span>Đổi / Quản lý Thẻ e-Pass</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Stamp Rally Passport (8 Station Badges) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border-2 border-orange-300 shadow-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  <span>Hộ Chiếu 9 Con Dấu Trạm SGU’s Day 2026</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Khám phá và điểm danh 11 trạm sự kiện trong ngày hội.
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-orange-600 font-display">
                  {completedStationsCount}
                  <span className="text-slate-400 text-sm font-medium">/{totalStations}</span>
                </span>
                <span className="block text-[11px] text-slate-600 font-bold">Con dấu trạm</span>
              </div>
            </div>

            {/* Progress Level Bar */}
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border-2 border-orange-200">
              <div
                className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${(completedStationsCount / totalStations) * 100}%` }}
              />
            </div>

            {/* 9 Stations Stamp Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
              {isDrugPreventionVIP && (
                <div className="relative p-2.5 sm:p-3.5 rounded-2xl border-2 transition-all cursor-default text-left flex flex-col justify-between min-h-[130px] sm:min-h-[145px] group hover:shadow-lg bg-gradient-to-br from-rose-50 via-red-50 to-white border-red-400 shadow-sm ring-2 ring-red-400/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black font-mono px-1.5 py-0.5 rounded-md bg-red-600 text-white shadow-sm">
                      ƯU TIÊN
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] bg-red-100 text-red-700 px-1 rounded-sm font-bold border border-red-300">VIP</span>
                    </div>
                  </div>
                  
                  <div className="my-1.5 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 shadow-md bg-gradient-to-tr from-red-500 to-rose-500 text-white ring-4 ring-red-200">
                      🎟️
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-black text-slate-950 line-clamp-2">
                      Tọa đàm "Phòng chống ma túy"
                    </h4>
                    <p className="text-[9px] text-red-700 mt-0.5 font-bold line-clamp-1 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> 10:00 - Lầu 7 E
                    </p>
                  </div>
                </div>
              )}
              {stations.map((station) => {
                const isCompleted = student.completedStations.includes(station.id);
                const checkinInfo = student.checkinHistory.find((c) => c.stationId === station.id);

                return (
                  <div
                    key={station.id}
                    id={`stamp-card-${station.id}`}
                    onClick={() => onSelectStation(station)}
                    className={`relative p-2.5 sm:p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between min-h-[130px] sm:min-h-[145px] group hover:shadow-lg ${isCompleted
                        ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-emerald-400 shadow-sm ring-2 ring-emerald-400/30'
                        : 'bg-slate-50 border-slate-200 hover:border-orange-400 hover:bg-orange-50/40'
                      }`}
                  >
                    {/* Badge Stamp Header */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black font-mono px-1.5 py-0.5 rounded-md ${isCompleted ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-700'
                        }`}>
                        TRẠM {station.stationNumber}
                      </span>
                      {isCompleted && (
                        <div className="flex items-center gap-1">
                          {station.id === 'station-9' && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1 rounded-sm font-bold border border-yellow-300">🏆</span>}
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                      )}
                    </div>

                    {/* Central Icon / Stamp Badge */}
                    <div className="my-1.5 flex items-center justify-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 shadow-md ${isCompleted
                          ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white ring-4 ring-emerald-200'
                          : 'bg-slate-200 text-slate-400 grayscale opacity-60'
                        }`}>
                        {station.stampBadge}
                      </div>
                    </div>

                    {/* Station Name & Timestamp */}
                    <div>
                      <h4 className={`text-xs font-bold line-clamp-1 ${isCompleted ? 'text-slate-950 font-black' : 'text-slate-700'
                        }`}>
                        {station.shortName}
                      </h4>
                      {isCompleted && checkinInfo ? (
                        <p className="text-[9px] text-emerald-800 font-mono font-bold mt-0.5 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{checkinInfo.timestamp.split(' ')[0]}</span>
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 font-medium">
                          {station.location}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkin Action CTA */}
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100 border-2 border-orange-300 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-left text-xs text-slate-900">
                <span className="font-display font-black block text-sm text-orange-950">Bạn đang đứng tại trạm nào trong số 11 trạm?</span>
                <span className="font-medium text-slate-700">Chạm lưng điện thoại vào thẻ NFC của Quản lý trạm hoặc quét mã QR để nhận con dấu ngay!</span>
              </div>
              <button
                onClick={onOpenCheckin}
                className="arcade-btn-orange w-full sm:w-auto px-5 py-2.5 rounded-xl text-white font-black text-xs shrink-0 shadow-md flex items-center justify-center gap-1.5 cursor-pointer uppercase"
              >
                <span>Mở máy quét điểm danh</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Activity / Checkin History Log */}
          <div className="bg-white rounded-3xl border-2 border-orange-200 shadow-md p-4 sm:p-6">
            <h3 className="text-sm font-display font-black text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>Lịch Sử Điểm Danh & Hoạt Động Của Bạn</span>
            </h3>

            {student.checkinHistory.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs font-medium">
                Chưa có lịch sử điểm danh nào. Hãy di chuyển đến Trạm 1 (Sảnh Hội trường A) để bắt đầu hành trình nhé!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {student.checkinHistory.map((log, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0">
                        ✓
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{log.stationName}</div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Hình thức: {
                            log.method === 'nfc_tap' ? '⚡ Quét thẻ NFC' :
                              log.method === 'qr_scan' ? '📷 Quét mã QR trạm' :
                                log.method === 'manual_mssv' ? '✍️ Quản lý nhập MSSV' : '🔍 Quản lý quét mã'
                          }
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-slate-600 font-mono font-bold">
                      {log.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
