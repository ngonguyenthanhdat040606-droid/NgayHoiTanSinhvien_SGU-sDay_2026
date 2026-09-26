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
  ArrowLeft,
  Gamepad2,
  Building2,
  Users,
  Award
} from 'lucide-react';
import {
  getOrganizerPin,
  setOrganizerPin,
  isOrganizerAuthenticated,
  getOrganizerSession,
  setOrganizerSession,
  verifyOrganizerCredentials,
  clearOrganizerSession
} from '../utils/storage';
import { OrganizerSession } from '../types';

interface OrganizerAuthGuardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onBackToStudent?: () => void;
}

export const OrganizerAuthGuard: React.FC<OrganizerAuthGuardProps> = ({
  children,
  title = 'Khu Vực Ban Tổ Chức & Trưởng Trạm',
  subtitle = 'Nhập mã khóa xác thực để truy cập hệ thống quản lý trạm, ghi nhận thủ công và xuất báo cáo.',
  onBackToStudent,
}) => {
  const [session, setSession] = useState<OrganizerSession | null>(() => getOrganizerSession());
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
    if (!pinInput.trim()) {
      setErrorMsg('Vui lòng nhập Mã PIN hoặc Khóa bảo mật!');
      return;
    }

    const res = verifyOrganizerCredentials(pinInput.trim());
    if (res.success && res.session) {
      setSession(res.session);
      setErrorMsg('');
      setPinInput('');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleLogout = () => {
    clearOrganizerSession();
    setSession(null);
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

  // If already authenticated with valid session
  if (session && session.authenticated) {
    const isAdmin = session.role === 'admin';
    return (
      <div className="space-y-4">
        {/* Organizer Active Session Bar */}
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border-2 border-orange-300 rounded-3xl p-3.5 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${isAdmin ? 'bg-orange-600' : 'bg-blue-600'} text-white flex items-center justify-center font-black shrink-0 shadow-md`}>
              {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-display font-black text-slate-950 flex items-center gap-2">
                <span>{session.managerName || (isAdmin ? 'BAN CHỈ ĐẠO & TỔ CHỨC SGU' : 'TRƯỞNG TRẠM SGU')}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase text-white ${isAdmin ? 'bg-orange-600' : 'bg-blue-600'}`}>
                  {isAdmin ? 'Toàn quyền BTC' : `Trạm ${session.stationId?.replace('station-', '') || ''}`}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                {isAdmin
                  ? 'Đã mở khóa toàn bộ quyền điểm danh, quản lý 12 trạm, cấu hình NFC và thống kê xuất file.'
                  : `Đang quản lý điểm danh và tra cứu sinh viên tại ${session.managerName || 'Trạm sự kiện'}.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {isAdmin && (
              <button
                onClick={() => setShowChangePinModal(true)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border-2 border-orange-300 text-orange-950 font-bold transition-all flex items-center gap-1.5 shadow-xs text-xs cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-orange-600" />
                <span>Đổi PIN BTC</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black transition-all flex items-center gap-1.5 shadow-md text-xs cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Khóa lại (Thoát)</span>
            </button>
          </div>
        </div>

        {/* Protected Organizer Content */}
        {children}

        {/* Change PIN Modal */}
        {showChangePinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-orange-500 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-orange-600" />
                  <h3 className="font-display font-black text-slate-950 text-base">Đổi Mã PIN Ban Tổ Chức</h3>
                </div>
                <button
                  onClick={() => setShowChangePinModal(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {changePinError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{changePinError}</span>
                </div>
              )}

              {changePinSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold">
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
                    placeholder="Mặc định: 2025"
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 font-mono font-bold focus:border-orange-500 focus:outline-none"
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
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 font-mono font-bold focus:border-orange-500 focus:outline-none"
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
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 font-mono font-bold focus:border-orange-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChangePinModal(false)}
                    className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-bold cursor-pointer hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="arcade-btn-orange flex-1 py-2.5 rounded-xl text-white font-black uppercase cursor-pointer"
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
    <div className="max-w-md mx-auto my-6 sm:my-10 bg-white rounded-3xl border-2 border-orange-500 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
      <div className="bg-gradient-to-br from-orange-600 via-amber-500 to-orange-700 p-6 sm:p-8 text-white text-center relative">
        <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 backdrop-blur-md flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="font-display text-lg sm:text-xl font-black tracking-tight text-white">{title}</h2>
        <p className="text-xs text-orange-100 mt-2 leading-relaxed max-w-xs mx-auto font-medium">
          {subtitle}
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-5">
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleVerifyPin} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-orange-600" />
                <span>Khóa Bảo Mật / Mã PIN BTC</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-[11px] text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
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
                placeholder="Nhập mã PIN hoặc Khóa trạm..."
                autoFocus
                className="w-full text-center text-lg font-mono tracking-widest px-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:outline-none transition-all font-black text-slate-900 bg-slate-50 focus:bg-white uppercase"
              />
            </div>


          </div>

          <button
            type="submit"
            className="arcade-btn-orange w-full py-3.5 rounded-2xl text-white font-black text-sm tracking-wide uppercase shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Unlock className="w-4 h-4" />
            <span>Mở Khóa Ban Tổ Chức</span>
          </button>
        </form>

        {onBackToStudent && (
          <div className="pt-2 text-center border-t border-slate-100">
            <button
              onClick={onBackToStudent}
              className="text-xs font-bold text-slate-600 hover:text-orange-600 flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
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

