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
  Layers
} from 'lucide-react';
import { Station, Student } from '../types';
import { FACULTIES } from '../data/mockData';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  activeStudent: Student | null;
  pendingStation?: Station | null;
  onSelectStudent: (student: Student) => void;
  onRegisterStudent: (newStudentData: Omit<Student, 'id' | 'registeredAt' | 'completedStations' | 'checkinHistory' | 'isEligibleForReward' | 'rewardClaimed' | 'luckyDrawCode'>) => Student;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  students,
  activeStudent,
  pendingStation,
  onSelectStudent,
  onRegisterStudent,
}) => {
  const [tab, setTab] = useState<'register' | 'switch'>('register');
  const [searchMssv, setSearchMssv] = useState<string>('');

  // Form states
  const [mssv, setMssv] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [faculty, setFaculty] = useState<string>(FACULTIES[0]);
  const [major, setMajor] = useState<string>('Kỹ thuật Phần mềm');
  const [studentClass, setStudentClass] = useState<string>('24DTH01');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!mssv.trim() || !fullName.trim()) {
      setFormError('Vui lòng nhập đầy đủ Họ tên và Mã Số Sinh Viên (MSSV).');
      return;
    }

    // Check if MSSV already exists
    const existing = students.find((s) => s.mssv.toLowerCase() === mssv.trim().toLowerCase());
    if (existing) {
      onSelectStudent(existing);
      onClose();
      return;
    }

    const created = onRegisterStudent({
      mssv: mssv.trim().toUpperCase(),
      fullName: fullName.trim(),
      faculty,
      major: major.trim() || 'Chuyên ngành Tân Sinh Viên',
      studentClass: studentClass.trim() || '24KHOA01',
      email: email.trim() || `${mssv.toLowerCase()}@student.edu.vn`,
      phone: phone.trim() || '0901234567',
    });

    onSelectStudent(created);
    onClose();
  };

  const filteredStudents = students.filter(
    (s) =>
      s.mssv.toLowerCase().includes(searchMssv.toLowerCase()) ||
      s.fullName.toLowerCase().includes(searchMssv.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">
                Cổng Tân Sinh Viên SGU’s Day 2025
              </h3>
              <p className="text-xs text-blue-100 mt-0.5">
                Đăng ký nhận Thẻ e-Pass & Hộ chiếu sự kiện
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

        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200">
          <button
            onClick={() => setTab('register')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'register' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đăng ký Tân Sinh Viên Mới
          </button>
          <button
            onClick={() => setTab('switch')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'switch' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tra cứu theo MSSV ({students.length})
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {pendingStation && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-xs animate-in zoom-in-95 duration-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
                {pendingStation.stampBadge}
              </div>
              <div>
                <span className="font-bold text-emerald-950 block text-xs">
                  🎉 Bạn vừa chạm NFC tại {pendingStation.name}!
                </span>
                <span className="text-emerald-800 text-[11px] font-medium">
                  Đăng ký thông tin dưới đây để nhận Thẻ e-Pass & tự động nhận dấu Trạm này ngay.
                </span>
              </div>
            </div>
          )}

          {tab === 'register' ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Mã Số Sinh Viên (MSSV) *</label>
                  <input
                    type="text"
                    required
                    value={mssv}
                    onChange={(e) => setMssv(e.target.value)}
                    placeholder="VD: 24100999"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Họ và Tên Sinh Viên *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Nguyễn Văn An"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Khoa Đào Tạo</label>
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {FACULTIES.map((fac) => (
                    <option key={fac} value={fac}>{fac}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Ngành Học</label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="VD: Kỹ thuật Phần mềm"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Lớp Sinh Hoạt</label>
                  <input
                    type="text"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    placeholder="VD: 24DTH01"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Sinh Viên</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@student.edu.vn"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Số Điện Thoại</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all mt-4 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Hoàn tất & Cấp Thẻ Tân Sinh Viên</span>
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchMssv}
                  onChange={(e) => setSearchMssv(e.target.value)}
                  placeholder="Tìm theo MSSV hoặc họ tên..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {filteredStudents.map((s) => {
                  const isActive = activeStudent?.id === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        onSelectStudent(s);
                        onClose();
                      }}
                      className={`p-3 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                        isActive ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          {s.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                            <span>{s.fullName}</span>
                            {isActive && (
                              <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded">
                                Đang chọn
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {s.mssv} • {s.faculty}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-600">
                          {s.completedStations.length}/6 trạm
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
