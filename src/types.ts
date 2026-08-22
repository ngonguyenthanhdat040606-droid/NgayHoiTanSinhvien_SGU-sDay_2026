export interface Station {
  id: string;
  stationNumber: number;
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
  nfcTagId: string; // e.g. "B1:8D:92:6D" or custom identifier
  stampBadge: string;
  rewardPoints: number;
  estimatedMinutes: number;
  requirements: string;
  highlightGift: string;
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
  registeredAt: string;
  completedStations: string[]; // array of station IDs
  checkinHistory: StationCheckin[];
  isEligibleForReward: boolean;
  rewardClaimed: boolean;
  luckyDrawCode?: string;
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
  time: string;
  endTime: string;
  title: string;
  location: string;
  category: 'main_stage' | 'station_activity' | 'talkshow' | 'gala' | 'gift_exchange';
  description: string;
  speakers?: string[];
  isHighlight?: boolean;
}

export interface NFCCardConfig {
  stationId: string;
  stationName: string;
  cardUid: string;
  targetUrl: string;
  payloadText: string;
}
