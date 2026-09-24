import pandas as pd
file_path = r"C:\Users\phuon\Downloads\NgayHoiTanSinhvien_SGU-sDay_2026-main (1)\NgayHoiTanSinhvien_SGU-sDay_2026-main\[SGU's DAY 2026] ĐĂNG KÝ THAM GIA TỌA ĐÀM PHÒNG CHỐNG MA TÚY (Câu trả lời).xlsx"
df = pd.read_excel(file_path)
for col in df.columns:
    for val in df[col]:
        if '3124580011' in str(val):
            print(f"Found in column '{col}': {repr(val)}")
