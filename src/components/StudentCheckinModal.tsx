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
  Settings
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
}

export const StudentCheckinModal: React.FC<StudentCheckinModalProps> = ({
  isOpen,
  onClose,
  student,
  stations,
  onCheckinSuccess,
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
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
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
          setErrorMessage('Đã đọc thẻ NFC nhưng mã thẻ chưa được gán vào 8 trạm sự kiện.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">
                Điểm Danh Trạm Sự Kiện
              </h3>
              <p className="text-xs text-blue-100 mt-0.5">
                Chạm thẻ NFC của Quản lý trạm hoặc quét mã QR
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* SUCCESS RESULT SCREEN */}
          {successResult ? (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-4xl shadow-inner ring-8 ring-emerald-50">
                {successResult.station.stampBadge}
              </div>

              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {successResult.isNew ? 'Đóng dấu thành công!' : 'Đã đóng dấu trước đó'}
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 mt-2">
                  {successResult.station.name}
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  {successResult.station.tagline}
                </p>
              </div>

              {/* Reward & Location info */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Địa điểm:</span>
                  <span className="font-semibold text-slate-800">{successResult.station.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Quà tặng trạm:</span>
                  <span className="font-bold text-amber-600">{successResult.station.highlightGift}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Điểm tích lũy:</span>
                  <span className="font-bold text-blue-600">+{successResult.station.rewardPoints} điểm</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSuccessResult(null);
                    setScanMode('nfc');
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Quét trạm khác</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Xem Hộ chiếu 8 Dấu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Scan Mode Toggle Tabs */}
              {(() => {
                const isOrg = isOrganizerAuthenticated();
                return (
                  <div className={`grid ${isOrg ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5 bg-slate-100 p-1 rounded-xl`}>
                    <button
                      onClick={() => setScanMode('nfc')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        scanMode === 'nfc'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Chạm NFC</span>
                    </button>

                    <button
                      onClick={() => setScanMode('qr')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        scanMode === 'qr'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Quét QR Trạm</span>
                    </button>

                    {isOrg && (
                      <button
                        onClick={() => setScanMode('simulate')}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          scanMode === 'simulate'
                            ? 'bg-white text-amber-700 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
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
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block">Thông báo:</strong>
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
                      <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping" />
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Radio className="w-9 h-9 animate-pulse" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        Chạm lưng điện thoại vào thẻ NFC tại bàn Trạm
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        {nfcStatusText}
                      </p>
                    </div>

                    <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-3.5 text-xs text-blue-900 text-left space-y-1.5">
                      <div className="font-bold flex items-center gap-1.5 text-blue-950">
                        <Info className="w-4 h-4 text-blue-600" />
                        Mẹo chạm thẻ NFC thành công:
                      </div>
                      <p className="text-blue-800 text-[11px]">
                        • Áp sát phần cụm camera / lưng điện thoại vào thẻ NFC tại bàn trạm trong 1-2 giây.
                      </p>
                      <p className="text-blue-800 text-[11px]">
                        • Nếu máy không hỗ trợ NFC, bạn có thể chuyển ngay sang tab <strong>"Quét QR Trạm"</strong> bên trên hoặc đưa mã QR của bạn cho Quản lý trạm quét.
                      </p>
                    </div>

                    <div className="pt-1 flex items-center justify-center gap-2">
                      <button
                        onClick={initNFC}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Kích hoạt lại đầu đọc NFC</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: QR CAMERA SCANNER */}
              {scanMode === 'qr' && (
                <div className="space-y-4 text-center">
                  <div className="relative bg-slate-900 rounded-2xl overflow-hidden aspect-square max-w-xs mx-auto flex items-center justify-center border-2 border-dashed border-blue-400">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-blue-400/40 pointer-events-none flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-blue-500 rounded-2xl animate-pulse" />
                    </div>
                    {!isCameraActive && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 text-white p-4 text-xs">
                        <Camera className="w-8 h-8 text-slate-400 mb-2" />
                        <span>Đang khởi động camera...</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-500">
                    Hướng camera vào mã QR được in tại bàn của Trạm sự kiện
                  </p>

                  <div className="text-left bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold text-slate-800 block mb-1">Hoặc chọn trạm nhanh để quét mã QR:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {stations.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => handleStationCheckin(st.id, 'qr_scan')}
                          className="p-2 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-left text-slate-700 hover:text-blue-700 font-medium text-xs transition-colors flex items-center gap-1.5 truncate"
                        >
                          <span>{st.stampBadge}</span>
                          <span className="truncate">{st.shortName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SIMULATE NFC TAP (FOR QUICK TESTING & DESKTOP) */}
              {scanMode === 'simulate' && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                    <strong>Chế độ Kiểm thử / Mô phỏng:</strong> Bấm chọn 1 trong 8 trạm dưới đây để mô phỏng hành động chạm thẻ NFC tại bàn Quản lý trạm (Hỗ trợ thử nghiệm ngay trên máy tính/điện thoại).
                  </div>

                  <div className="space-y-2">
                    {stations.map((st) => {
                      const isCompleted = student?.completedStations.includes(st.id);
                      return (
                        <div
                          key={st.id}
                          onClick={() => handleStationCheckin(st.id, 'nfc_tap')}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between hover:shadow-md ${
                            isCompleted
                              ? 'bg-emerald-50/70 border-emerald-300'
                              : 'bg-white border-slate-200 hover:border-blue-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl shrink-0">
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
                                Thẻ NFC UID: <span className="font-mono text-blue-600">{st.nfcTagId}</span> • {st.location}
                              </div>
                            </div>
                          </div>

                          <button className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all shrink-0">
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
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Sinh viên: <strong>{student?.fullName || 'Chưa đăng ký'}</strong> ({student?.mssv})</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-semibold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
