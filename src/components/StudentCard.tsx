import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Gift, 
  Clock, 
  QrCode, 
  Share2, 
  UserCheck, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Student, Station } from '../types';

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
      type: 'FRESHMAN_PASS',
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

  const completedStationsCount = student.completedStations.length;
  const isRewardEligible = completedStationsCount >= 4;
  const isFullComplete = completedStationsCount === 6;

  const handleCopyMSSV = () => {
    navigator.clipboard.writeText(student.mssv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner Alert / Reward Status */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isFullComplete 
          ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-500/20 border-purple-400'
          : isRewardEligible
          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 border-emerald-400'
          : 'bg-blue-50 border-blue-200 text-blue-900'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
              isFullComplete || isRewardEligible ? 'bg-white/20' : 'bg-blue-100 text-blue-700'
            }`}>
              {isFullComplete ? '👑' : isRewardEligible ? '🎁' : '🏃'}
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg flex items-center gap-2">
                <span>
                  {isFullComplete 
                    ? 'Xuất sắc! Bạn đã hoàn thành trọn vẹn 6/6 trạm!' 
                    : isRewardEligible
                    ? 'Chúc mừng! Đã đạt mốc nhận Quà Ngày Hội (4+ trạm)!'
                    : `Hành trình Hộ chiếu Tân Sinh viên (${completedStationsCount}/6 trạm)`}
                </span>
              </div>
              <p className={`text-xs sm:text-sm mt-0.5 ${
                isFullComplete || isRewardEligible ? 'text-white/90' : 'text-blue-700'
              }`}>
                {isFullComplete
                  ? 'Đến ngay Trạm 6 (Sân khấu chính) để nhận Áo thun Ngày Hội, Bình giữ nhiệt và tham gia Rút thăm may mắn lớn!'
                  : isRewardEligible
                  ? `Hãy tiếp tục chinh phục ${6 - completedStationsCount} trạm còn lại để mở khóa Quà Đặc Biệt và mã dự thưởng!`
                  : `Chỉ cần hoàn thành thêm ${4 - completedStationsCount} trạm nữa là bạn sẽ đủ điều kiện nhận quà tặng từ Ban Tổ chức.`}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              id="quick-checkin-passport-btn"
              onClick={onOpenCheckin}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 ${
                isFullComplete || isRewardEligible
                  ? 'bg-white text-slate-900 hover:bg-slate-100'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Chạm NFC / Quét Trạm</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Left = Electronic Pass Card, Right = Stamp Passport Rally */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: Digital Freshman Pass (e-Pass) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden relative">
          {/* Card Top Header */}
          <div className="bg-gradient-to-tr from-blue-700 via-indigo-700 to-purple-800 p-6 text-white relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs">
                  Thẻ Tân Sinh Viên 2026
                </span>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md shadow-xs">
                KHOÁ 2026
              </span>
            </div>

            <div className="mt-5 flex items-center gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-slate-900 font-extrabold text-2xl flex items-center justify-center shadow-lg border-2 border-white/40 shrink-0">
                {student.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-white line-clamp-1">
                  {student.fullName}
                </h3>
                <p className="text-xs text-blue-100 font-medium mt-0.5">
                  {student.major}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-white/15 px-2 py-0.5 rounded text-[11px] font-mono text-white">
                    MSSV: <strong className="font-bold">{student.mssv}</strong>
                  </span>
                  <button 
                    onClick={handleCopyMSSV}
                    className="text-[11px] text-blue-200 hover:text-white underline underline-offset-2"
                  >
                    {copied ? 'Đã sao chép!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card Body - Details & QR Code */}
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 font-medium block">Khoa / Viện</span>
                <span className="text-slate-800 font-semibold mt-0.5 line-clamp-1">{student.faculty}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Lớp sinh hoạt</span>
                <span className="text-slate-800 font-semibold mt-0.5">{student.studentClass}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Số điện thoại</span>
                <span className="text-slate-800 font-semibold mt-0.5 font-mono">{student.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Mã may mắn</span>
                <span className="text-indigo-600 font-bold mt-0.5 font-mono">{student.luckyDrawCode || 'TSV-2026'}</span>
              </div>
            </div>

            {/* QR Code Container for Station Manager Scanning */}
            <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-blue-600" />
                Mã QR Thẻ Sinh Viên (Dùng khi Quản lý quét)
              </span>
              
              {qrDataUrl ? (
                <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200">
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
              <p className="text-[11px] text-slate-500 mt-2 max-w-xs">
                Xuất trình mã này tại 6 trạm nếu bạn muốn quản lý trạm quét mã trực tiếp để điểm danh.
              </p>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={onOpenRegisterModal}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4 text-slate-500" />
                <span>Đổi thông tin / Sinh viên khác</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Stamp Rally Passport (6 Station Badges) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Hộ Chiếu 6 Dấu Trạm Ngày Hội</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chạm thẻ NFC tại mỗi trạm hoặc nhờ quản lý trạm nhập MSSV để thu thập đủ 6 con dấu.
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-blue-600">
                  {completedStationsCount}
                  <span className="text-slate-400 text-sm font-medium">/6</span>
                </span>
                <span className="block text-[11px] text-slate-500 font-medium">Con dấu</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div 
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${(completedStationsCount / 6) * 100}%` }}
              />
            </div>

            {/* 6 Stations Stamp Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-5">
              {stations.map((station) => {
                const isCompleted = student.completedStations.includes(station.id);
                const checkinInfo = student.checkinHistory.find((c) => c.stationId === station.id);

                return (
                  <div
                    key={station.id}
                    id={`stamp-card-${station.id}`}
                    onClick={() => onSelectStation(station)}
                    className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between min-h-[140px] group hover:shadow-md ${
                      isCompleted
                        ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-emerald-300 shadow-xs ring-1 ring-emerald-400/30'
                        : 'bg-slate-50/70 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    {/* Badge Stamp Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                        Trạm {station.stationNumber}
                      </span>
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Đã đóng dấu
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Chưa check-in</span>
                      )}
                    </div>

                    {/* Central Icon / Stamp Badge */}
                    <div className="my-2 flex items-center justify-center">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 shadow-xs ${
                        isCompleted
                          ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/20 ring-4 ring-emerald-100'
                          : 'bg-slate-200/80 text-slate-400 grayscale opacity-60'
                      }`}>
                        {station.stampBadge}
                      </div>
                    </div>

                    {/* Station Name & Timestamp */}
                    <div>
                      <h4 className={`text-xs font-bold line-clamp-1 ${
                        isCompleted ? 'text-slate-900' : 'text-slate-600'
                      }`}>
                        {station.shortName}
                      </h4>
                      {isCompleted && checkinInfo ? (
                        <p className="text-[10px] text-emerald-700 font-mono mt-0.5 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{checkinInfo.timestamp.split(' ')[0]}</span>
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                          {station.location}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkin Action CTA */}
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-left text-xs text-blue-900">
                <span className="font-bold block text-sm text-blue-950">Bạn đang đứng tại một trạm sự kiện?</span>
                <span>Chạm lưng điện thoại vào thẻ NFC của Quản lý trạm hoặc quét mã QR trạm để nhận con dấu ngay!</span>
              </div>
              <button
                onClick={onOpenCheckin}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Mở máy quét điểm danh</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Activity / Checkin History Log */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Lịch sử Điểm danh & Hoạt động của bạn</span>
            </h3>

            {student.checkinHistory.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                Chưa có lịch sử điểm danh nào. Hãy di chuyển đến Trạm 1 để bắt đầu hành trình nhé!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {student.checkinHistory.map((log, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                        ✓
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{log.stationName}</div>
                        <div className="text-[11px] text-slate-500">
                          Hình thức: {
                            log.method === 'nfc_tap' ? '⚡ Quét thẻ NFC' :
                            log.method === 'qr_scan' ? '📷 Quét mã QR trạm' :
                            log.method === 'manual_mssv' ? '✍️ Quản lý nhập MSSV' : '🔍 Quản lý quét mã'
                          }
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-slate-500 font-mono">
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
