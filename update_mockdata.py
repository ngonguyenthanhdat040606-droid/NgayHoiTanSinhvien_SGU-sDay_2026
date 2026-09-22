import re

mock_data_path = 'src/data/mockData.ts'

with open(mock_data_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_timeline_events = '''export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'act-1', activityNumber: 1, time: '10:00', endTime: '10:30',
    title: 'Lễ kết nạp Hội viên Khóa 2026, tiếp lửa & Khai mạc', location: 'Sân khấu chính khu KLF',
    category: 'ceremony', description: 'Nghi thức tiếp lửa truyền thống và khai mạc Ngày hội Tân Sinh viên năm 2026.',
    inCharge: 'Đ/c Huỳnh Ngọc Bảo Khang', assignedUnit: 'LCH SV khoa Luật',
    isHighlight: true, isCheckinStation: false
  },
  {
    id: 'act-2', activityNumber: 2, time: '10:30', endTime: '16:00',
    title: 'Khu vực “Check - in” Ngày hội', location: 'Sảnh Hội trường A',
    category: 'station_activity', description: 'Check-in, đăng tải và thực hiện các thử thách tương tác trên mạng xã hội.',
    inCharge: 'Đ/c Nguyễn Mai Thảo', assignedUnit: 'LCH SV khoa Giáo dục Chính trị',
    isHighlight: false, isCheckinStation: false
  },
  {
    id: 'act-3', activityNumber: 3, time: '08:30', endTime: '11:00',
    title: 'Triển lãm về các LCH và CLB-Đội-Nhóm', location: 'Sân KLF',
    category: 'exhibition', description: 'Triển lãm các hoạt động tiêu biểu và tương tác sinh viên.',
    inCharge: 'Đ/c Phạm Thị Ngọc Phụng', assignedUnit: 'Các LCH, CLB-Đ-N',
    isHighlight: false, isCheckinStation: false
  },
  {
    id: 'act-4', activityNumber: 4, time: '09:30', endTime: '14:30',
    title: 'Phiên chợ sinh viên & dịch vụ hỗ trợ', location: 'Sân khu A',
    category: 'market_food', description: 'Gian hàng giao lưu, trưng bày và trao đổi sản phẩm hỗ trợ học tập.',
    inCharge: 'Đ/c Khiếu Thị Thùy Dương', assignedUnit: 'LCH SV khoa GD Mầm non',
    isHighlight: false, isCheckinStation: false
  },
  {
    id: 'act-5', activityNumber: 5, time: '10:30', endTime: '12:00',
    title: 'Workshop “Green Vibes SGU – Xanh cùng SGU!”', location: 'Sảnh Hội trường A',
    category: 'station_activity', description: 'Gian hàng trưng bày sản phẩm tái chế và hoạt động trang trí “sống xanh”.',
    inCharge: 'Đ/c Trần Ngọc Minh Thư', assignedUnit: 'LCH SV khoa KT & Công nghệ',
    isHighlight: true, isCheckinStation: true, stationId: 'station-1'
  },
  {
    id: 'act-6', activityNumber: 6, time: '11:00', endTime: '13:30',
    title: 'Khu vực liên hoan ẩm thực', location: 'Sân khu A',
    category: 'market_food', description: 'Gian hàng ẩm thực bày bán món ăn, đồ uống đặc sắc.',
    inCharge: 'Đ/c Trần Thị Bích Vân', assignedUnit: 'LCH SV khoa Tài chính – Kế toán',
    isHighlight: false, isCheckinStation: false
  },
  {
    id: 'act-7', activityNumber: 7, time: '10:30', endTime: '12:00',
    title: 'Sân chơi “Thanh niên khỏe”', location: 'Sân khu nghệ thuật',
    category: 'station_activity', description: 'Sát hạch thể lực và cấp giấy chứng nhận Thanh niên khỏe.',
    inCharge: 'Đ/c Mai Ngọc Anh', assignedUnit: 'LCH SV khoa Toán - Ứng dụng',
    isHighlight: true, isCheckinStation: true, stationId: 'station-9'
  },
  {
    id: 'act-8', activityNumber: 8, time: '10:30', endTime: '12:00',
    title: 'Sân chơi “Kì thủ SGU tranh tài”', location: 'Cơ sở chính trường',
    category: 'station_activity', description: 'Giải thi đấu đối kháng và giao lưu nhóm cờ vua, cờ tướng, cờ vây.',
    inCharge: 'Đ/c Lê Đỗ Anh Khoa', assignedUnit: 'CLB Cờ trường',
    isHighlight: true, isCheckinStation: true, stationId: 'station-2'
  },
  {
    id: 'act-9', activityNumber: 9, time: '13:30', endTime: '15:00',
    title: 'Khu vực “SGUers’ Cultural Nexus”', location: 'Sân Khu nghệ thuật',
    category: 'station_activity', description: 'Không gian giao lưu và trải nghiệm văn hóa, lan tỏa bản sắc Việt Nam.',
    inCharge: 'Đ/c Trần Trung Trí', assignedUnit: 'LCH SV khoa Văn hoá và Du lịch',
    isHighlight: true, isCheckinStation: true, stationId: 'station-3'
  },
  {
    id: 'act-10', activityNumber: 10, time: '12:00', endTime: '13:30',
    title: 'Vươn mình trong kỷ nguyên AI: Xây dựng \"người bạn số\"', location: 'Sảnh Hội trường A',
    category: 'station_activity', description: 'Hướng dẫn kỹ năng cá nhân hóa AI và nâng cao hiệu suất học tập.',
    inCharge: 'Đ/c Ngô Huỳnh Anh Phú', assignedUnit: 'LCH SV khoa CNTT',
    isHighlight: true, isCheckinStation: true, stationId: 'station-4'
  },
  {
    id: 'act-11', activityNumber: 11, time: '11:00', endTime: '12:30',
    title: 'Sân chơi Âm nhạc Acoustic', location: 'Sân khấu chính',
    category: 'main_stage', description: 'Giao lưu và trình diễn tự do các bài hát Acoustic.',
    inCharge: 'Đ/c Tạ Yến Chi', assignedUnit: 'LCH SV khoa KH XH&NV',
    isHighlight: false, isCheckinStation: false
  },
  {
    id: 'act-12', activityNumber: 12, time: '10:00', endTime: '11:30',
    title: 'Toạ đàm “Sinh viên 5 tốt”', location: 'Hội trường E',
    category: 'station_activity', description: 'Trao đổi về danh hiệu SV5T và trang bị kiến thức, kỹ năng.',
    inCharge: 'Đ/c Trần Trung Trí', assignedUnit: 'LCH SV khoa Quản trị Kinh doanh',
    isHighlight: true, isCheckinStation: true, stationId: 'station-5'
  },
  {
    id: 'act-13', activityNumber: 13, time: '13:30', endTime: '15:00',
    title: 'Sân chơi Ngoại ngữ “The Language Hub”', location: 'Sảnh Hội trường A',
    category: 'station_activity', description: 'Rèn luyện vốn từ vựng và kỹ năng giao tiếp tiếng Anh cơ bản.',
    inCharge: 'Đ/c Đặng Vỹ Khang', assignedUnit: 'LCH SV khoa Ngoại ngữ',
    isHighlight: true, isCheckinStation: true, stationId: 'station-6'
  },
  {
    id: 'act-14', activityNumber: 14, time: '13:00', endTime: '19:00',
    title: 'Cuộc thi “SGU Flashmob dance 2026”', location: 'Sân khấu chính khu KLF',
    category: 'main_stage', description: 'Thi nhảy Flashmob chủ đề quê hương đất nước tuổi trẻ.',
    inCharge: 'Đ/c Trần Thanh Tâm', assignedUnit: 'LCH SV khoa Giáo dục Tiểu học',
    isHighlight: true, isCheckinStation: false
  },
  {
    id: 'act-15', activityNumber: 15, time: '15:30', endTime: '16:30',
    title: 'Sân chơi giao lưu “Random Dance”', location: 'Sân khấu chính khu KLF',
    category: 'main_stage', description: 'Giao lưu và biểu diễn Random Dance.',
    inCharge: 'Đ/c Tạ Yến Chi', assignedUnit: 'CLB SGU Dance Club',
    isHighlight: false, isCheckinStation: false
  },
  {
    id: 'act-16', activityNumber: 16, time: '13:30', endTime: '15:30',
    title: 'Tọa đàm kiến thức pháp luật và kỹ năng an toàn số', location: 'Hội trường A',
    category: 'station_activity', description: 'Phổ biến pháp luật, phòng ngừa lừa đảo mạng.',
    inCharge: 'Đ/c Tạ Yến Chi', assignedUnit: 'LCH SV khoa KH XH&NV',
    isHighlight: true, isCheckinStation: true, stationId: 'station-7'
  },
  {
    id: 'act-17', activityNumber: 17, time: '13:30', endTime: '15:30',
    title: 'Tọa đàm “Decode Stress - Gỡ rối nút thắt”', location: 'Hội trường lầu 7 khu E',
    category: 'station_activity', description: 'Trang bị kiến thức chăm sóc sức khỏe tâm thần sinh viên.',
    inCharge: 'Đ/c Huỳnh Ngọc Bảo Khang', assignedUnit: 'LCH SV khoa Giáo dục',
    isHighlight: true, isCheckinStation: true, stationId: 'station-8'
  },
  {
    id: 'act-18', activityNumber: 18, time: '17:00', endTime: '21:00',
    title: 'Biểu diễn nghệ thuật “Nữ sĩ Hồ Xuân Hương”', location: 'Hội trường A (25/9)',
    category: 'ceremony', description: 'Chương trình nghệ thuật giáo dục truyền thống yêu nước.',
    inCharge: 'BTC', assignedUnit: 'BTC',
    isHighlight: false, isCheckinStation: false
  },
  {
    id: 'act-19', activityNumber: 19, time: '09:30', endTime: '14:30',
    title: 'Khu vực “Heritage Ho Chi Minh City 2026”', location: 'Sảnh Hội trường A',
    category: 'exhibition', description: 'Quảng bá hệ thống di sản văn hóa Thành phố.',
    inCharge: 'BTC', assignedUnit: 'Hội Di sản Văn hóa TP',
    isHighlight: false, isCheckinStation: false
  },
  {
    id: 'act-20', activityNumber: 20, time: '17:30', endTime: '21:00',
    title: 'Tọa đàm “Giảng đường không áp lực”', location: 'Hội trường A (02/10)',
    category: 'ceremony', description: 'Học hiệu quả bằng tư duy khoa học.',
    inCharge: 'A. Dương Anh Vũ', assignedUnit: 'BTC',
    isHighlight: false, isCheckinStation: false
  },
  {
    id: 'act-21', activityNumber: 21, time: '10:00', endTime: '12:00',
    title: 'Toạ đàm "Thức tỉnh GenZ"', location: 'Hội trường lầu 7 khu E',
    category: 'ceremony', description: 'Phòng, chống ma tuý và các chất gây nghiện.',
    inCharge: 'Đ/c Đặng Vỹ Khang', assignedUnit: 'LCH SV khoa Ngoại ngữ',
    isHighlight: false, isCheckinStation: false
  },
  {
    id: 'act-22', activityNumber: 22, time: '17:30', endTime: '21:00',
    title: 'Lễ tổng kết “Ngày hội Tân Sinh viên năm 2026”', location: 'Sân khấu chính',
    category: 'gala', description: 'Tổng kết ngày hội và Vòng Chung kết Flashmob dance.',
    inCharge: 'Đ/c Nguyễn Ngọc Thanh Thảo', assignedUnit: 'LCH SV khoa Giáo dục Tiểu học',
    isHighlight: true, isCheckinStation: false
  }
];'''

content = re.sub(
    r'export const TIMELINE_EVENTS: TimelineEvent\[\] = \[.*?\n\];',
    new_timeline_events,
    content,
    flags=re.DOTALL
)

import sys
with open(mock_data_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated timeline events successfully.")
