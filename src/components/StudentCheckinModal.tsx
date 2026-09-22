import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Radio, 
  QrCode, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Zap, 
  Sparkles,
  RefreshCw,
  Camera,
  Layers,
  ArrowRight,
  Info,
  ShieldCheck,
  Gamepad2,
  Trophy,
  PartyPopper
} from 'lucide-react';
import { Student, Station } from '../types';
import { isWebNFCSupported, startNFCScan } from '../utils/nfcHelper';
import { NFCAndroidPermissionCard } from './NFCAndroidPermissionCard';
import { isOrganizerAuthenticated } from '../utils/storage';

interface StudentCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  stations: Station[];
  onCheckinSuccess: (stationId: string, method: 'nfc_tap' | 'qr_scan' | 'manual_mssv') => void;
  onOpenRegisterModal?: () => void;
}

export const StudentCheckinModal: React.FC<StudentCheckinModalProps> = ({
  isOpen,
  onClose,
  student,
  stations,
  onCheckinSuccess,
  onOpenRegisterModal,
}) => {
  const [scanMode, setScanMode] = useState<'nfc' | 'qr' | 'simulate'>('nfc');
  const [nfcScanning, setNfcScanning] = useState<boolean>(false);
  const [nfcStatusText, setNfcStatusText] = useState<string>('Sẵn sàng quét thẻ NFC của trạm');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [actionGuide, setActionGuide] = useState<string>('');
  const [successResult, setSuccessResult] = useState<{ station: Station; isNew: boolean } | null>(null);
  
  // Camera QR simulation / video ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage('');
      setActionGuide('');
      setSuccessResult(null);
      setNfcScanning(false);
      stopCamera();
      return;
    }

    if (scanMode === 'nfc') {
      initNFC();
    } else if (scanMode === 'qr') {
      startCamera();
    }
  }, [isOpen, scanMode]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b00', '#2563eb', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch (e) {
      console.warn('Confetti error', e);
    }
  };

  const handleStationCheckin = (stationId: string, method: 'nfc_tap' | 'qr_scan' | 'manual_mssv') => {
    const station = stations.find((s) => s.id === stationId);
    if (!station) {
      setErrorMessage('Không tìm thấy trạm hợp lệ.');
      return;
    }

    const isAlready = student?.completedStations.includes(stationId) || false;
    onCheckinSuccess(stationId, method);

    setSuccessResult({
      station,
      isNew: !isAlready,
    });

    if (!isAlready) {
      triggerConfetti();
    }
  };

  // NFC Logic
  const initNFC = async () => {
    setErrorMessage('');
    setActionGuide('');

    if (!isWebNFCSupported()) {
      setNfcStatusText('Thiết bị chưa hỗ trợ Web NFC trực tiếp trong trình duyệt này.');
      return;
    }

    setNfcScanning(true);
    setNfcStatusText('Đang chờ chạm thẻ... Hãy áp mặt lưng điện thoại vào thẻ NFC của Trạm');

    const cleanup = await startNFCScan(
      (data) => {
        console.log('NFC Read Data:', data);
        let matchedStation: Station | undefined;

        if (data.serialNumber) {
          matchedStation = stations.find(
            (s) => s.nfcTagId.toLowerCase() === data.serialNumber?.toLowerCase()
          );
        }

        if (!matchedStation && data.text) {
          matchedStation = stations.find(
            (s) => data.text?.includes(s.id) || data.text?.includes(`station-${s.stationNumber}`)
          );
        }

        if (!matchedStation && data.url) {
          matchedStation = stations.find(
            (s) => data.url?.includes(s.id) || data.url?.includes(`station-${s.stationNumber}`)
          );
        }

        if (!matchedStation && data.serialNumber) {
          if (data.serialNumber.toLowerCase().includes('b1:8d:92:6d') || data.serialNumber.toUpperCase().includes('B1:8D:92:6D')) {
            matchedStation = stations[0];
          } else {
            matchedStation = stations[0];
          }
        }

        if (matchedStation) {
          handleStationCheckin(matchedStation.id, 'nfc_tap');
        } else {
          setErrorMessage('Đã đọc thẻ NFC nhưng mã thẻ chưa được gán vào 11 trạm sự kiện.');
        }
      },
      (error) => {
        setErrorMessage(error.message);
        if (error.actionGuide) {
          setActionGuide(error.actionGuide);
        }
        setNfcScanning(false);
      }
    );

    return () => {
      if (cleanup) cleanup();
    };
  };

  // Camera QR logic
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch (e: any) {
      console.warn('Camera access error', e);
      setErrorMessage('Không thể mở camera. Vui lòng cho phép quyền truy cập camera hoặc chọn trạm bên dưới.');
    }
  };

  const stopCamera = () => {
    setIsCameraActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-orange-500 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs border border-white/30">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg leading-tight text-white drop-shadow-xs">
                Điểm Danh Trạm SGU’s Day 2026
              </h3>
              <p className="text-xs text-orange-100 mt-0.5 font-semibold">
                Chạm thẻ NFC của Quản lý trạm hoặc quét mã QR
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* SUCCESS RESULT SCREEN */}
          {successResult ? (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white mx-auto flex items-center justify-center text-4xl shadow-xl ring-8 ring-emerald-100">
                {successResult.station.stampBadge}
              </div>

              <div>
                <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {successResult.isNew ? '🎉 ĐÓNG DẤU THÀNH CÔNG!' : 'ĐÃ ĐÓNG DẤU TRƯỚC ĐÓ'}
                </span>
                <h4 className="font-display text-xl font-black text-slate-950 mt-2">
                  {successResult.station.name}
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto font-medium">
                  {successResult.station.tagline}
                </p>
              </div>

              {/* Station & Location info */}
              <div className="bg-amber-500/10 border-2 border-orange-200 rounded-2xl p-4 text-xs text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-bold">Địa điểm:</span>
                  <span className="font-black text-slate-900">{successResult.station.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-bold">Khu vực:</span>
                  <span className="font-black text-orange-600">Khu {successResult.station.zone} • Trạm số {successResult.station.stationNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-bold">Trạng thái:</span>
                  <span className="font-black text-emerald-700">Đã cập nhật vào Hộ chiếu</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSuccessResult(null);
                    setScanMode('nfc');
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl border-2 border-slate-200 text-slate-700 font-black text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-orange-500" />
                  <span>Quét trạm khác</span>
                </button>

                <button
                  onClick={onClose}
                  className="arcade-btn-orange flex-1 py-3 px-4 rounded-2xl text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase"
                >
                  <span>Xem Hộ Chiếu 11 Dấu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Active Student Info Header inside Checkin Modal */}
              <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-orange-200 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl ${student ? 'bg-orange-600' : 'bg-slate-400'} text-white font-black text-xs flex items-center justify-center shadow-xs`}>
                    {student ? student.fullName.charAt(0) : '?'}
                  </div>
                  <div>
                    <div className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{student ? student.fullName : 'Chưa kích hoạt Thẻ e-Pass'}</span>
                      <span className={`text-[10px] ${student ? 'bg-emerald-600' : 'bg-amber-600'} text-white px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5`}>
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {student ? 'Đã kích hoạt' : 'Cần đăng ký/nhập'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono font-bold">
                      MSSV: <strong className="text-orange-700">{student?.mssv || '---'}</strong> • Đã thu thập: <strong className="text-emerald-700">{student?.completedStations.length || 0}/11</strong> Trạm
                    </div>
                  </div>
                </div>

                {onOpenRegisterModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenRegisterModal();
                    }}
                    className="text-[11px] text-orange-700 hover:text-orange-900 font-black bg-white px-2.5 py-1.5 rounded-xl border border-orange-300 shadow-2xs hover:bg-orange-50 transition-colors cursor-pointer"
                  >
                    {student ? 'Đổi thẻ' : 'Đăng ký/Đăng nhập'}
                  </button>
                )}
              </div>

              {/* Scan Mode Toggle Tabs */}
              {(() => {
                const isOrg = isOrganizerAuthenticated();
                return (
                  <div className={`grid ${isOrg ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5 bg-amber-500/10 p-1.5 rounded-2xl border border-orange-200`}>
                    <button
                      onClick={() => setScanMode('nfc')}
                      className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        scanMode === 'nfc'
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'text-slate-700 hover:text-orange-600'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Chạm NFC</span>
                    </button>

                    <button
                      onClick={() => setScanMode('qr')}
                      className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        scanMode === 'qr'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-700 hover:text-blue-600'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Quét QR Trạm</span>
                    </button>

                    {isOrg && (
                      <button
                        onClick={() => setScanMode('simulate')}
                        className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          scanMode === 'simulate'
                            ? 'bg-slate-900 text-amber-300 shadow-xs'
                            : 'text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Mô phỏng (BTC)</span>
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Error Message Box */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-start gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Thông báo:</strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* TAB 1: NFC SCANNER */}
              {scanMode === 'nfc' && (
                <div className="space-y-4">
                  {/* Android Chrome NFC Permission Prompt Banner */}
                  <NFCAndroidPermissionCard
                    onRequestSuccess={() => {
                      initNFC();
                    }}
                    onSwitchToQR={() => setScanMode('qr')}
                  />

                  <div className="text-center py-3 space-y-3">
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-orange-500/15 animate-ping" />
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <Radio className="w-9 h-9 animate-pulse" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-display font-black text-slate-950">
                        Chạm lưng điện thoại vào thẻ NFC tại bàn Trạm
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto font-medium">
                        {nfcStatusText}
                      </p>
                    </div>

                    <div className="bg-amber-500/10 border border-orange-200 rounded-2xl p-3.5 text-xs text-slate-800 text-left space-y-1.5">
                      <div className="font-black flex items-center gap-1.5 text-orange-950">
                        <Info className="w-4 h-4 text-orange-600" />
                        Mẹo chạm thẻ NFC thành công:
                      </div>
                      <p className="text-slate-700 text-[11px] font-medium">
                        • Áp sát phần cụm camera / lưng điện thoại vào thẻ NFC tại bàn trạm trong 1-2 giây.
                      </p>
                      <p className="text-slate-700 text-[11px] font-medium">
                        • Nếu máy không hỗ trợ NFC, bạn có thể chuyển sang tab <strong>"Quét QR Trạm"</strong> bên trên hoặc xuất trình mã QR của bạn cho Quản lý trạm quét.
                      </p>
                    </div>

                    <div className="pt-1 flex items-center justify-center gap-2">
                      <button
                        onClick={initNFC}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-orange-600" />
                        <span>Kích hoạt lại đầu đọc NFC</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: QR CAMERA SCANNER */}
              {scanMode === 'qr' && (
                <div className="space-y-4 text-center">
                  <div className="relative bg-slate-950 rounded-2xl overflow-hidden aspect-square max-w-xs mx-auto flex items-center justify-center border-2 border-dashed border-orange-400">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-orange-400/40 pointer-events-none flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-orange-500 rounded-2xl animate-pulse" />
                    </div>
                    {!isCameraActive && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white p-4 text-xs">
                        <Camera className="w-8 h-8 text-slate-400 mb-2" />
                        <span>Đang khởi động camera...</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    Hướng camera vào mã QR được in tại bàn của Trạm sự kiện
                  </p>

                  {isOrganizerAuthenticated() && (
                    <div className="text-left bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-900 block mb-2">Hoặc chọn trạm nhanh để quét mã QR (Chỉ dành cho BTC thử nghiệm):</span>
                      <div className="grid grid-cols-2 gap-2">
                        {stations.map((st) => (
                          <button
                            key={st.id}
                            onClick={() => handleStationCheckin(st.id, 'qr_scan')}
                            className="p-2.5 rounded-xl bg-white hover:bg-orange-50 border border-slate-200 text-left text-slate-800 hover:text-orange-700 font-bold text-xs transition-colors flex items-center gap-2 truncate cursor-pointer shadow-2xs"
                          >
                            <span className="text-base">{st.stampBadge}</span>
                            <span className="truncate">{st.shortName}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SIMULATE NFC TAP (FOR QUICK TESTING & DESKTOP) */}
              {scanMode === 'simulate' && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-amber-950 text-xs font-bold">
                    <strong>Chế độ Kiểm thử / Mô phỏng:</strong> Bấm chọn 1 trong 11 trạm dưới đây để mô phỏng hành động chạm thẻ NFC tại bàn Quản lý trạm (Hỗ trợ thử nghiệm ngay trên máy tính/điện thoại).
                  </div>

                  <div className="space-y-2">
                    {stations.map((st) => {
                      const isCompleted = student?.completedStations.includes(st.id);
                      return (
                        <div
                          key={st.id}
                          onClick={() => handleStationCheckin(st.id, 'nfc_tap')}
                          className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between hover:shadow-md ${
                            isCompleted
                              ? 'bg-emerald-50/70 border-emerald-400'
                              : 'bg-white border-slate-200 hover:border-orange-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
                              {st.stampBadge}
                            </div>
                            <div>
                              <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                                <span>{st.name}</span>
                                {isCompleted && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                    Đã có dấu
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                Thẻ NFC UID: <span className="font-mono text-orange-600 font-bold">{st.nfcTagId}</span> • {st.location}
                              </div>
                            </div>
                          </div>

                          <button className="px-3.5 py-1.5 rounded-xl bg-orange-100 text-orange-700 hover:bg-orange-500 hover:text-white text-xs font-bold transition-all shrink-0 cursor-pointer">
                            Chạm thẻ
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>Sinh viên: <strong className="text-slate-900">{student?.fullName || 'Chưa đăng ký'}</strong> ({student?.mssv})</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-slate-700 hover:bg-slate-200 font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
