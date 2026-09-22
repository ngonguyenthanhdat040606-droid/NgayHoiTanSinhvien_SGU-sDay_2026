import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Award, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  Search, 
  TrendingUp,
  Clock,
  Gamepad2,
  Trophy
} from 'lucide-react';
import { Student, Station } from '../types';

interface AdminAnalyticsProps {
  students: Student[];
  stations: Station[];
  isFirestoreSyncing?: boolean;
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({
  students,
  stations,
  isFirestoreSyncing = false,
}) => {
  const [filterQuery, setFilterQuery] = useState<string>('');

  const totalStations = stations.length || 8;
  const totalRegistered = students.length;
  const totalCompleted5Plus = students.filter((s) => s.completedStations.length >= 5).length;
  const totalCompletedAll = students.filter((s) => s.completedStations.length === totalStations).length;
  const totalCheckinLogs = students.reduce((acc, s) => acc + s.completedStations.length, 0);

  // Station counts
  const stationStats = stations.map((st) => {
    const count = students.filter((s) => s.completedStations.includes(st.id)).length;
    const percentage = totalRegistered > 0 ? Math.round((count / totalRegistered) * 100) : 0;
    return {
      ...st,
      count,
      percentage,
    };
  });

  // Students with 5+ stations completed
  const activeStudents = students.filter(
    (s) => s.completedStations.length >= 5
  );

  const filteredStudents = (activeStudents.length > 0 ? activeStudents : students).filter(
    (s) =>
      s.fullName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.mssv.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.faculty.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.studentClass.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const exportStudentList = () => {
    const headers = ['STT', 'MSSV', 'Họ và Tên', 'Khoa', 'Lớp', 'Email', 'SĐT', 'Số Trạm Hoàn Thành', 'Các Trạm Đã Tham Gia'];
    const rows = students.map((s, index) => {
      const completedNames = s.completedStations
        .map((stationId) => stations.find((st) => st.id === stationId)?.name || stationId)
        .join(', ');

      return [
        index + 1,
        s.mssv,
        `"${s.fullName}"`,
        `"${s.faculty}"`,
        s.studentClass,
        s.email,
        s.phone,
        `${s.completedStations.length}/${totalStations}`,
        `"${completedNames}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DanhSachDiemDanh_SGUsDay2025_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Live Firestore Synchronization Status Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-600 to-amber-600 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display font-black text-sm text-white">Đồng Bộ Dữ Liệu Tập Trung (Firebase Firestore)</h4>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black text-white uppercase tracking-wider">
                Thời gian thực
              </span>
            </div>
            <p className="text-xs text-orange-100 font-medium mt-0.5">
              Tất cả lượt chạm NFC và quét QR tại 9 trạm đều được cập nhật tức thì lên hệ cơ sở dữ liệu đám mây của Ban Tổ Chức.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold bg-black/20 px-3 py-1.5 rounded-xl border border-white/20">
            {isFirestoreSyncing ? 'Đang truyền...' : 'Đã kết nối Firestore Cloud'}
          </span>
        </div>
      </div>

      {/* Top 4 Metric KPI Cards - Arcade/Retro Theme */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border-2 border-orange-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-600 text-xs font-black uppercase">
            <span>Tân Sinh Viên Đăng Ký</span>
            <Users className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-3xl font-display font-black text-slate-950">{totalRegistered}</div>
          <p className="text-[11px] text-slate-500 font-semibold">100% cấp Thẻ e-Pass SGU</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-orange-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-600 text-xs font-black uppercase">
            <span>Lượt Check-in 9 trạm</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-display font-black text-emerald-600">{totalCheckinLogs}</div>
          <p className="text-[11px] text-slate-500 font-semibold">Ghi nhận qua thẻ NFC & mã QR</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-orange-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-600 text-xs font-black uppercase">
            <span>Tiến Độ Tích Cực (≥ 5 Trạm)</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-display font-black text-amber-600">{totalCompleted5Plus}</div>
          <p className="text-[11px] text-slate-500 font-semibold">
            {totalRegistered > 0 ? Math.round((totalCompleted5Plus / totalRegistered) * 100) : 0}% tổng số sinh viên
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-orange-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-600 text-xs font-black uppercase">
            <span>Hoàn Thành 8/9 trạm</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-display font-black text-purple-600">{totalCompletedAll}</div>
          <p className="text-[11px] text-slate-500 font-semibold">Chinh phục toàn bộ hành trình</p>
        </div>
      </div>

      {/* Station Leaderboard & Traffic Distribution */}
      <div className="bg-white rounded-3xl border-2 border-orange-200 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-black text-base text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              <span>Tiến Độ Tham Gia Tại 9 trạm Ngày Hội SGU’s Day 2026</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Thống kê lượng sinh viên đã check-in tại từng trạm theo thời gian thực
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stationStats.map((st) => (
            <div key={st.id} className="p-3.5 rounded-2xl bg-amber-500/10 border-2 border-orange-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base shrink-0">{st.stampBadge}</span>
                  <div className="truncate">
                    <span className="font-bold text-slate-900 block truncate">{st.name}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{st.location}</span>
                  </div>
                </div>
                <div className="font-mono font-black text-slate-800 shrink-0 ml-2">
                  {st.count} SV <span className="text-slate-500 font-medium">({st.percentage}%)</span>
                </div>
              </div>

              {/* Progress visual bar */}
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(st.percentage, 5)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Progress Overview Table */}
      <div className="bg-white rounded-3xl border-2 border-orange-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-display font-black text-base text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-600" />
              <span>Danh Sách Tổng Hợp Điểm Danh Tân Sinh Viên</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Hiển thị các bạn sinh viên đã tham gia điểm danh ({filteredStudents.length} sinh viên)
            </p>
          </div>

          <button
            onClick={exportStudentList}
            className="arcade-btn-orange px-4 py-2.5 rounded-2xl text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer uppercase"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Danh Sách Điểm Danh (CSV)</span>
          </button>
        </div>

        {/* Search */}
        <div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Tìm theo Tên, MSSV, Khoa hoặc Lớp..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-2">#</th>
                <th className="py-2.5 px-2">MSSV</th>
                <th className="py-2.5 px-2">Họ và Tên</th>
                <th className="py-2.5 px-2">Khoa</th>
                <th className="py-2.5 px-2">Lớp</th>
                <th className="py-2.5 px-2 text-right">Tiến độ 9 trạm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((stu, index) => (
                <tr key={stu.id} className="hover:bg-orange-50/50 transition-colors">
                  <td className="py-3 px-2 font-mono text-slate-400">{index + 1}</td>
                  <td className="py-3 px-2 font-mono font-black text-slate-900">{stu.mssv}</td>
                  <td className="py-3 px-2 font-bold text-slate-900">{stu.fullName}</td>
                  <td className="py-3 px-2 text-slate-600 font-medium">{stu.faculty}</td>
                  <td className="py-3 px-2 font-mono text-slate-600 font-medium">{stu.studentClass}</td>
                  <td className="py-3 px-2 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full font-black text-[11px] ${
                      stu.completedStations.length === totalStations
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : stu.completedStations.length >= 5
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-orange-100 text-orange-800 border border-orange-200'
                    }`}>
                      {stu.completedStations.length}/{totalStations} trạm
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
