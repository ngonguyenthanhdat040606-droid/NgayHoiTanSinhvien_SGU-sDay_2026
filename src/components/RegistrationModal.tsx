import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Sparkles,
  CheckCircle2,
  Search,
  Users,
  CreditCard,
  Building2,
  GraduationCap,
  Mail,
  Phone,
  Lock,
  KeyRound,
  LogOut,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Station, Student } from '../types';
import { FACULTIES } from '../data/mockData';
import { authenticateStudent, logoutActiveStudent } from '../utils/storage';
import { verifyStudentPinWithFirestore } from '../services/firebase';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  activeStudent: Student | null;
  pendingStation?: Station | null;
  onSelectStudent: (student: Student) => void;
  onRegisterStudent: (newStudentData: Omit<Student, 'id' | 'registeredAt' | 'completedStations' | 'checkinHistory'>) => Student;
  onLogoutStudent?: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  students,
  activeStudent,
  pendingStation,
  onSelectStudent,
  onRegisterStudent,
  onLogoutStudent,
}) => {
  const [tab, setTab] = useState<'register' | 'login'>('register');

  // Register Form states
  const [mssv, setMssv] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [faculty, setFaculty] = useState<string>(FACULTIES[0]);
  const [major, setMajor] = useState<string>('Kỹ thuật Phần mềm');
  const [studentClass, setStudentClass] = useState<string>('24DTH01');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [pinCode, setPinCode] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string>('');

  // Login Form states
  const [loginMssv, setLoginMssv] = useState<string>('');
  const [loginPin, setLoginPin] = useState<string>('');
  const [showLoginPin, setShowLoginPin] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (!mssv.trim() || !fullName.trim()) {
      setRegisterError('Vui lòng nhập đầy đủ Họ tên và Mã Số Sinh Viên (MSSV).');
      return;
    }

    if (pinCode.trim().length > 0 && pinCode.trim().length < 4) {
      setRegisterError('Mã PIN bảo mật phải có ít nhất 4 chữ số!');
      return;
    }

    const defaultPin = pinCode.trim() || (phone.trim() ? phone.trim().slice(-4) : '1234');

    const saved = onRegisterStudent({
      mssv: mssv.trim().toUpperCase(),
      fullName: fullName.trim(),
      faculty,
      major: major.trim() || 'Chuyên ngành Tân Sinh Viên',
      studentClass: studentClass.trim() || '24KHOA01',
      email: email.trim() || `${mssv.trim().toLowerCase()}@student.edu.vn`,
      phone: phone.trim() || '0901234567',
      pinCode: defaultPin,
    });

    onSelectStudent(saved);
    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginMssv.trim()) {
      setLoginError('Vui lòng nhập Mã Số Sinh Viên (MSSV)!');
      return;
    }

    setIsLoggingIn(true);

    // 1. Try local storage auth first
    const localRes = authenticateStudent(loginMssv.trim(), loginPin.trim());
    if (localRes.success && localRes.student) {
      setIsLoggingIn(false);
      onSelectStudent(localRes.student);
      onClose();
      return;
    }

    // 2. Try Firestore cloud lookup
    try {
      const cloudRes = await verifyStudentPinWithFirestore(loginMssv.trim(), loginPin.trim());
      if (cloudRes.success && cloudRes.student) {
        setIsLoggingIn(false);
        onSelectStudent(cloudRes.student);
        onClose();
        return;
      } else {
        setLoginError(cloudRes.message || localRes.message);
      }
    } catch (err: any) {
      setLoginError(localRes.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    logoutActiveStudent();
    if (onLogoutStudent) {
      onLogoutStudent();
    }
    setTab('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-orange-500 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - SGU Moodboard Theme */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 shadow-xs">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg leading-tight text-white drop-shadow-xs">
                Cổng Tân Sinh Viên SGU’s Day 2025
              </h3>
              <p className="text-xs text-orange-100 mt-0.5 font-semibold">
                Đăng ký & Quản lý Thẻ e-Pass cá nhân
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

        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-2 bg-amber-500/10 border-b border-orange-200">
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${tab === 'register' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-700 hover:text-orange-600'
              }`}
          >
            Đăng ký Thẻ Mới
          </button>
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${tab === 'login' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:text-blue-600'
              }`}
          >
            Đăng nhập Thẻ Đã Có
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Active student info alert if already logged in */}
          {activeStudent && (
            <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center">
                  {activeStudent.fullName.charAt(0)}
                </div>
                <div>
                  <div className="font-black text-slate-900 line-clamp-1">{activeStudent.fullName}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    MSSV: <strong className="text-blue-600">{activeStudent.mssv}</strong> • Đã thu thập: <strong>{activeStudent.completedStations.length}/11</strong> trạm
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-[11px] font-black text-rose-600 hover:text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}

          {pendingStation && (
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-2xl flex items-center gap-3.5 text-xs animate-in zoom-in-95 duration-200">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shrink-0 shadow-md">
                {pendingStation.stampBadge}
              </div>
              <div>
                <span className="font-display font-black text-emerald-950 block text-xs">
                  🎉 Bạn vừa chạm thẻ NFC tại {pendingStation.name}!
                </span>
                <span className="text-emerald-800 text-[11px] font-semibold">
                  Đăng ký hoặc Đăng nhập thẻ e-Pass bên dưới để tự động ghi nhận con dấu này.
                </span>
              </div>
            </div>
          )}

          {tab === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              {registerError && (
                <div className="p-3 bg-rose-50 text-rose-900 border border-rose-200 rounded-xl font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{registerError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-black text-slate-800">Mã Số Sinh Viên (MSSV) *</label>
                  <input
                    type="text"
                    required
                    value={mssv}
                    onChange={(e) => setMssv(e.target.value)}
                    placeholder="VD: 24100999"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-900 font-mono font-black focus:border-orange-500 focus:outline-none uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-black text-slate-800">Họ và Tên Sinh Viên *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Nguyễn Văn An"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-900 font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-black text-slate-800">Khoa Đào Tạo</label>
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-900 font-bold focus:border-orange-500 focus:outline-none"
                >
                  {FACULTIES.map((fac) => (
                    <option key={fac} value={fac}>{fac}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-black text-slate-800">Ngành Học</label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="VD: Kỹ thuật Phần mềm"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-900 font-semibold focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-black text-slate-800">Lớp Sinh Hoạt</label>
                  <input
                    type="text"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    placeholder="VD: 24DTH01"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-900 font-semibold focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-black text-slate-800">Số Điện Thoại</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-900 focus:border-orange-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-black text-slate-800 flex items-center justify-between">
                    <span>Mã PIN 4 số bảo vệ thẻ *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPin ? 'text' : 'password'}
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="VD: 1234"
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-900 font-mono font-black focus:border-orange-500 focus:outline-none pr-9 tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-black text-slate-800">Email Sinh Viên</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@student.edu.vn"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="arcade-btn-orange w-full py-3.5 rounded-2xl text-white font-black text-sm tracking-wide uppercase shadow-lg transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Hoàn tất & Cấp Thẻ e-Pass</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="p-3.5 bg-blue-50/110 border border-blue-200 rounded-2xl text-slate-700 text-xs leading-relaxed space-y-1">
                <div className="font-black text-blue-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Đăng nhập kích hoạt Thẻ e-Pass</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Nhập Mã số sinh viên và Mã PIN 4 số bạn đã tạo khi đăng ký (hoặc 4 số cuối SĐT) để đồng bộ dữ liệu vào thiết bị này.
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 text-rose-900 border border-rose-200 rounded-xl font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-black text-slate-800">Mã Số Sinh Viên (MSSV) *</label>
                <input
                  type="text"
                  required
                  value={loginMssv}
                  onChange={(e) => setLoginMssv(e.target.value)}
                  placeholder="VD: 24100999"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-900 font-mono font-black focus:border-blue-600 focus:outline-none uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="font-black text-slate-800">Mã PIN bảo mật (4 số) *</label>
                <div className="relative">
                  <input
                    type={showLoginPin ? 'text' : 'password'}
                    required
                    maxLength={6}
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="VD: 1234 hoặc 4 số cuối SĐT"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-900 font-mono font-black focus:border-blue-600 focus:outline-none pr-9 tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPin(!showLoginPin)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showLoginPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="arcade-btn-blue w-full py-3.5 rounded-2xl text-white font-black text-sm tracking-wide uppercase shadow-lg transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4 text-amber-300" />
                <span>{isLoggingIn ? 'Đang kiểm tra...' : 'Đăng Nhập Thẻ Sinh Viên'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

