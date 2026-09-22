import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Radio, 
  Smartphone, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  HelpCircle, 
  Printer, 
  Download,
  AlertTriangle,
  Info,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  Globe,
  AlertCircle
} from 'lucide-react';
import { Station } from '../types';
import { NFCAndroidPermissionCard } from './NFCAndroidPermissionCard';

interface NFCSetupGuideProps {
  stations: Station[];
}

export const NFCSetupGuide: React.FC<NFCSetupGuideProps> = ({ stations }) => {
  const [copiedStationId, setCopiedStationId] = useState<string | null>(null);
  const [copiedMode, setCopiedMode] = useState<'clean' | 'full' | null>(null);
  const [stationQRs, setStationQRs] = useState<{ [key: string]: string }>({});

  // Recommended Public Shared URL for the event
  const defaultPublicOrigin = 'https://ais-pre-euuvji2qf7bgnkaf3qcqrv-172635485435.asia-east1.run.app';
  
  const [selectedOrigin, setSelectedOrigin] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.origin.includes('ais-dev-')) {
        return defaultPublicOrigin;
      }
      return window.location.origin;
    }
    return defaultPublicOrigin;
  });

  const [customDomainInput, setCustomDomainInput] = useState<string>('');

  useEffect(() => {
    // Generate QR codes for each of the 8 stations
    stations.forEach(async (station) => {
      const stationUrl = `${selectedOrigin}/#checkin=${station.id}`;
      try {
        const url = await QRCode.toDataURL(stationUrl, {
          width: 300,
          margin: 1,
          color: { dark: '#0f172a', light: '#ffffff' },
        });
        setStationQRs((prev) => ({ ...prev, [station.id]: url }));
      } catch (err) {
        console.error('Error generating station QR', err);
      }
    });
  }, [stations, selectedOrigin]);

  const handleCopy = (text: string, id: string, mode: 'clean' | 'full') => {
    navigator.clipboard.writeText(text);
    setCopiedStationId(id);
    setCopiedMode(mode);
    setTimeout(() => {
      setCopiedStationId(null);
      setCopiedMode(null);
    }, 2500);
  };

  const handlePrintAllStandees = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Guide Header */}
      <div className="bg-gradient-to-tr from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-4 h-4 text-purple-400" />
            Cẩm Nang Kỹ Thuật Ban Tổ Chức (BTC SGU’s Day 2026)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Hướng Dẫn Ghi 8 Thẻ NFC & Khắc Phục Lỗi 404 Safari (iOS)
          </h2>
          <p className="text-purple-100 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Hỗ trợ đầy đủ chuẩn thẻ <strong>NXP - Mifare Classic 1K (ISO 14443-3A)</strong> của Ban Tổ chức. Dưới đây là link chuẩn nạp vào 8 thẻ NFC (tương ứng 8 hoạt động có điểm danh số 3, 6, 8, 9, 10, 12, 13, 17) và cách in Standee dự phòng.
          </p>
        </div>
      </div>

      {/* CRITICAL ALERT: WHY IOS SAFARI GETS 404 AND HOW TO FIX IT */}
      <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-base font-extrabold text-rose-950 flex items-center gap-2">
              <span>Tại sao iPhone (Safari) bị lỗi 404 còn Android lại được?</span>
            </h3>
            <p className="text-xs text-rose-900 font-medium leading-relaxed">
              Có <strong>2 nguyên nhân chính</strong> gây ra lỗi 404 trên Safari khi chạm thẻ NFC:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
          {/* Cause 1 */}
          <div className="bg-white p-4 rounded-2xl border border-rose-200 space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-bold">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[11px]">1</span>
              <span>Bị dính lặp 2 lần "https://https://"</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Trong app <strong>NFC Tools</strong>, ở mục thêm URL đã có sẵn ô chọn tiền tố <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-600 font-bold">https://</code> bên trái. Nếu bạn dán cả đường link <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">https://...</code> vào ô bên phải, thẻ NFC sẽ ghi thành:
            </p>
            <div className="p-2 bg-rose-100/70 rounded-lg text-rose-900 font-mono text-[11px] break-all border border-rose-200">
              ❌ https://https://ais-pre-...run.app/#checkin=station-1
            </div>
            <p className="text-slate-600 text-[11px]">
              👉 <strong>Android</strong> có thể tự sửa, nhưng <strong>iOS Safari</strong> sẽ hiểu tên miền là <code className="font-mono text-rose-700 font-bold">https</code> và lập tức báo lỗi 404 / Không tìm thấy máy chủ!
            </p>
          </div>

          {/* Cause 2 */}
          <div className="bg-white p-4 rounded-2xl border border-rose-200 space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-bold">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[11px]">2</span>
              <span>Dùng nhầm link nội bộ (-dev-)</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Link <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-bold font-mono">ais-dev-...</code> chỉ chạy trong màn hình soạn thảo có đăng nhập tài khoản của bạn.
            </p>
            <p className="text-slate-600 text-[11px]">
              Khi điện thoại của người khác quét thẻ, do không có phiên đăng nhập của bạn, Google Cloud Run sẽ trả về thông báo <strong>"Error: Page not found - The requested URL was not found on this server"</strong>.
            </p>
          </div>

          {/* Cause 3 */}
          <div className="bg-white p-4 rounded-2xl border border-rose-200 space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-bold">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[11px]">3</span>
              <span>Chưa bấm "Publish / Share" trên AI Studio</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Link công khai <code className="bg-emerald-50 px-1 py-0.5 rounded text-emerald-800 font-bold font-mono">ais-pre-...</code> chỉ hoạt động khi bạn đã bấm nút <strong>"Share" / "Publish"</strong> ở góc trên bên phải màn hình AI Studio.
            </p>
            <p className="text-slate-600 text-[11px]">
              Nếu chưa Publish hoặc thao tác Publish chưa hoàn tất, máy chủ Google Cloud Run chưa tạo container công khai nên sẽ báo <strong>"The requested URL was not found on this server"</strong>.
            </p>
          </div>
        </div>

        {/* Action instruction */}
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-emerald-950 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-bold text-emerald-900">Giải pháp 1 chạm:</strong>
            <p className="text-emerald-900/90 leading-relaxed text-[11px]">
              Ở bảng 11 trạm bên dưới, hãy bấm nút <strong>"Copy cho NFC Tools (Đã bỏ https://)"</strong>. Sau đó mở NFC Tools, giữ nguyên ô bên trái là <code className="font-bold">https://</code> và chỉ dán nội dung đã copy vào ô bên phải rồi bấm <strong>Ghi (Write)</strong>. Cả iPhone và Android sẽ mở trang và đóng dấu 100% thành công!
            </p>
          </div>
        </div>
      </div>

      {/* ANDROID CHROME NFC PERMISSION TEST & GUIDANCE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Smartphone className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Kiểm Tra Quyền Web NFC Trên Trình Duyệt Android (Chrome)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống kiểm tra trực tiếp và hiển thị hộp thoại cấp quyền của Chrome cho điện thoại Android.
            </p>
          </div>
        </div>

        <NFCAndroidPermissionCard />
      </div>

      {/* Domain Selection Configuration */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Cấu hình Tên miền Website Ngày hội để nạp vào thẻ
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <button
            onClick={() => setSelectedOrigin(defaultPublicOrigin)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              selectedOrigin === defaultPublicOrigin
                ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">🌐 Link Công Khai AI Studio</span>
              {selectedOrigin === defaultPublicOrigin && (
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px]">Đang chọn</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-1 truncate">{defaultPublicOrigin}</p>
            <span className="text-[10px] text-emerald-700 font-medium block mt-1">✓ Mặc định sự kiện</span>
          </button>

          <button
            onClick={() => setSelectedOrigin(typeof window !== 'undefined' ? window.location.origin : defaultPublicOrigin)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              selectedOrigin === (typeof window !== 'undefined' ? window.location.origin : defaultPublicOrigin) && selectedOrigin !== defaultPublicOrigin
                ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">⚡ Link Trực Tiếp Hiện Tại</span>
              {selectedOrigin === (typeof window !== 'undefined' ? window.location.origin : defaultPublicOrigin) && selectedOrigin !== defaultPublicOrigin && (
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px]">Đang chọn</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-1 truncate">{typeof window !== 'undefined' ? window.location.origin : defaultPublicOrigin}</p>
            <span className="text-[10px] text-slate-500 block mt-1">Tự động lấy tên miền trang đang mở</span>
          </button>

          <div className={`p-3.5 rounded-2xl border transition-all ${
            selectedOrigin !== defaultPublicOrigin && selectedOrigin !== (typeof window !== 'undefined' ? window.location.origin : '')
              ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
              : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-900">🚀 Tên miền Vercel / Netlify</span>
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={customDomainInput}
                onChange={(e) => setCustomDomainInput(e.target.value)}
                placeholder="ví dụ: sgu-day-2025.vercel.app"
                className="flex-1 px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={() => {
                  let domain = customDomainInput.trim();
                  if (!domain) return;
                  if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
                    domain = 'https://' + domain;
                  }
                  domain = domain.replace(/\/+$/, '');
                  setSelectedOrigin(domain);
                }}
                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[11px] shrink-0 shadow-xs"
              >
                Áp dụng
              </button>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">Nhập link để tự động tạo link nạp cho 11 trạm</span>
          </div>
        </div>
      </div>

      {/* 3 Step NFC Setup Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-sm">
            1
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Mở tab "GHI" trên NFC Tools</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mở ứng dụng <strong>NFC Tools</strong> trên điện thoại Android, chuyển từ tab <strong>ĐỌC</strong> sang tab <strong>GHI (WRITE)</strong>.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-sm">
            2
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Thêm bản ghi URL / URI</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Chọn <strong>"Thêm một bản ghi" (Add a record)</strong> &rarr; Chọn <strong>"URL / URI"</strong> &rarr; Giữ nguyên ô <code className="font-bold text-blue-600">https://</code> và dán link vào ô bên cạnh.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-sm">
            3
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Áp thẻ Mifare 1K để Ghi</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Nhấn nút <strong>"Ghi / Viết" (Write)</strong>, sau đó chạm thẻ Mifare Classic 1K vào mặt lưng điện thoại cho đến khi ứng dụng hiện thông báo xanh thành công!
          </p>
        </div>
      </div>

      {/* 8 STATIONS NFC URL & QR DATA TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Dữ Liệu Ghi 8 Thẻ NFC & Mã QR Standee Tương Ứng</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sao chép đúng định dạng để nạp vào 8 thẻ NFC, hoặc in các mã QR này dán lên bàn trạm làm phương án dự phòng.
            </p>
          </div>

          <button
            onClick={handlePrintAllStandees}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>In Bộ 8 Standee Để Bàn</span>
          </button>
        </div>

        {/* List of 8 Stations with copyable URLs and QR previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stations.map((st) => {
            const cleanOrigin = selectedOrigin.replace(/^https?:\/\//, '');
            const fullUrl = `${selectedOrigin}/#checkin=${st.id}`;
            const cleanNfcToolsText = `${cleanOrigin}/#checkin=${st.id}`;
            const isCleanCopied = copiedStationId === st.id && copiedMode === 'clean';
            const isFullCopied = copiedStationId === st.id && copiedMode === 'full';

            return (
              <div
                key={st.id}
                className="p-5 rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-xs shrink-0">
                      {st.stampBadge}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                        Thẻ Trạm {st.stationNumber} (HĐ #{st.activityNumber})
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{st.shortName}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{st.location}</p>
                    </div>
                  </div>

                  {/* QR Preview Thumbnail */}
                  {stationQRs[st.id] && (
                    <div className="p-1 bg-white border border-slate-200 rounded-xl shrink-0 shadow-2xs">
                      <img src={stationQRs[st.id]} alt={`QR ${st.name}`} className="w-14 h-14" />
                    </div>
                  )}
                </div>

                {/* COPY BUTTON 1: FOR NFC TOOLS (NO HTTPS PREFIX - PREVENTS IOS 404) */}
                <div className="space-y-1.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Dán vào NFC Tools (Chống lỗi 404 iOS):
                    </span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                      Đã bỏ https://
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-mono font-bold text-blue-600 px-1 select-none">
                      https://
                    </span>
                    <input
                      type="text"
                      readOnly
                      value={cleanNfcToolsText}
                      className="w-full text-xs font-mono bg-transparent text-slate-800 px-1 select-all focus:outline-none truncate"
                    />
                    <button
                      onClick={() => handleCopy(cleanNfcToolsText, st.id, 'clean')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-2xs ${
                        isCleanCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      }`}
                    >
                      {isCleanCopied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCleanCopied ? 'Đã copy!' : 'Copy nạp thẻ'}</span>
                    </button>
                  </div>
                </div>

                {/* COPY BUTTON 2: FULL URL FOR BROWSER / QR */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span className="truncate pr-2 font-mono text-[10px] text-slate-400">{fullUrl}</span>
                  <button
                    onClick={() => handleCopy(fullUrl, st.id, 'full')}
                    className="text-[11px] text-blue-600 font-bold hover:underline shrink-0 flex items-center gap-1"
                  >
                    {isFullCopied ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{isFullCopied ? 'Đã copy URL' : 'Copy link đầy đủ'}</span>
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
