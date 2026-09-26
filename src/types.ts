export interface Station {
  id: string;
  stationNumber: number;
  activityNumber?: number; // Số thứ tự hoạt động trong Kế hoạch (3, 6, 8, 9, 10, 12, 13, 17)
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  location: string;
  zone: 'A' | 'B' | 'C' | 'D';
  icon: string;
  color: string;
  managerName: string;
  managerPhone: string;
  assignedUnit?: string; // Đơn vị phân công thực hiện (LCH SV khoa, CLB)
  nfcTagId: string; // e.g. "B1:8D:92:6D"
  stampBadge: string;
  estimatedMinutes: number;
  requirements: string;
}

export interface Student {
  id: string;
  mssv: string;
  fullName: string;
  faculty: string;
  major: string;
  studentClass: string;
  email: string;
  phone: string;
  avatarSeed?: string;
  pinCode?: string; // Mã PIN 4 số bảo vệ thẻ e-Pass
  registeredAt: string;
  completedStations: string[]; // array of station IDs
  completedBooths?: string[]; // array of booth IDs for Trạm 11
  checkinHistory: StationCheckin[];
}

export type OrganizerRole = 'admin' | 'station_manager';

export interface OrganizerSession {
  authenticated: boolean;
  role: OrganizerRole;
  stationId?: string;
  managerName?: string;
  expiresAt?: number;
}

export interface StationCheckin {
  stationId: string;
  stationName: string;
  timestamp: string;
  method: 'nfc_tap' | 'qr_scan' | 'manual_mssv' | 'manager_scan';
  recordedBy?: string;
}

export interface TimelineEvent {
  id: string;
  activityNumber?: number; // Số thứ tự hoạt động (1 - 18)
  time: string;
  endTime: string;
  title: string;
  location: string;
  category: 'ceremony' | 'main_stage' | 'station_activity' | 'talkshow' | 'exhibition' | 'market_food' | 'sports_game' | 'gala';
  description: string;
  inCharge?: string; // Cán bộ / Đ/c Phụ trách
  assignedUnit?: string; // Phân công thực hiện (LCH Khoa, CLB Đội Nhóm)
  speakers?: string[];
  isHighlight?: boolean;
  isCheckinStation?: boolean; // Có tính điểm danh trạm hay không
  stationId?: string; // ID trạm tương ứng nếu là trạm điểm danh
}

export interface NFCCardConfig {
  stationId: string;
  stationName: string;
  cardUid: string;
  targetUrl: string;
  payloadText: string;
}
