import pandas as pd
import json

file_path = r"C:\Users\phuon\Downloads\NgayHoiTanSinhvien_SGU-sDay_2026-main (1)\NgayHoiTanSinhvien_SGU-sDay_2026-main\[SGU's DAY 2026] ĐĂNG KÝ THAM GIA TỌA ĐÀM PHÒNG CHỐNG MA TÚY (Câu trả lời).xlsx"
df = pd.read_excel(file_path, dtype=str) # Read as string to avoid float conversion

mssv_col = None
for col in df.columns:
    if 'mssv' in str(col).lower() or 'mã số sinh viên' in str(col).lower():
        mssv_col = col
        break

if not mssv_col:
    mssv_col = df.columns[3]

mssvs = df[mssv_col].dropna().astype(str).str.strip().str.replace(r'\.0$', '', regex=True).tolist()

with open("priority_drug_prevention.json", "w") as f:
    json.dump(mssvs, f)

print(f"Extracted {len(mssvs)} MSSVs.")
print("'3124580011' in list:", '3124580011' in mssvs)
