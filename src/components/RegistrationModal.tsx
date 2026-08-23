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
  Layers,
  PartyPopper
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
  onRegisterStudent: (newStudentData: Omit<Student, 'id' | 'registeredAt' | 'completedStations' | 'checkinHistory'>) => Student;
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

    const saved = onRegisterStudent({
      mssv: mssv.trim().toUpperCase(),
      fullName: fullName.trim(),
      faculty,
      major: major.trim() || 'Chuyên ngành Tân Sinh Viên',
      studentClass: studentClass.trim() || '24KHOA01',
      email: email.trim() || `${mssv.trim().toLowerCase()}@student.edu.vn`,
      phone: phone.trim() || '0901234567',
    });

    onSelectStudent(saved);
    onClose();
  };

  const filteredStudents = students.filter(
    (s) =>
      s.mssv.toLowerCase().includes(searchMssv.toLowerCase()) ||
      s.fullName.toLowerCase().includes(searchMssv.toLowerCase())
  );

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
                Đăng ký nhận Thẻ e-Pass & Hộ chiếu sự kiện
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
            onClick={() => setTab('register')}
            className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              tab === 'register' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-700 hover:text-orange-600'
            }`}
          >
            Đăng ký Tân Sinh Viên Mới
          </button>
          <button
            onClick={() => setTab('switch')}
            className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              tab === 'switch' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            Tra cứu theo MSSV ({students.length})
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
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
                  Đăng ký thông tin dưới đây để nhận Thẻ e-Pass & tự động nhận dấu Trạm này ngay.
                </span>
              </div>
            </div>
          )}

          {tab === 'register' ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 text-rose-900 border border-rose-200 rounded-xl font-bold">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
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

              <div className="grid grid-cols-2 gap-3">
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

              <div className="grid grid-cols-2 gap-3">
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

                <div className="space-y-1">
                  <label className="font-black text-slate-800">Số Điện Thoại</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>
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
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchMssv}
                  onChange={(e) => setSearchMssv(e.target.value)}
                  placeholder="Tìm theo MSSV hoặc họ tên sinh viên..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-orange-500"
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
                      className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between transition-colors ${
                        isActive ? 'bg-orange-50 border-2 border-orange-300' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                          {s.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-black text-xs text-slate-950 flex items-center gap-1.5">
                            <span>{s.fullName}</span>
                            {isActive && (
                              <span className="text-[10px] bg-orange-600 text-white px-1.5 py-0.2 rounded font-bold">
                                Đang chọn
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono font-bold">
                            {s.mssv} • {s.faculty}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-600 font-mono">
                          {s.completedStations.length}/8 trạm
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
