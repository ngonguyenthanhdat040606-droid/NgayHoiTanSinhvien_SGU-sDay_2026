import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Search, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  QrCode, 
  Download, 
  Trash2, 
  Clock, 
  Users, 
  Smartphone,
  ChevronDown,
  Layers,
  Sparkles,
  ExternalLink,
  Award,
  Zap,
  Phone,
  MapPin,
  RefreshCw,
  Building2
} from 'lucide-react';
import { Station, Student } from '../types';

interface StationMasterViewProps {
  stations: Station[];
  students: Student[];
  onCheckinStudent: (
    studentMssvOrId: string, 
    stationId: string, 
    method: 'manual_mssv' | 'manager_scan' | 'nfc_tap',
    managerName?: string
  ) => { success: boolean; message: string; student?: Student };
  onUndoCheckin: (studentId: string, stationId: string) => void;
  onOpenNfcGuide: () => void;
}

export const StationMasterView: React.FC<StationMasterViewProps> = ({
  stations,
  students,
  onCheckinStudent,
  onUndoCheckin,
  onOpenNfcGuide,
}) => {
  const [selectedStationId, setSelectedStationId] = useState<string>(stations[0]?.id || 'station-1');
  const [inputMssv, setInputMssv] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const currentStation = stations.find((s) => s.id === selectedStationId) || stations[0];

  // Filter students who have checked in at THIS station
  const checkedInStudents = useMemo(() => {
    return students.filter((stu) => stu.completedStations.includes(currentStation.id));
  }, [students, currentStation.id]);

  // Filtered checkin list by search
  const filteredCheckedInList = useMemo(() => {
    if (!searchFilter.trim()) return checkedInStudents;
    const q = searchFilter.toLowerCase();
    return checkedInStudents.filter(
      (s) => s.fullName.toLowerCase().includes(q) || s.mssv.toLowerCase().includes(q) || s.studentClass.toLowerCase().includes(q)
    );
  }, [checkedInStudents, searchFilter]);

  // Suggested students matching current MSSV input
  const suggestedStudents = useMemo(() => {
    if (!inputMssv.trim()) return [];
    const q = inputMssv.toLowerCase().trim();
    return students
      .filter((s) => s.mssv.toLowerCase().includes(q) || s.fullName.toLowerCase().includes(q))
      .slice(0, 5);
  }, [students, inputMssv]);

  const handleManualSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMssv.trim()) {
      setActionAlert({ type: 'error', message: 'Vui lòng nhập Mã Số Sinh Viên (MSSV)!' });
      return;
    }

    const res = onCheckinStudent(inputMssv.trim(), currentStation.id, 'manual_mssv', currentStation.managerName);
    if (res.success) {
      setActionAlert({ type: 'success', message: res.message });
      setInputMssv('');
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    } else {
      setActionAlert({ type: 'error', message: res.message });
    }
  };

  const handleQuickCheckin = (mssv: string) => {
    const res = onCheckinStudent(mssv, currentStation.id, 'manual_mssv', currentStation.managerName);
    if (res.success) {
      setActionAlert({ type: 'success', message: res.message });
      setInputMssv('');
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    } else {
      setActionAlert({ type: 'error', message: res.message });
    }
  };

  const exportCSV = () => {
    const headers = ['STT', 'MSSV', 'Họ và Tên', 'Khoa', 'Lớp', 'Email', 'SĐT', 'Thời gian Điểm danh', 'Hình thức'];
    const rows = checkedInStudents.map((s, index) => {
      const history = s.checkinHistory.find((c) => c.stationId === currentStation.id);
      return [
        index + 1,
        s.mssv,
        `"${s.fullName}"`,
        `"${s.faculty}"`,
        s.studentClass,
        s.email,
        s.phone,
        `"${history?.timestamp || 'Đã ghi nhận'}"`,
        `"${history?.method || 'NFC/Thủ công'}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DiemDanh_Tram${currentStation.stationNumber}_${currentStation.shortName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner Notice for Station Master Mode */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Bàn Quản Lý 8 Trạm Sự Kiện (Ban Tổ Chức SGU’s Day 2025)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hệ Thống Điểm Danh Trạm & Ghi Nhận Thủ Công
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Quản lý trạm sử dụng bảng điều khiển này để đối chiếu thẻ NFC trạm, điểm danh nhanh cho tân sinh viên qua MSSV khi không quét được thẻ, và xuất danh sách tổng hợp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNfcGuide}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Radio className="w-4 h-4" />
              <span>Hướng dẫn Ghi thẻ NFC (NFC Tools)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 STATIONS SWITCHER PILLS */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Chọn Trạm bạn đang trực ca (Tương ứng 8 hoạt động có điểm danh):
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {stations.map((st) => {
            const isSelected = st.id === currentStation.id;
            const count = students.filter((s) => s.completedStations.includes(st.id)).length;

            return (
              <button
                key={st.id}
                id={`station-tab-${st.id}`}
                onClick={() => {
                  setSelectedStationId(st.id);
                  setActionAlert(null);
                }}
                className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 ring-2 ring-blue-400/50'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    Trạm {st.stationNumber} (HĐ {st.activityNumber})
                  </span>
                  <span className="text-lg">{st.stampBadge}</span>
                </div>
                <div className="mt-2">
                  <div className="font-bold text-xs line-clamp-1">{st.shortName}</div>
                  <div className={`text-[11px] mt-0.5 font-medium ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}>
                    {count} SV đã qua trạm
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Station Overview & Tag Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Station NFC Info & Fast Check-in Input */}
        <div className="lg:col-span-5 space-y-6">
          {/* Station NFC Hardware Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md">
                  {currentStation.stampBadge}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {currentStation.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{currentStation.location}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* NFC Card Spec Box */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between text-xs border-b border-slate-700 pb-2">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  Thẻ NFC Trạm (Mifare Classic 1K)
                </span>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  {currentStation.nfcTagId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                <div>
                  <span className="text-slate-500 block">Phụ trách:</span>
                  <span className="font-medium text-white">{currentStation.managerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Đơn vị:</span>
                  <span className="font-medium text-white truncate block">{currentStation.assignedUnit || 'LCH Khoa'}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-700/60">
                💡 Đặt thẻ NFC này tại mặt bàn trạm. Sinh viên chỉ cần áp điện thoại vào để nhận dấu tức thì.
              </p>
            </div>

            {/* ACTION ALERT */}
            {actionAlert && (
              <div className={`p-3.5 rounded-2xl text-xs font-medium flex items-start gap-2 animate-in fade-in duration-200 ${
                actionAlert.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}>
                {actionAlert.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>{actionAlert.message}</div>
              </div>
            )}

            {/* MANUAL MSSV INPUT FORM (CORE REQUIREMENT) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span>Nhập thủ công Mã Số Sinh Viên (MSSV)</span>
                </label>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    id="manual-mssv-input"
                    type="text"
                    value={inputMssv}
                    onChange={(e) => setInputMssv(e.target.value)}
                    placeholder="VD: 24100123 hoặc họ tên..."
                    className="w-full pl-3.5 pr-24 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                  />
                  <button
                    type="submit"
                    id="submit-manual-mssv-btn"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all shadow-xs flex items-center gap-1"
                  >
                    <span>Ghi nhận</span>
                  </button>
                </div>

                {/* Auto Suggestions when typing */}
                {suggestedStudents.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-0.5">
                      Gợi ý sinh viên nhanh:
                    </div>
                    {suggestedStudents.map((s) => {
                      const isAlreadyIn = s.completedStations.includes(currentStation.id);
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleQuickCheckin(s.mssv)}
                          className="p-2 rounded-lg bg-white hover:bg-blue-50 border border-slate-100 cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{s.fullName}</span>
                            <span className="text-slate-500 font-mono ml-2">({s.mssv})</span>
                            <span className="text-slate-400 text-[10px] block">{s.faculty}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isAlreadyIn
                              ? 'bg-slate-100 text-slate-500'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isAlreadyIn ? 'Đã điểm danh' : 'Bấm để Điểm danh'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Real-time Check-in Table & Export */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col h-full min-h-[480px]">
            {/* Table Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Danh sách Điểm Danh tại {currentStation.shortName}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tổng cộng: <strong className="text-blue-600 font-bold">{checkedInStudents.length}</strong> sinh viên đã hoàn thành trạm này
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="export-csv-station-btn"
                  onClick={exportCSV}
                  disabled={checkedInStudents.length === 0}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                  title="Xuất file danh sách sinh viên đã điểm danh"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Xuất file Excel/CSV</span>
                </button>
              </div>
            </div>

            {/* Search Filter */}
            <div className="pt-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Tìm theo Tên, MSSV hoặc Lớp..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-x-auto mt-3">
              {filteredCheckedInList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 space-y-2">
                  <Users className="w-10 h-10 text-slate-300 stroke-1" />
                  <p className="text-xs">
                    {searchFilter ? 'Không tìm thấy sinh viên phù hợp với từ khóa.' : 'Chưa có sinh viên nào điểm danh tại trạm này.'}
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="py-2.5 px-2">#</th>
                      <th className="py-2.5 px-2">MSSV</th>
                      <th className="py-2.5 px-2">Họ và Tên</th>
                      <th className="py-2.5 px-2">Khoa / Lớp</th>
                      <th className="py-2.5 px-2">Thời gian</th>
                      <th className="py-2.5 px-2 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCheckedInList.map((stu, index) => {
                      const checkinLog = stu.checkinHistory.find((c) => c.stationId === currentStation.id);
                      return (
                        <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-2 font-mono text-slate-400">{index + 1}</td>
                          <td className="py-3 px-2 font-mono font-bold text-slate-800">{stu.mssv}</td>
                          <td className="py-3 px-2 font-semibold text-slate-900">{stu.fullName}</td>
                          <td className="py-3 px-2 text-slate-500">
                            <span className="block font-medium text-slate-700 truncate max-w-[140px]">{stu.faculty}</span>
                            <span className="text-[10px] text-slate-400">{stu.studentClass}</span>
                          </td>
                          <td className="py-3 px-2 text-slate-500 font-mono text-[11px]">
                            {checkinLog?.timestamp ? checkinLog.timestamp.split(' ')[0] : 'Vừa xong'}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Bạn có chắc chắn muốn hủy điểm danh của sinh viên ${stu.fullName} tại ${currentStation.shortName}?`)) {
                                  onUndoCheckin(stu.id, currentStation.id);
                                }
                              }}
                              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                              title="Hủy điểm danh nếu nhập nhầm"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
