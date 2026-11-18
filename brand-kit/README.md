# Brand & Franchise Starter Kit

The deliverable to hand to a prospective partner / franchisee.

| File / folder | What it is |
|---|---|
| `<name>-brand-franchise-kit.pdf` | **The main document** (59 pages, 16:9): concept, logo system, colours, type, cup programme (sizes + specs), packaging, uniform, signage, store design, floor plans, equipment list, full menu, **every recipe** (14 signature + 27 classic), operations manual, QC, training, supply, marketing, franchise package, start-up budget, unit-economics scenarios, process, legal checklist |
| `<name>-menu-costing.xlsx` | Editable costing model: change any cost/price and margins recalculate (blue cells are inputs) |
| `assets/` | All artwork as **SVG** (vector): `logo/`, `mockups/` (cups, bags, box, napkin, uniform, menu, cards, signage, label), `drinks/`, `cafe/` (6 store views), `icons/`, `kit/` (cup sizes, floor plans) |
| `assets-png/` | The same artwork as PNG |
| `data/` | `menu.json` (machine-readable recipes) |

## Rename the brand (everything regenerates)
```bash
BRAND_NAME="Your Name" BRAND_DESCRIPTOR="Your Descriptor" BRAND_SLOGAN="Your slogan" npm run kit
```
Logos, cups, bags, uniform, signage, menu and the PDF are all rebuilt with the new name (the "O" becomes the sun; the monogram uses your initial). The narrative copy about the "golden hour" concept lives in `scripts/build-kit.mjs` and `src/data/brand.ts` and should be edited to match the new name's story.

## Honest status
Concept stage. Recipes are **proposed and untested**; costs, prices, budgets and profit scenarios are **estimates**; cup dimensions are typical industry values; floor plans are schematic; the name is **not trademark-cleared**; no franchise is offered or legally drafted. See page 4 of the PDF.
