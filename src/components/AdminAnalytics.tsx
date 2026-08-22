import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Award, 
  Gift, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  Search, 
  TrendingUp,
  Layers,
  HelpCircle,
  Clock
} from 'lucide-react';
import { Student, Station } from '../types';

interface AdminAnalyticsProps {
  students: Student[];
  stations: Station[];
  onClaimReward: (studentId: string) => void;
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({
  students,
  stations,
  onClaimReward,
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

  // Eligible students for prize (5+ stations)
  const eligibleStudents = students.filter(
    (s) => s.completedStations.length >= 5
  );

  const filteredEligible = eligibleStudents.filter(
    (s) =>
      s.fullName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.mssv.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.faculty.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (s.luckyDrawCode && s.luckyDrawCode.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  const exportLuckyDrawList = () => {
    const headers = ['STT', 'Mã Cá Nhân', 'MSSV', 'Họ và Tên', 'Khoa', 'Số Trạm Hoàn Thành', 'Trạng Thái Nhận Quà'];
    const rows = eligibleStudents.map((s, index) => [
      index + 1,
      s.luckyDrawCode || 'SGU-2025',
      s.mssv,
      `"${s.fullName}"`,
      `"${s.faculty}"`,
      `${s.completedStations.length}/${totalStations}`,
      s.rewardClaimed ? 'Đã nhận quà' : 'Chưa nhận',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DanhSachNhanQua_SGUsDay2025_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Tân Sinh Viên Đăng Ký</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{totalRegistered}</div>
          <p className="text-[11px] text-slate-500 font-medium">100% cấp Thẻ Tân Sinh Viên số</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Lượt Check-in 8 Trạm</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{totalCheckinLogs}</div>
          <p className="text-[11px] text-slate-500 font-medium">Ghi nhận qua thẻ NFC & mã QR</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Đạt Chuẩn Quà (5+ Trạm)</span>
            <Gift className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">{totalCompleted5Plus}</div>
          <p className="text-[11px] text-slate-500 font-medium">
            {totalRegistered > 0 ? Math.round((totalCompleted5Plus / totalRegistered) * 100) : 0}% tổng số sinh viên
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Hoàn Thành 8/8 Trạm</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-600">{totalCompletedAll}</div>
          <p className="text-[11px] text-slate-500 font-medium">Đủ điều kiện nhận Quà Đặc Biệt</p>
        </div>
      </div>

      {/* Station Leaderboard & Traffic Distribution */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Tiến Độ Tham Gia Tại 8 Trạm Sự Kiện SGU’s Day 2025</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thống kê lượng sinh viên đã check-in tại từng trạm theo thời gian thực
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stationStats.map((st) => (
            <div key={st.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base shrink-0">{st.stampBadge}</span>
                  <div className="truncate">
                    <span className="font-bold text-slate-800 block truncate">{st.name}</span>
                    <span className="text-[11px] text-slate-400">{st.location}</span>
                  </div>
                </div>
                <div className="font-mono font-bold text-slate-700 shrink-0 ml-2">
                  {st.count} SV <span className="text-slate-400 font-normal">({st.percentage}%)</span>
                </div>
              </div>

              {/* Progress visual bar */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(st.percentage, 5)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prize Redemption & Recognition Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-500" />
              <span>Danh Sách Tân Sinh Viên Đủ Điều Kiện Nhận Quà & Trao Thưởng</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tổng cộng: <strong className="text-blue-600 font-bold">{eligibleStudents.length}</strong> bạn sinh viên đủ điều kiện (từ 5 con dấu trở lên)
            </p>
          </div>

          <button
            onClick={exportLuckyDrawList}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Danh Sách Nhận Quà (CSV)</span>
          </button>
        </div>

        {/* Search */}
        <div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Tìm theo Mã cá nhân, Tên hoặc MSSV..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-2">#</th>
                <th className="py-2.5 px-2">Mã Cá Nhân</th>
                <th className="py-2.5 px-2">MSSV</th>
                <th className="py-2.5 px-2">Họ và Tên</th>
                <th className="py-2.5 px-2">Khoa</th>
                <th className="py-2.5 px-2">Tiến độ Trạm</th>
                <th className="py-2.5 px-2 text-right">Trạng Thái Đổi Quà</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEligible.map((stu, index) => (
                <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-2 font-mono text-slate-400">{index + 1}</td>
                  <td className="py-3 px-2 font-mono font-bold text-indigo-600 bg-indigo-50/50 px-2 py-1 rounded">
                    {stu.luckyDrawCode || 'SGU-2025'}
                  </td>
                  <td className="py-3 px-2 font-mono font-bold text-slate-800">{stu.mssv}</td>
                  <td className="py-3 px-2 font-semibold text-slate-900">{stu.fullName}</td>
                  <td className="py-3 px-2 text-slate-600">{stu.faculty}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                      stu.completedStations.length === totalStations
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {stu.completedStations.length}/{totalStations} trạm
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    {stu.rewardClaimed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Đã trao quà
                      </span>
                    ) : (
                      <button
                        onClick={() => onClaimReward(stu.id)}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] rounded-lg shadow-2xs transition-all"
                      >
                        Xác nhận đã trao
                      </button>
                    )}
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
