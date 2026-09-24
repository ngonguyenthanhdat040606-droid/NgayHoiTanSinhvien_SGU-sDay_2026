import pandas as pd
import json

file_path = r"C:\Users\phuon\Downloads\NgayHoiTanSinhvien_SGU-sDay_2026-main (1)\NgayHoiTanSinhvien_SGU-sDay_2026-main\[SGU's DAY 2026] ĐĂNG KÝ THAM GIA TỌA ĐÀM PHÒNG CHỐNG MA TÚY (Câu trả lời).xlsx"
df = pd.read_excel(file_path)

# Print columns to see which one is MSSV
print("Columns:", df.columns.tolist())

# Assuming the 3rd or 4th column is MSSV, but let's find the one that contains 'MSSV' or 'Mã số'
mssv_col = None
for col in df.columns:
    if 'mssv' in str(col).lower() or 'mã số sinh viên' in str(col).lower():
        mssv_col = col
        break

if not mssv_col:
    # fallback to column index 3 if we can't find it by name
    mssv_col = df.columns[3]

mssvs = df[mssv_col].dropna().astype(str).str.strip().tolist()

# Write to a JSON file
with open("priority_drug_prevention.json", "w") as f:
    json.dump(mssvs, f)

print(f"Extracted {len(mssvs)} MSSVs.")
print(mssvs[:5])
