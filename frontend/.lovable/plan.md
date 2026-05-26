

## Plan: Add BAKTI Logo to Header and Match Reference Colors

### 1. Copy Logo Asset
- Copy `user-uploads://Bakti_logo.png` to `src/assets/Bakti_logo.png`
- Import it in `Header.tsx` as an ES6 module

### 2. Update Header Component (`src/components/Header.tsx`)
- Replace the text-based "BAKTI / KOMDIGI" block with the actual logo image (`<img>` tag, ~40px height)
- Keep the "Data Aset BAKTI" text and subtitle next to the logo, matching the reference layout: `[Logo] Portal BAKTI / Kementerian Komunikasi dan Digital`
- Adjust the header title from "Data Aset" to match the app context while using the reference style

### 3. Update Login Page Header
- The login page also uses `<Header />`, so the logo will automatically appear there too

### 4. Color Adjustments (`src/index.css`)
- The reference site uses a slightly different teal. Based on the screenshots, the primary hue is closer to `HSL(170, 65%, 36%)` (a deeper, more saturated teal). Will fine-tune the following CSS variables:
  - `--primary` — adjust to match the exact teal from the reference top bar and buttons
  - `--topbar-gradient` — match the gradient direction and color stops from the reference (darker teal)
  - `--hero-gradient` — adjust to match the reference banner gradient
  - `--accent` and `--ring` values to stay consistent

No structural changes to pages or routing needed. This is purely a visual/branding update.

