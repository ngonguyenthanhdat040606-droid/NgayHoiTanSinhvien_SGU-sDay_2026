import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Settings, 
  Smartphone, 
  RefreshCw, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  QrCode, 
  Sparkles,
  Info
} from 'lucide-react';
import { checkNFCPermission, requestNFCPermissionAndScan, isWebNFCSupported, detectEnvironment } from '../utils/nfcHelper';

interface NFCAndroidPermissionCardProps {
  onRequestSuccess?: () => void;
  onSwitchToQR?: () => void;
}

export const NFCAndroidPermissionCard: React.FC<NFCAndroidPermissionCardProps> = ({
  onRequestSuccess,
  onSwitchToQR,
}) => {
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unsupported' | 'checking'>('checking');
  const [env, setEnv] = useState<{ isAndroid: boolean; isChrome: boolean; isIOS: boolean }>({ isAndroid: false, isChrome: false, isIOS: false });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<{ type: string; message: string; actionGuide?: string } | null>(null);
  const [isGuideExpanded, setIsGuideExpanded] = useState<boolean>(false);

  const checkStatus = async () => {
    const environment = detectEnvironment();
    setEnv(environment);

    if (!isWebNFCSupported()) {
      setPermissionState('unsupported');
      return;
    }

    const res = await checkNFCPermission();
    if (res.permission === 'granted') {
      setPermissionState('granted');
    } else if (res.permission === 'denied') {
      setPermissionState('denied');
      setIsGuideExpanded(true);
    } else {
      setPermissionState('prompt');
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleRequestPermission = async () => {
    setIsLoading(true);
    setErrorDetails(null);

    const result = await requestNFCPermissionAndScan();
    setIsLoading(false);

    if (result.success) {
      setPermissionState('granted');
      if (onRequestSuccess) onRequestSuccess();
    } else if (result.error) {
      setErrorDetails(result.error);
      if (result.error.type === 'permission_denied') {
        setPermissionState('denied');
        setIsGuideExpanded(true);
      } else if (result.error.type === 'nfc_disabled') {
        setIsGuideExpanded(true);
      }
    }
  };

  // If user is on iOS, show iOS specific NFC guidance
  if (env.isIOS) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 space-y-2">
        <div className="flex items-center gap-2 font-bold text-blue-950 text-xs">
          <Smartphone className="w-4 h-4 text-blue-600" />
          <span>Bạn đang sử dụng iPhone (iOS)</span>
        </div>
        <p className="text-blue-800 leading-relaxed text-[11px]">
          iPhone sử dụng tính năng <strong>Background NFC Tag Reading</strong> tự động. Bạn không cần cấp quyền trong Safari:
        </p>
        <div className="bg-white/110 p-2.5 rounded-xl border border-blue-100 space-y-1 text-[11px] text-slate-700">
          <p>👉 <strong>Cách làm:</strong> Chỉ cần áp đỉnh trên của iPhone vào thẻ NFC tại trạm &rarr; Chạm vào biểu ngữ thông báo xuất hiện trên màn hình để đóng dấu!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 p-4 space-y-3.5 shadow-2xs">
      {/* Top Header & Status Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 ${
            permissionState === 'granted'
              ? 'bg-emerald-600'
              : permissionState === 'denied'
              ? 'bg-rose-600'
              : 'bg-blue-600'
          }`}>
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
              Quyền Truy Cập Web NFC (Android)
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">
              Cho phép Chrome đọc thẻ khi chạm
            </span>
          </div>
        </div>

        {/* Status Pill */}
        {permissionState === 'granted' && (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Đã cho phép
          </span>
        )}

        {permissionState === 'prompt' && (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Chờ bật quyền
          </span>
        )}

        {permissionState === 'denied' && (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
            Đang bị chặn
          </span>
        )}

        {permissionState === 'unsupported' && (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0">
            Dùng Quét QR
          </span>
        )}
      </div>

      {/* Dynamic Action Button & Prompts */}
      {permissionState !== 'granted' && permissionState !== 'unsupported' && (
        <div className="space-y-2">
          <button
            onClick={handleRequestPermission}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group active:scale-98"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang yêu cầu hệ thống...</span>
              </>
            ) : (
              <>
                <Radio className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Bật Quyền Truy Cập NFC (Hiện hộp thoại Cho phép)</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-slate-500">
            Nhấn nút trên &rarr; Chọn <strong>"Cho phép" (Allow)</strong> khi trình duyệt Chrome hỏi.
          </p>
        </div>
      )}

      {/* Error Details alert if any */}
      {errorDetails && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs space-y-1.5 animate-in fade-in duration-150">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block text-rose-950">{errorDetails.message}</strong>
              {errorDetails.actionGuide && (
                <p className="text-[11px] text-rose-800 mt-1 font-medium leading-relaxed">
                  👉 {errorDetails.actionGuide}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Expandable Step-by-Step Android NFC Guide */}
      <div className="border-t border-slate-200/110 pt-2.5">
        <button
          onClick={() => setIsGuideExpanded(!isGuideExpanded)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-blue-700 py-1 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5 text-blue-600" />
            <span>Hướng dẫn mở quyền NFC trong Cài đặt Android & Chrome</span>
          </span>
          {isGuideExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isGuideExpanded && (
          <div className="mt-3 space-y-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200 animate-in fade-in duration-200">
            {/* Step 1: Turn on NFC in Phone settings */}
            <div className="space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Bật phần cứng NFC của điện thoại:</span>
              </div>
              <p className="text-slate-600 text-[11px] pl-5 leading-relaxed">
                Vuốt từ mép trên cùng màn hình điện thoại xuống (Thanh Cài đặt nhanh) &rarr; Chạm vào biểu tượng <strong>NFC</strong> để bật sáng. (Hoặc vào <em>Cài đặt &rarr; Thiết bị đã kết nối / Kết nối &rarr; NFC: Bật</em>).
              </p>
            </div>

            {/* Step 2: Allow NFC in Chrome */}
            <div className="space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
                <span>Mở quyền NFC trong trình duyệt Chrome:</span>
              </div>
              <p className="text-slate-600 text-[11px] pl-5 leading-relaxed">
                Trên thanh địa chỉ Chrome, bấm vào biểu tượng <strong>Cài đặt trang web / Ổ khóa 🔒</strong> bên trái đường link &rarr; Chọn <strong>Quyền (Permissions)</strong> &rarr; Tìm mục <strong>NFC</strong> &rarr; Đổi sang <strong>"Cho phép" (Allow)</strong>.
              </p>
            </div>

            {/* Fallback option */}
            {onSwitchToQR && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Nếu điện thoại không có chip NFC?</span>
                <button
                  onClick={onSwitchToQR}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-blue-700 font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Chuyển sang Quét QR</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
