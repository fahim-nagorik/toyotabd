# Toyota Bangladesh — Website Demo Build Plan

> Paste this file into your repo root as `PLAN.md` and point Claude Code at it.

---

## 0. Project Constraints (read first)

- **2 pages only**: `/` (Home) and `/service` (Service & Commerce).
- **Demo, not production**: no real backend, no real payments. All data local JSON, all forms fake-submit with a success state.
- **Logo only, no tagline.** Do **not** render "Move your world" anywhere. Toyota Malaysia uses it; we don't.
- **Light theme.** Reference feel: bmw.com.bd + apple.com. White dominant, generous whitespace, thin type, large imagery.
- Brand assets are already in the project folder — use the provided Toyota logo files, don't recreate the mark.

### Brand tokens (from Toyota Masterbrand QRG)
```
--toyota-red:    #EB0A1E
--black:         #101010
--dark-grey:     #3A3A3A
--mid-grey:      #808080
--grey:          #CCCCCC
--light-grey:    #EEEEEE
--off-white:     #F5F5F5   /* web only */
--white:         #FFFFFF
```
Type: Toyota Type → fallback stack `"Toyota Type", "Helvetica Neue", Arial, "Noto Sans", sans-serif`.
Logo usage: **Product Logo** (symbol + wordmark) in the header since "Toyota" won't appear in headlines. Black on white, White variant on dark hero overlays.

---

## 1. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | 2 routes, image optimization, fast |
| Styling | Tailwind CSS v4 | tokens as CSS vars, fast iteration |
| Animation | Framer Motion | scroll reveals, page transitions |
| Scroll | Lenis | the "butter-smooth" requirement |
| 360° viewer | Custom canvas sprite-sequence component | see §4 |
| Icons | Lucide | |
| State | React state + localStorage for cart | no backend |

Install:
```bash
npx create-next-app@latest toyota-bd --ts --tailwind --app --eslint
cd toyota-bd
npm i framer-motion lenis lucide-react clsx
```

---

## 2. File Structure

```
app/
  layout.tsx              # fonts, Lenis provider, Header, Footer
  page.tsx                # Home
  service/page.tsx        # Service & Commerce
  globals.css             # tokens + base
components/
  layout/Header.tsx       # sticky, transparent→white on scroll
  layout/Footer.tsx
  home/Hero.tsx
  home/VehicleGrid.tsx
  home/Rav4Showcase.tsx   # 360 section wrapper
  home/Technology.tsx
  home/Safety.tsx
  home/Offers.tsx
  home/DealerLocator.tsx
  home/TestDrive.tsx
  service/PartsShop.tsx
  service/CartDrawer.tsx
  service/BookService.tsx
  ui/Viewer360.tsx        # the core interactive piece
  ui/Reveal.tsx           # scroll-in wrapper
  ui/Button.tsx  Section.tsx  Modal.tsx
lib/
  vehicles.ts  parts.ts  dealers.ts  serviceTypes.ts
public/
  brand/                  # logos from project folder
  vehicles/               # model hero shots
  rav4-360/               # 36 frames: 001.webp … 036.webp
```

---

## 3. Page 1 — Home (section by section)

**3.1 Header** — Product Logo left, nav center (Vehicles · Technology · Safety · Offers · Dealers · Service), "Book a Test Drive" pill right. Transparent over hero, blurs to `rgba(255,255,255,.8)` + hairline border after 80px scroll. Mobile: full-screen slide-in menu.

**3.2 Hero** — Full-viewport, single large vehicle image (RAV4), white background, headline ~clamp(40px, 6vw, 84px) at weight 300, one line of subcopy, two CTAs (filled red / ghost). Subtle parallax on the car, fade-up on load. No video, no carousel — Apple-style stillness.

**3.3 Vehicle Lineup** — Pull the model list from `demo.toyota.nagorik.tech`. Grid: 3-up desktop / 2-up tablet / 1-up mobile. Each card = white card, product shot on `--off-white`, model name, body type, "From ৳ XX,XX,XXX". Hover: image scales 1.04, shadow lifts. Filter chips above: All / SUV / Sedan / Hybrid / Commercial.

**3.4 RAV4 360° Showcase** — Full-bleed section, `--off-white` background. Left: copy + spec stats (engine, drivetrain, seats). Right: `<Viewer360 />`. Below viewer: exterior color swatches that swap the frame set. See §4.

**3.5 Technology** — Three-panel scroll section: Hybrid Electric, Toyota Safety Sense, Connected Services. Each panel = large image + short copy, alternating left/right, revealing on scroll.

**3.6 Safety** — Dark section (`--black`) for contrast break. White Product Logo variant. Big stat numbers counting up on scroll (e.g. "5★ ASEAN NCAP"). Grid of 6 safety features with thin-line icons.

**3.7 Offers** — Horizontal snap-scroll cards. Each: image, offer title, validity, "Enquire" → opens the Test Drive modal pre-filled.

**3.8 Dealer Locator** — Split: left is a searchable list of Bangladesh dealers (Dhaka, Chattogram, Sylhet, Khulna, Rajshahi) with address/phone/hours; right is a static styled map image with pins. Clicking a list item highlights its pin. No Google Maps API for the demo.

**3.9 Test Drive** — Centered form band on white: Name, Phone, Email, Model (select), Preferred Dealer, Date. Validates client-side, then swaps the form for a checkmark + confirmation message. No network call.

**3.10 Footer** — 4 columns (Vehicles / Owners / Company / Connect), White Product Logo on `--black`, social icons, legal line. Note "Demo — not an official Toyota site" in small grey text.

---

## 4. The 360° Viewer (build this first, it's the risk item)

**Approach: sprite sequence, not WebGL.** The dyadstudios Porsche reference is a real-time 3D render; that needs a GLB we don't have. A 36-frame drag-to-rotate sequence looks identical for a demo and loads far faster.

**Assets — build against placeholders, swap real frames in later.** The viewer must not be blocked on asset sourcing. Directory contract is fixed from day one:

```
public/rav4-360/{color}/001.webp … 036.webp    # 36 frames, 10° intervals
```

Colors: `white`, `silver`, `red`, `black`. Component reads the color key and swaps the path — nothing else changes when real images arrive.

*Step A — generate placeholders now:*
```bash
for c in white silver red black; do
  mkdir -p public/rav4-360/$c
  for i in $(seq -f "%03g" 1 36); do
    convert -size 1600x900 xc:'#F5F5F5' \
      -pointsize 90 -fill '#CCCCCC' -gravity center \
      -annotate 0 "$c $i" "public/rav4-360/$c/${i}.webp"
  done
done
```
Numbered placeholders make rotation direction, wrap-around, and drag sensitivity obvious during development — arguably easier to debug than real photos.

*Step B — source real frames (manual, outside Claude Code):* open the RAV4 360 viewer on toyota-bd.com, DevTools → Network → filter Img, drag through one full rotation to reveal the numbered URL pattern, then fetch and convert:
```bash
for i in $(seq -f "%03g" 1 36); do
  curl -o "public/rav4-360/white/${i}.jpg" "https://.../${i}.jpg"
done
for f in public/rav4-360/white/*.jpg; do
  cwebp -q 82 -resize 1600 0 "$f" -o "${f%.jpg}.webp" && rm "$f"
done
```
Target <120KB per frame. If a color variant isn't available, point its path at `white` — the swatch still works, it just won't change.

**Licensing note**: scraped OEM photography is fine for an internal demo, not for a public client-facing launch. For anything shipped, get assets from Toyota's brand portal or commission a render set. Flag this to the client before delivery.

**Component spec** — `ui/Viewer360.tsx`:
- Props: `frames: string[]`, `initialFrame?: number`.
- Preload all frames into `Image[]` before revealing; show a thin determinate progress bar during load.
- Render to `<canvas>` with `drawImage` on a rAF loop — avoids DOM thrash.
- **Drag**: pointer events (works for mouse + touch). `frameDelta = Math.round(dx / (viewerWidth / frames.length))`, wrap with modulo.
- **Inertia**: on pointerup, keep spinning with velocity decay (`v *= 0.94`) until it drops below threshold.
- **Idle autospin**: gentle rotation after 3s of no interaction, cancels on pointerdown.
- **Hotspots**: absolutely-positioned `+` buttons that only appear on frames within a given range (e.g. headlight hotspot visible on frames 30–06). Click opens a small feature popover.
- Cursor `grab` → `grabbing`. `touch-action: none` on the canvas so mobile drag doesn't scroll the page.
- Accessibility: left/right arrow keys step frames; `aria-label` describes the control.

**Fallback**: if frames fail to load, render a single static hero image.

---

## 5. Page 2 — Service & Commerce

**5.1 Parts & Oil Shop**
- Categories: Genuine Engine Oil, Filters, Brake Parts, Batteries, Accessories.
- Product card: white, image on `--off-white`, name, part number, price ৳, "Add to Cart".
- Product detail: modal (not a route) with larger image, compatibility list, quantity stepper.
- Cart: right-side drawer, line items, qty adjust, remove, subtotal + 15% VAT + delivery, "Proceed to Checkout".
- Checkout: single-column form (name, phone, address, division, payment method radio — bKash / Card / Cash on Delivery) → fake order confirmation screen with order number. Persist cart to `localStorage`.

**5.2 Book a Service** — 4-step wizard with a progress bar:
1. **Vehicle** — model select, year, registration number, mileage.
2. **Service type** — cards: Periodic Maintenance, Express Maintenance, Body & Paint, Diagnostics. Each shows duration + indicative price.
3. **Location & time** — dealer select, then a date grid + time-slot chips (grey out a few as "booked" for realism).
4. **Confirm** — summary card, contact fields, submit → booking reference + "Add to calendar" (generates an .ics client-side).

Steps animate horizontally with Framer Motion `AnimatePresence`. Back navigation preserves state.

---

## 6. Motion & Interaction Rules

- Lenis: `lerp: 0.1`, `duration: 1.2`, disabled on mobile if it feels laggy.
- Reveal default: `opacity 0→1`, `y 24px→0`, `duration .7s`, `ease [0.16,1,0.3,1]`, `viewport={{ once: true, margin: "-10%" }}`.
- Stagger children by 80ms in grids.
- Hover transitions 200–300ms. Never animate `width`/`height` — only `transform` and `opacity`.
- Buttons: scale 0.98 on press.
- Respect `prefers-reduced-motion`: kill Lenis, kill autospin, reveals become instant.

---

## 7. Build Order

1. Scaffold + tokens + fonts + Lenis + Header/Footer shell.
2. Generate the 4×36 placeholder frames (§4 Step A).
3. **`Viewer360` in isolation** on a scratch route `/360-test`, driven by placeholders. Prove drag, inertia, wrap, autospin, color swap before anything else.
4. Home: Hero → Vehicle Lineup → RAV4 Showcase (wires in the proven viewer).
5. Home: Technology → Safety → Offers → Dealers → Test Drive.
6. Service page: Parts shop + cart + checkout.
7. Service page: Booking wizard.
8. Responsive pass (375 / 768 / 1440 / 1920).
9. **Asset swap** — drop real frames into the same paths (§4 Step B). Zero code changes; if anything breaks here, the abstraction in step 3 was wrong.
10. Polish: Lighthouse ≥ 90, image sizes, reduced-motion, keyboard nav.

---

## 8. Definition of Done

- [ ] Both pages responsive at 375px through 1920px
- [ ] 360° viewer drags smoothly on touch and mouse, ≥30fps, with color swap
- [ ] Real frames swapped in with no component code changes
- [ ] Asset licensing raised with client before any public deployment
- [ ] Cart persists across reload; checkout reaches a confirmation state
- [ ] Booking wizard completes all 4 steps and issues a reference number
- [ ] Zero occurrences of "Move your world" in the codebase
- [ ] Only official logo files used; red is exactly `#EB0A1E`
- [ ] Lighthouse Performance ≥ 90, Accessibility ≥ 95
- [ ] Demo disclaimer present in footer

---

## 9. Kickoff Prompt for Claude Code

```
Read PLAN.md. Do steps 1-3 of §7 only.

1. Scaffold Next.js 15 + TS + Tailwind v4 with the brand tokens from §0.
2. Run the placeholder generation script in §4 Step A to create
   public/rav4-360/{white,silver,red,black}/001-036.webp.
3. Build components/ui/Viewer360.tsx to the full spec in §4 — canvas render,
   preload with progress bar, pointer drag with inertia, idle autospin,
   arrow-key stepping, reduced-motion handling. Demo it at /360-test with
   the four color swatches wired up.

The frame paths are a fixed contract: real photography drops into those exact
directories later with zero component changes. Design for that.

Stop after step 3 and show me the viewer before touching any page sections.
```
