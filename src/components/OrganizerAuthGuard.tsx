import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Unlock, 
  LogOut, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Settings, 
  X,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { 
  getOrganizerPin, 
  setOrganizerPin, 
  isOrganizerAuthenticated, 
  setOrganizerAuthenticated 
} from '../utils/storage';

interface OrganizerAuthGuardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onBackToStudent?: () => void;
}

export const OrganizerAuthGuard: React.FC<OrganizerAuthGuardProps> = ({
  children,
  title = 'Khu Vực Ban Tổ Chức & Trưởng Trạm',
  subtitle = 'Nhập mã PIN bảo vệ để truy cập hệ thống quản lý trạm, ghi nhận thủ công và xuất báo cáo.',
  onBackToStudent,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isOrganizerAuthenticated());
  const [pinInput, setPinInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showChangePinModal, setShowChangePinModal] = useState<boolean>(false);
  const [showPin, setShowPin] = useState<boolean>(false);

  // Change PIN states
  const [oldPin, setOldPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmNewPin, setConfirmNewPin] = useState<string>('');
  const [changePinError, setChangePinError] = useState<string>('');
  const [changePinSuccess, setChangePinSuccess] = useState<string>('');

  const handleVerifyPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const correctPin = getOrganizerPin();

    if (!pinInput.trim()) {
      setErrorMsg('Vui lòng nhập mã PIN Ban Tổ Chức.');
      return;
    }

    if (pinInput.trim() === correctPin) {
      setOrganizerAuthenticated(true, true);
      setIsAuthenticated(true);
      setErrorMsg('');
      setPinInput('');
    } else {
      setErrorMsg('Mã PIN không chính xác. Vui lòng thử lại!');
    }
  };

  const handleLogout = () => {
    setOrganizerAuthenticated(false);
    setIsAuthenticated(false);
    setPinInput('');
    setErrorMsg('');
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentCorrectPin = getOrganizerPin();

    if (oldPin !== currentCorrectPin) {
      setChangePinError('Mã PIN hiện tại không đúng.');
      return;
    }

    if (newPin.length < 4) {
      setChangePinError('Mã PIN mới phải có ít nhất 4 ký tự.');
      return;
    }

    if (newPin !== confirmNewPin) {
      setChangePinError('Xác nhận mã PIN mới không khớp.');
      return;
    }

    setOrganizerPin(newPin);
    setChangePinSuccess('Đổi mã PIN thành công! Hãy ghi nhớ mã PIN mới.');
    setChangePinError('');
    setTimeout(() => {
      setShowChangePinModal(false);
      setOldPin('');
      setNewPin('');
      setConfirmNewPin('');
      setChangePinSuccess('');
    }, 1500);
  };

  // If already authenticated, render Organizer Tool Header + Children
  if (isAuthenticated) {
    return (
      <div className="space-y-4">
        {/* Organizer Active Session Bar */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 rounded-2xl p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <span>Đang đăng nhập Quyền Ban Tổ Chức / Quản Lý Trạm</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Đã xác thực
                </span>
              </div>
              <p className="text-[11px] text-amber-800/80">
                Toàn bộ thao tác điểm danh thủ công, xóa dấu và xuất file CSV đã được mở khóa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => setShowChangePinModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-amber-300 text-amber-900 font-semibold transition-all flex items-center gap-1.5 shadow-xs text-xs"
            >
              <Settings className="w-3.5 h-3.5 text-amber-700" />
              <span>Đổi PIN</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-all flex items-center gap-1.5 shadow-xs text-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Khóa lại (Thoát BTC)</span>
            </button>
          </div>
        </div>

        {/* Protected Organizer Content */}
        {children}

        {/* Change PIN Modal */}
        {showChangePinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-slate-900 text-base">Đổi Mã PIN Ban Tổ Chức</h3>
                </div>
                <button
                  onClick={() => setShowChangePinModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {changePinError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{changePinError}</span>
                </div>
              )}

              {changePinSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{changePinSuccess}</span>
                </div>
              )}

              <form onSubmit={handleChangePinSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mã PIN hiện tại</label>
                  <input
                    type="password"
                    value={oldPin}
                    onChange={(e) => setOldPin(e.target.value)}
                    placeholder="Mặc định: 2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mã PIN mới (tối thiểu 4 số)</label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Nhập PIN mới..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nhập lại Mã PIN mới</label>
                  <input
                    type="password"
                    value={confirmNewPin}
                    onChange={(e) => setConfirmNewPin(e.target.value)}
                    placeholder="Xác nhận PIN mới..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChangePinModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                  >
                    Lưu PIN mới
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If locked, render Secure PIN Prompt Screen
  return (
    <div className="max-w-md mx-auto my-6 sm:my-10 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-6 sm:p-8 text-white text-center relative">
        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-amber-400 mx-auto mb-4 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight">{title}</h2>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-xs mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-5">
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleVerifyPin} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>Mã PIN Ban Tổ Chức</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPin ? 'Ẩn' : 'Hiện'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Nhập mã PIN..."
                autoFocus
                className="w-full text-center text-xl font-mono tracking-widest px-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all font-bold text-slate-900 bg-slate-50 focus:bg-white"
              />
            </div>
            
            <div className="mt-2.5 p-2.5 bg-blue-50/80 rounded-xl border border-blue-100 flex items-start gap-2 text-[11px] text-blue-800">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Mã PIN mặc định cho BTC: </span>
                <button
                  type="button"
                  onClick={() => setPinInput('2026')}
                  className="font-mono font-bold text-blue-700 bg-white px-1.5 py-0.5 rounded border border-blue-200 hover:bg-blue-100 transition-colors ml-1"
                  title="Bấm để tự điền mã 2026"
                >
                  2026
                </button>
                <span className="text-slate-500 block text-[10px] mt-0.5">(Sau khi vào, bạn có thể đổi PIN bảo mật theo ý muốn)</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Unlock className="w-4 h-4" />
            <span>Mở Khóa Quyền Ban Tổ Chức</span>
          </button>
        </form>

        {onBackToStudent && (
          <div className="pt-2 text-center border-t border-slate-100">
            <button
              onClick={onBackToStudent}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại giao diện Tân Sinh Viên</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
