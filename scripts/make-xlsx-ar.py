import json, os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

kit = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "brand-kit-ar")
brand = json.load(open(os.path.join(kit, "data/brand.json")))
rows = json.load(open(os.path.join(kit, "data/menu-ar.json")))
name, slug = brand["name"], brand["slug"]

DARK, CREAM = "1B120D", "F4EBDD"
hfont, hfill = Font(bold=True, color=CREAM, name="Arial"), PatternFill("solid", fgColor=DARK)
inp = Font(color="0000FF", name="Arial")
wb = Workbook()
a = wb.active
a.title = "الافتراضات"
a.sheet_view.rightToLeft = True
a["A1"] = f"{name} — نموذج تكاليف المنيو (تقديرات: استبدلها بعروض الموردين)"
a["A1"].font = Font(bold=True, size=14, name="Arial")
for c, t in zip("ABC", ["المُدخل", "القيمة", "ملاحظة"]):
    a[f"{c}3"] = t; a[f"{c}3"].font, a[f"{c}3"].fill = hfont, hfill
for i, (k, v, n) in enumerate([
    ("تكلفة التغليف لكل مشروب (دولار)", 0.32, "كوب وغطاء وغلاف وشفاطة؛ النطاق المعتاد 0.25–0.40"),
    ("تكلفة التغليف لكل حلوى/مخبوزات (دولار)", 0.15, "علبة/كيس ومنديل"),
    ("سعر كيلو البن المختص (دولار)", 25, "للمعلومة فقط: التكاليف في ورقة المنيو بُنيت عليه"),
    ("سعر لتر الحليب الكامل (دولار)", 1.30, "للمعلومة فقط"),
    ("هامش المكونات المستهدف", 0.75, "هدف تخطيطي"),
], start=4):
    a[f"A{i}"], a[f"B{i}"], a[f"C{i}"] = k, v, n
    a[f"B{i}"].font = inp
for r in (4, 5, 6, 7): a[f"B{r}"].number_format = '"$"#,##0.00'
a["B8"].number_format = "0%"
a["A10"] = "الخلايا الزرقاء مُدخلات. التكاليف لا تشمل العمالة والإيجار والهدر. كل الوصفات مقترحة ولم تُجرَّب."
a["A10"].font = Font(italic=True, name="Arial")
a.column_dimensions["A"].width = 46; a.column_dimensions["B"].width = 14; a.column_dimensions["C"].width = 70

m = wb.create_sheet("المنيو والتكاليف")
m.sheet_view.rightToLeft = True
cols = ["الفئة", "الصنف", "النوع", "الحجم", "الحرارة", "تكلفة المكونات التقديرية", "السعر", "الهامش بالدولار", "هامش المكونات %", "التغليف", "الهامش بعد التغليف %", "المكونات (كميات مقترحة)", "طريقة التحضير"]
for j, c in enumerate(cols, start=1):
    cell = m.cell(row=1, column=j, value=c)
    cell.font, cell.fill = hfont, hfill
    cell.alignment = Alignment(wrap_text=True, vertical="center", horizontal="right")
for i, r in enumerate(rows, start=2):
    food = r["category"] in ("الحلويات", "المخبوزات")
    vals = [r["category"], r["name"], r["tier"], r["size"], r["temperature"], r["cost"], r["price"],
            f"=G{i}-F{i}", f"=IF(G{i}=0,0,H{i}/G{i})", "=الافتراضات!$B$5" if food else "=الافتراضات!$B$4",
            f"=IF(G{i}=0,0,(G{i}-F{i}-J{i})/G{i})", r["ingredients"], r["method"]]
    for j, v in enumerate(vals, start=1):
        c = m.cell(row=i, column=j, value=v)
        c.font = Font(name="Arial", color="0000FF") if j in (6, 7) else Font(name="Arial")
        c.alignment = Alignment(wrap_text=j in (12, 13), vertical="top", horizontal="right")
    for j in (6, 7, 8, 10): m.cell(row=i, column=j).number_format = '"$"#,##0.00'
    for j in (9, 11): m.cell(row=i, column=j).number_format = "0.0%"
last = len(rows) + 1
for j, w in enumerate([18, 32, 10, 24, 22, 14, 10, 12, 14, 11, 16, 70, 90], start=1): m.column_dimensions[get_column_letter(j)].width = w
m.row_dimensions[1].height = 36
m.freeze_panes = "C2"
m.auto_filter.ref = f"A1:M{last}"

s = wb.create_sheet("الملخص")
s.sheet_view.rightToLeft = True
s["A1"] = "الملخص (كله معادلات)"; s["A1"].font = Font(bold=True, size=14, name="Arial")
M = "'المنيو والتكاليف'"
for i, (k, f, fmt) in enumerate([
    ("عدد الأصناف", f"=COUNTA({M}!B2:B{last})", "0"),
    ("المشروبات المميزة", f"=COUNTIF({M}!C2:C{last},\"مميز\")", "0"),
    ("متوسط هامش المكونات — المميز", f"=AVERAGEIF({M}!C2:C{last},\"مميز\",{M}!I2:I{last})", "0.0%"),
    ("متوسط هامش المكونات — الكلاسيكي", f"=AVERAGEIF({M}!C2:C{last},\"كلاسيكي\",{M}!I2:I{last})", "0.0%"),
    ("متوسط الهامش بعد التغليف — كل الأصناف", f"=AVERAGE({M}!K2:K{last})", "0.0%"),
    ("أصناف أقل من هامش المكونات المستهدف", f"=COUNTIF({M}!I2:I{last},\"<\"&الافتراضات!B8)", "0"),
    ("متوسط السعر — المميز", f"=AVERAGEIF({M}!C2:C{last},\"مميز\",{M}!G2:G{last})", '"$"#,##0.00'),
    ("متوسط السعر — الكلاسيكي", f"=AVERAGEIF({M}!C2:C{last},\"كلاسيكي\",{M}!G2:G{last})", '"$"#,##0.00'),
], start=3):
    s[f"A{i}"], s[f"B{i}"] = k, f
    s[f"B{i}"].number_format = fmt
    s[f"A{i}"].font = s[f"B{i}"].font = Font(name="Arial")
s.column_dimensions["A"].width = 50; s.column_dimensions["B"].width = 16

# ---------------- recipe validation log (3 trials per recipe, panel-average scores 1–5)
from openpyxl.worksheet.datavalidation import DataValidation
t = wb.create_sheet("سجل الاختبار")
t.sheet_view.rightToLeft = True
tcols = ["الصنف", "رقم التجربة", "التاريخ", "الباريستا", "العطر (1–5)", "التوازن (1–5)", "الحلاوة (1–5)", "القوام (1–5)", "المظهر (1–5)", "متوسط التقييم", "النتيجة", "زمن التحضير (دقيقة)", "التكلفة الفعلية (دولار)", "ملاحظات وتعديلات"]
for j, c in enumerate(tcols, start=1):
    cell = t.cell(row=1, column=j, value=c)
    cell.font, cell.fill = hfont, hfill
    cell.alignment = Alignment(wrap_text=True, vertical="center", horizontal="right")
r0 = 2
for r in rows:
    for k in (1, 2, 3):
        i = r0
        vals = [r["name"], k, None, None, None, None, None, None, None,
                f'=IF(COUNT(E{i}:I{i})=5,AVERAGE(E{i}:I{i}),"")',
                f'=IF(J{i}="","",IF(AND(J{i}>=4,MIN(E{i}:I{i})>=3,OR(L{i}="",L{i}<=4)),"ناجحة","تحتاج تعديلاً"))',
                None, None, None]
        for j, v in enumerate(vals, start=1):
            c = t.cell(row=i, column=j, value=v)
            c.font = Font(name="Arial", color="0000FF") if j in (3, 4, 5, 6, 7, 8, 9, 12, 13, 14) else Font(name="Arial")
            c.alignment = Alignment(vertical="top", horizontal="right", wrap_text=(j == 14))
        t.cell(row=i, column=10).number_format = "0.00"
        t.cell(row=i, column=13).number_format = '"$"#,##0.00'
        t.cell(row=i, column=3).number_format = "yyyy-mm-dd"
        r0 += 1
tlast = r0 - 1
dv = DataValidation(type="decimal", operator="between", formula1="1", formula2="5", allow_blank=True, showErrorMessage=True, error="أدخل رقماً من 1 إلى 5")
t.add_data_validation(dv); dv.add(f"E2:I{tlast}")
for j, w in enumerate([32, 11, 13, 14, 11, 11, 11, 11, 11, 13, 14, 14, 16, 50], start=1): t.column_dimensions[get_column_letter(j)].width = w
t.row_dimensions[1].height = 36; t.freeze_panes = "C2"; t.auto_filter.ref = f"A1:N{tlast}"

st = wb.create_sheet("حالة الاعتماد")
st.sheet_view.rightToLeft = True
for j, c in enumerate(["الصنف", "عدد التجارب المكتملة", "التجارب الناجحة", "متوسط التقييم", "الحالة"], start=1):
    cell = st.cell(row=1, column=j, value=c); cell.font, cell.fill = hfont, hfill
    cell.alignment = Alignment(horizontal="right", vertical="center", wrap_text=True)
L = "'سجل الاختبار'"
for i, r in enumerate(rows, start=2):
    st.cell(row=i, column=1, value=r["name"]).font = Font(name="Arial")
    st.cell(row=i, column=2, value=f"=COUNTIFS({L}!$A$2:$A${tlast},A{i},{L}!$J$2:$J${tlast},\">0\")")
    st.cell(row=i, column=3, value=f"=COUNTIFS({L}!$A$2:$A${tlast},A{i},{L}!$K$2:$K${tlast},\"ناجحة\")")
    st.cell(row=i, column=4, value=f"=IFERROR(AVERAGEIFS({L}!$J$2:$J${tlast},{L}!$A$2:$A${tlast},A{i}),\"\")")
    st.cell(row=i, column=5, value=f'=IF(B{i}=0,"لم يبدأ",IF(AND(B{i}>=3,C{i}>=3),"جاهزة للاعتماد","قيد الاختبار"))')
    st.cell(row=i, column=4).number_format = "0.00"
    for j in range(2, 6): st.cell(row=i, column=j).alignment = Alignment(horizontal="right")
n = len(rows) + 1
st.cell(row=n + 2, column=1, value="إجمالي الجاهزة للاعتماد").font = Font(bold=True, name="Arial")
st.cell(row=n + 2, column=2, value=f'=COUNTIF(E2:E{n},"جاهزة للاعتماد")')
st.cell(row=n + 3, column=1, value="قيد الاختبار").font = Font(bold=True, name="Arial")
st.cell(row=n + 3, column=2, value=f'=COUNTIF(E2:E{n},"قيد الاختبار")')
st.cell(row=n + 4, column=1, value="لم يبدأ").font = Font(bold=True, name="Arial")
st.cell(row=n + 4, column=2, value=f'=COUNTIF(E2:E{n},"لم يبدأ")')
st.cell(row=n + 6, column=1, value="المعيار: 3 تجارب مكتملة على الأقل، كلها ناجحة (متوسط ≥ 4.0، ولا معيار أقل من 3، وزمن التحضير ≤ 4 دقائق). ثم اعتمد الوصفة في لوحة الإدارة.").font = Font(italic=True, name="Arial")
st.column_dimensions["A"].width = 36
for c in "BCDE": st.column_dimensions[c].width = 20
st.freeze_panes = "B2"

wb.move_sheet("الملخص", offset=-4)
wb.active = 0
out = os.path.join(kit, f"{slug}-menu-costing-ar.xlsx")
wb.save(out)
print("saved", out, len(rows), "rows")
