import json, sys, os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

kit = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "brand-kit")
brand = json.load(open(os.path.join(kit, "data/brand.json")))
name, slug = brand["name"], brand["slug"]
rows = json.load(open(os.path.join(kit, "data/menu.json")))

wb = Workbook()
a = wb.active
a.title = "Assumptions"
DARK, GOLD, CREAM = "1B120D", "C9873A", "F4EBDD"
hfont = Font(bold=True, color=CREAM, name="Arial")
hfill = PatternFill("solid", fgColor=DARK)
inp = Font(color="0000FF", name="Arial")  # blue = editable input
a["A1"] = f"{name} — menu costing model (ESTIMATES — replace with supplier quotes)"
a["A1"].font = Font(bold=True, size=14, name="Arial")
a["A3"], a["B3"], a["C3"] = "Input", "Value", "Note"
for c in "ABC":
    a[f"{c}3"].font, a[f"{c}3"].fill = hfont, hfill
inputs = [
    ("Packaging cost per drink (USD)", 0.32, "Cup, lid, sleeve, straw — typical range 0.25–0.40"),
    ("Packaging cost per dessert/bakery item (USD)", 0.15, "Box/bag/napkin"),
    ("Specialty beans price per kg (USD)", 25, "Info only — costs in the Menu sheet were built from this"),
    ("Whole milk per litre (USD)", 1.30, "Info only"),
    ("Target ingredient margin", 0.75, "Planning target"),
]
for i, (k, v, n) in enumerate(inputs, start=4):
    a[f"A{i}"], a[f"B{i}"], a[f"C{i}"] = k, v, n
    a[f"B{i}"].font = inp
for r in (4, 5, 6, 7):
    a[f"B{r}"].number_format = '"$"#,##0.00'
a["B8"].number_format = "0%"
a["A10"] = "Blue cells are inputs. Costs exclude labour, rent and wastage. Every recipe is PROPOSED and untested."
a["A10"].font = Font(italic=True, name="Arial")
a.column_dimensions["A"].width = 46; a.column_dimensions["B"].width = 14; a.column_dimensions["C"].width = 70

m = wb.create_sheet("Menu & costing")
cols = ["Category", "Item", "Tier", "Size", "Serving temp.", "Est. ingredient cost", "Price", "Margin $", "Ingredient margin %", "Packaging", "Margin after packaging %", "Ingredients (proposed quantities)", "Preparation"]
for j, c in enumerate(cols, start=1):
    cell = m.cell(row=1, column=j, value=c)
    cell.font, cell.fill = hfont, hfill
    cell.alignment = Alignment(wrap_text=True, vertical="center")
for i, r in enumerate(rows, start=2):
    food = r["category"] in ("Desserts", "Bakery")
    vals = [r["category"], r["name"], r["tier"], r["size"], r["temperature"], r["cost"], r["price"],
            f"=G{i}-F{i}", f"=IF(G{i}=0,0,H{i}/G{i})",
            "=Assumptions!$B$5" if food else "=Assumptions!$B$4",
            f"=IF(G{i}=0,0,(G{i}-F{i}-J{i})/G{i})", r["ingredients"], r["method"]]
    for j, v in enumerate(vals, start=1):
        c = m.cell(row=i, column=j, value=v)
        c.font = Font(name="Arial", color="0000FF") if j in (6, 7) else Font(name="Arial")
        if j in (12, 13): c.alignment = Alignment(wrap_text=True, vertical="top")
        else: c.alignment = Alignment(vertical="top")
    for j in (6, 7, 8, 10): m.cell(row=i, column=j).number_format = '"$"#,##0.00'
    for j in (9, 11): m.cell(row=i, column=j).number_format = "0.0%"
last = len(rows) + 1
for j, w in enumerate([18, 32, 10, 22, 22, 12, 10, 10, 12, 11, 14, 70, 90], start=1):
    m.column_dimensions[get_column_letter(j)].width = w
m.row_dimensions[1].height = 34
m.freeze_panes = "C2"
m.auto_filter.ref = f"A1:M{last}"

s = wb.create_sheet("Summary")
s["A1"] = "Summary (all formulas)"; s["A1"].font = Font(bold=True, size=14, name="Arial")
rowsum = [
    ("Menu items", f"=COUNTA('Menu & costing'!B2:B{last})", "0"),
    ("Signature drinks", f"=COUNTIF('Menu & costing'!C2:C{last},\"signature\")", "0"),
    ("Average ingredient margin — signature", f"=AVERAGEIF('Menu & costing'!C2:C{last},\"signature\",'Menu & costing'!I2:I{last})", "0.0%"),
    ("Average ingredient margin — classic", f"=AVERAGEIF('Menu & costing'!C2:C{last},\"classic\",'Menu & costing'!I2:I{last})", "0.0%"),
    ("Average margin after packaging — all items", f"=AVERAGE('Menu & costing'!K2:K{last})", "0.0%"),
    ("Items below target ingredient margin", f"=COUNTIF('Menu & costing'!I2:I{last},\"<\"&Assumptions!B8)", "0"),
    ("Average price — signature", f"=AVERAGEIF('Menu & costing'!C2:C{last},\"signature\",'Menu & costing'!G2:G{last})", '"$"#,##0.00'),
    ("Average price — classic", f"=AVERAGEIF('Menu & costing'!C2:C{last},\"classic\",'Menu & costing'!G2:G{last})", '"$"#,##0.00'),
]
for i, (k, f, fmt) in enumerate(rowsum, start=3):
    s[f"A{i}"], s[f"B{i}"] = k, f
    s[f"B{i}"].number_format = fmt
    s[f"A{i}"].font = s[f"B{i}"].font = Font(name="Arial")
s.column_dimensions["A"].width = 50; s.column_dimensions["B"].width = 16
wb.move_sheet("Summary", offset=-2)
wb.active = 0
out = os.path.join(kit, f"{slug}-menu-costing.xlsx")
wb.save(out)
print("saved", out, "rows", len(rows))
