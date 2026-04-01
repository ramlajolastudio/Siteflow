# SiteFlow — Mobile App Prototype Prompt (for Stitch AI)

## Overview
Build a mobile-first CRM app called **SiteFlow** — a job site command center for restoration and construction companies across the United States. It handles water damage, fire damage, mold remediation, storm damage, and general construction projects. This is a field-tool for technicians, project managers, and company owners — NOT a desktop admin panel. Every screen must feel like an iPhone app, not enterprise software.

**SiteFlow is a standalone SaaS product** — it is NOT tied to any specific company. Any restoration or construction company signs up and uses it. Think of it like Jobber or ServiceTitan, but simpler, mobile-first, and built specifically for restoration/construction field workers who are not tech-savvy.

The app has 5 tabs: **Home, Jobs, Contacts, Notes, Settings**

---

## Design System

### Brand & Feel
- **App Name:** SiteFlow
- **Tagline:** "Your job site command center"
- **Logo:** A stylized location pin that flows into a wave/arrow shape — representing job sites + workflow movement. Uses the blue gradient. Keep it simple and geometric — think Stripe or Linear level of logo simplicity.
- **Design feel:** iOS-native, clean, minimal, high glanceability. Think Apple Reminders meets a premium CRM. Designed for one-handed use by someone standing in a flooded basement.
- **No 1px borders.** Use surface layering and subtle shadows instead.
- **Glassmorphism** on the tab bar (frosted glass, semi-transparent).

### Colors
- **Primary:** #0055ff (vibrant blue — slightly brighter and more energetic than v1)
- **Primary Dark:** #0040cc
- **Primary Light:** #e8f0ff
- **Background:** #f5f5fa (light cool gray)
- **Surface:** #ffffff
- **Surface Low:** #f0f0f8
- **Surface Container:** #eaeaf2
- **Text Primary:** #111827
- **Text Secondary:** #6b7280
- **Outline:** #d1d5db
- **Status Red:** #ef4444 (overdue, critical)
- **Status Yellow:** #f59e0b (due soon, warning)
- **Status Green:** #10b981 (on track, healthy)
- **Status Red BG:** rgba(239,68,68,0.08)
- **Status Yellow BG:** rgba(245,158,11,0.08)
- **Status Green BG:** rgba(16,185,129,0.08)

### Typography
- **Font:** Inter (or SF Pro if unavailable)
- **Headings:** 700-800 weight, tight letter-spacing (-0.3 to -0.5px)
- **Body:** 400-500 weight, 14-15px
- **Labels/Caps:** 10-11px, 700 weight, letter-spacing 1.5-2px, uppercase
- **Numbers/Stats:** 28-36px, 800 weight

### Spacing & Layout
- **Border radius:** Cards 16px, buttons 12px, pills 20px, tab bar 24px top corners
- **Horizontal padding:** 20-24px
- **Card shadows:** subtle, 0 2px 16px rgba(0,0,0,0.06)
- **Touch targets:** minimum 48px, prefer 56-60px (designed for gloved hands on a job site)

### Tab Bar
- Fixed bottom tab bar with glassmorphism (semi-transparent white with backdrop blur)
- 5 tabs: Home (house icon), Jobs (clipboard-list icon), Contacts (people icon), Notes (document icon), Settings (gear icon)
- Active tab: icon wrapped in a blue (#0055ff) rounded pill with white icon
- Inactive: gray icon (#6b7280)
- Labels: 10px uppercase, bold, letter-spacing 1.2px
- Tab bar has top-left and top-right border radius of 24px
- Tab bar floats above content (position absolute, slight upward shadow)
- Height: 78px (Android/web), 94px (iOS with safe area)

---

## Login Screen (first screen the user sees)

### Design
- Full-screen dark gradient background (#080c18 to #101830)
- Centered content, max-width 360px

### Elements (top to bottom)
1. **Logo:** SiteFlow logo icon — a stylized location pin with a flow/wave shape. Blue gradient circle (72x72) with the pin-flow icon inside in white. Glowing blue shadow underneath (rgba(0,85,255,0.3)).
2. **App Name:** "SiteFlow" — 32px, 800 weight, white
3. **Tagline:** "Your job site command center" — 15px, 50% white opacity
4. **Input field:** Dark semi-transparent background (rgba(255,255,255,0.08)), 1px border rgba(255,255,255,0.12), rounded 14px, placeholder "Access code" in dim text, password masked, white text. 52px height.
5. **Error state:** Red border on input + "Invalid access code" text below in red. Only visible after wrong attempt.
6. **Button:** Blue gradient (#0055ff → #0040cc), rounded 14px, 52px height. Text: "Sign In" + right arrow icon. Blue glow shadow underneath.
7. **Footer text:** "SiteFlow — Built for the field" — 12px, very dim (20% white)

### Behavior
- Access code is **"root"** — typing root and pressing Sign In enters the app
- Case-insensitive
- Wrong code shows error state

---

## Screen 1: HOME (Dashboard)

The home screen answers ONE question: **"What needs my attention right now?"**

### Top Bar
- Dark gradient background (#111827 to #1f2937)
- Left side:
  - Time-based greeting: "Good morning" / "Good afternoon" / "Good evening" — 15px, 60% white
  - "SiteFlow" — 26px, 700 weight, white
- Right side: circular avatar with blue-to-purple gradient showing initials "JR" (the logged-in user)

### Alerts Banner (immediately below top bar, on the light background)
- Red-tinted card: rgba(239,68,68,0.06) background, 3px solid red left border, rounded 12px
- Left: red warning icon
- Text: **"2 lien deadlines within 5 days · 3 supplements overdue 30+ days"** — 14px, dark text
- Tappable feel (subtle right chevron)
- Only visible when there ARE alerts

### Key Metrics Row
4 compact metric cards in a horizontal scrolling row (or 2x2 grid on narrow screens):

| Metric | Value | Color |
|--------|-------|-------|
| Active Jobs | 12 | Blue |
| Pending Supplements | $48,500 | Yellow |
| Equipment Out | 47 units | Blue |
| Overdue Tasks | 5 | Red |

Each card: white surface, rounded 14px, subtle shadow. Large number (28px, 800 weight) with colored accent, small label below (11px, uppercase, gray).

### Quick Actions (2x2 grid)
4 action cards:

1. **New Job** — Icon: clipboard with "+" on a blue gradient (→ #0055ff) background, 56x56 rounded 14px. Label: "New Job" (14px, 600 weight). Subtitle: "Start a project" (12px, gray).
2. **Quick Photo** — Icon: camera on a multi-color gradient (pink → orange → green → blue) background. Label: "Quick Photo". Subtitle: "Snap & tag to job".
3. **Voice Note** — Icon: microphone on an orange gradient (#f59e0b → #f97316) background. Label: "Voice Note". Subtitle: "Dictate a note".
4. **Log Reading** — Icon: water droplet on a teal gradient (#10b981 → #06b6d4) background. Label: "Log Reading". Subtitle: "Moisture data".

Each card: white surface, rounded 16px, centered content, subtle shadow.

### My Tasks Section
- Section title: "My Tasks" — 20px, 700 weight

**Task Group Card 1 — Juan Rodriguez (Project Manager)**
- Card header: Purple gradient avatar (40x40) with white "JR" initials, "Juan Rodriguez" name (15px, 600), "Project Manager" role (11px, gray). Bottom border.
- Task rows (each with left dot, title, meta, right badge):
  - Red dot | "File 20-Day Pre-Lien Notice" | Martinez Residence · Water Damage | Red badge: "Overdue"
  - Red dot | "Submit Supplement to State Farm" | Chen Property · Fire Restoration | Red badge: "2d late"
  - Yellow dot | "Schedule Asbestos Testing" | Thompson Home · Mold Remediation | Yellow badge: "Due today"
  - Yellow dot | "Follow Up w/ Adjuster (72hr)" | Davis Residence · Storm Damage | Yellow badge: "Tomorrow"
  - Green dot | "Upload Final Clearance Photos" | Wilson Property · Water Damage | Green badge: "Mar 10"

**Task Group Card 2 — Matt Kowalski (Project Manager)**
- Card header: Orange gradient avatar with white "MK"
- Task rows:
  - Red dot | "Revised Estimate — 24hr Turnaround" | Garcia Home · Roof Damage | Red badge: "5h left"
  - Yellow dot | "Request Clearance from Lab" | Park Residence · Mold Remediation | Yellow badge: "Due today"
  - Yellow dot | "Material Selection Follow-Up" | Nguyen Property · Kitchen Rebuild | Yellow badge: "Tomorrow"
  - Green dot | "Send Progress Update to Homeowner" | Brooks Home · Fire Restoration | Green badge: "Mar 9"
  - Green dot | "Schedule Final Walkthrough" | Taylor Residence · Water Damage | Green badge: "Mar 11"

Card styling: White surface, rounded 16px, shadow, overflow hidden.

### Bottom
- 120px bottom padding to clear tab bar

---

## Screen 2: JOBS (Pipeline)

The CORE screen of the entire app. Every construction/restoration company revolves around jobs.

### Header Area
- Screen title: "Jobs" — 28px, 700 weight
- Subtitle: "12 active projects" — 14px, gray
- Right side: small filter/sort icon button (40x40, rounded)

### Status Filter Pills (horizontal scroll row)
Pill buttons: **All (12)** | **Lead (2)** | **Mitigation (3)** | **Drying (4)** | **Rebuild (2)** | **Complete (1)**
- Active: blue background (#0055ff), white bold text
- Inactive: surface background (#f0f0f8), gray text
- Rounded 20px, horizontal padding 18px, vertical 10px, gap 8px

### Search Bar
- Full width, light gray background (#f0f0f8), rounded 12px, 48px height
- Left: search icon (gray)
- Placeholder: "Search by address, client, or claim..."

### Job Cards (scrollable list)
Each job card has:

**Layout:**
- Left edge: 3px colored border (red/yellow/green for health)
- Inside, left: 10px health dot (matching color)
- Main content area:
  - **Line 1:** Address — bold 15px, dark text ("4821 E Cactus Rd, Phoenix")
  - **Line 2:** Client + type — 13px ("Martinez Family" + loss type pill badge)
  - **Line 3:** Insurance — 12px gray ("Claim: SF-2026-88291 · State Farm")
- Right column (stacked, right-aligned):
  - Status pill: ("Mitigation" in colored pill — blue for active, orange for mitigation, green for complete)
  - Days counter: "Day 17" in 11px gray
- **Bottom row** (inside card, below a thin divider): 3 inline mini-stats:
  - "$28,500 est."
  - "Supplement pending" (yellow text)
  - "6 equip. deployed"

**Card styling:** White surface, 16px rounded, subtle shadow, 16px internal padding, 12px gap between cards.

**Loss type badge colors:**
- Water Damage: blue pill
- Fire Restoration: red/orange pill
- Mold Remediation: green pill
- Storm Damage: purple pill
- Roof Damage: amber pill

**Mock Jobs Data (8 jobs):**

1. **Health: RED** | 4821 E Cactus Rd, Phoenix | Martinez Family | Water Damage | Status: Mitigation | Day 17 | State Farm | Claim: SF-2026-88291 | Est: $28,500 | Approved: $22,000 | Supplement: $6,500 pending | Lien deadline in 3 days | 6 equip
2. **Health: RED** | 1190 W Camelback Rd, Phoenix | Chen Property | Fire Restoration | Status: Reconstruction | Day 42 | Allstate | Claim: AL-2026-44102 | Est: $67,000 | Approved: $52,000 | Supplement: $15,000 overdue 35 days | 8 equip
3. **Health: YELLOW** | 7632 N 15th Ave, Phoenix | Thompson Home | Mold Remediation | Status: Mitigation | Day 8 | USAA | Claim: US-2026-71830 | Est: $18,200 | Awaiting adjuster approval | 3 equip
4. **Health: YELLOW** | 2244 E Indian School Rd, Phoenix | Davis Residence | Storm Damage | Status: Drying | Day 12 | Liberty Mutual | Claim: LM-2026-55920 | Est: $34,800 | Supplement: $7,200 under review | 12 equip
5. **Health: GREEN** | 891 S Mill Ave, Tempe | Wilson Property | Water Damage | Status: Drying | Day 6 | Farmers | Claim: FI-2026-33017 | Est: $12,400 | Approved | 4 equip
6. **Health: GREEN** | 5510 E Thomas Rd, Phoenix | Garcia Home | Roof Damage | Status: Lead | Day 2 | State Farm | Claim: SF-2026-90112 | Est: $22,000 | Pending inspection
7. **Health: YELLOW** | 3301 N 7th St, Phoenix | Park Residence | Mold Remediation | Status: Reconstruction | Day 28 | Travelers | Claim: TR-2026-62840 | Est: $41,500 | Supplement: $8,200 approved
8. **Health: GREEN** | 4102 W Glendale Ave, Phoenix | Brooks Home | Fire Restoration | Status: Complete | Day 55 | USAA | Claim: US-2026-19384 | Est: $53,000 | Fully paid | All equipment retrieved

### FAB
- Bottom right corner, 24px from edge, above tab bar
- Blue gradient circle (60x60), white "+" icon (28px)
- Drop shadow: 0 8px 24px rgba(0,85,255,0.3)

---

## Screen 3: JOB DETAIL (opens when tapping a job card)

Full-screen scrollable detail view for one job. Shows EVERYTHING in one place. This screen uses Job #1 (Martinez, Water Damage) as the example.

### Header (dark gradient)
- Same dark gradient as Home top bar (#111827 → #1f2937)
- Left: back arrow icon (white, tappable)
- Center/left: "4821 E Cactus Rd" — 18px, 700 weight, white
- Below title: "Mitigation" status pill (blue bg, white text, small)
- Right: "..." more options icon (white)

### Health Alert Banner
- Full width, below header, on the content background
- Red tinted card: "Lien deadline in 3 days · Supplement overdue" with warning icon
- Same style as Home alerts banner

### Client Info Card
White card:
- **Name:** Martinez Family (bold 16px)
- **Phone:** (602) 555-0142 (tappable, blue)
- **Email:** martinez.j@email.com (tappable, blue)
- **Address:** 4821 E Cactus Rd, Phoenix, AZ 85032
- **Quick action row:** Three icon-buttons in a horizontal row: 📞 Call | 💬 Text | ✉️ Email — each is a small rounded rectangle with icon + label

### Insurance Info Card
Card with slight blue-tint background (rgba(0,85,255,0.03)):
- 2-column grid layout:
  - **Carrier:** State Farm (left label, bold value)
  - **Claim #:** SF-2026-88291
  - **Adjuster:** Tom Bradley
  - **Adjuster Phone:** (480) 555-0199 (tappable, blue)
  - **Policy #:** HO-4821-AZ
  - **Deductible:** $1,000

### Financials Card
White card with a visual progress element:
- **Horizontal progress bar** at the top of the card:
  - Full width = Estimate ($28,500)
  - Blue filled portion = Paid ($15,000 / 53%)
  - Yellow portion = Approved but unpaid ($7,000)
  - Gray remainder = Supplement pending ($6,500)
- Below the bar, a row of stat columns:
  - **Estimate:** $28,500 (dark, bold)
  - **Approved:** $22,000 (blue)
  - **Supplement:** $6,500 — yellow badge "Pending"
  - **Paid:** $15,000 (green)
  - **Remaining:** $13,500 (red)

### Key Dates Card
White card with a vertical timeline of dates:
- Each date row: left icon/dot, date label, actual date, and optional countdown badge
  - 📅 **Loss Date:** Mar 15, 2026
  - 🔨 **Work Started:** Mar 15, 2026
  - ⚠️ **20-Day Lien Notice:** Apr 4, 2026 — **RED badge: "3 days left"** (this should be visually prominent — larger badge, red background, bold)
  - 🎯 **Target Completion:** Apr 20, 2026 — gray badge: "23 days"
  - 📋 **120-Day Lien Filing:** Jul 13, 2026 — green badge: "103 days"

### Equipment on Site Card
White card:
- Section title: "Equipment on Site" with summary: "22 units · $385/day"
- List of equipment rows, each with:
  - Equipment icon (or generic tool icon)
  - Name and quantity: "LGR Dehumidifier × 3"
  - Deploy date: "Since Mar 15"
  - Daily rate: "$45/day ea."
- Equipment items:
  - LGR Dehumidifier × 3 — Mar 15 — $45/day each = $135/day
  - Air Mover × 12 — Mar 15 — $15/day each = $180/day
  - Air Scrubber × 2 — Mar 16 — $35/day each = $70/day
  - Thermal Imaging Camera × 1 — in use — —
- Bottom: "+ Add Equipment" button (outline style)

### Job Photos Card
White card:
- Section title: "Photos" + count badge "(24)"
- Horizontal category pills: **Before (8)** | **During (10)** | **After (0)** | **Damage (6)**
- Photo grid: 3 columns of square thumbnails with rounded 10px corners. Use placeholder colored rectangles (light blue, light orange, light purple, etc.) with small camera icons to represent photos. Or use stock images of water damage restoration if available.
- Bottom: "+ Add Photos" button (outline style)

### Notes Card
White card:
- Section title: "Notes" + count "(6)"
- Show 2 most recent notes, each with:
  - Category pill (Internal = blue, Insurance = red, Customer = green)
  - Timestamp: "14 mins ago"
  - Preview text (2 lines max, truncated)
  - Author: "A. Miller"
- "View All Notes →" link at bottom
- "+ Add Note" button with mic icon

### Tasks Card
White card:
- Section title: "Tasks" + progress: "3 of 7 complete"
- Visual mini progress bar (green fill for completion)
- Checklist:
  - ✅ Initial moisture readings documented — ~~Complete~~
  - ✅ Before photos uploaded (24 photos) — ~~Complete~~
  - ✅ Emergency mitigation started — ~~Complete~~
  - ⬜ File 20-Day Pre-Lien Notice — RED badge "3 days"
  - ⬜ Submit supplement to State Farm — RED badge "Overdue"
  - ⬜ Daily moisture log update — YELLOW badge "Today"
  - ⬜ Schedule adjuster re-inspection — GREEN badge "Next week"

### Moisture Readings Card
White card:
- Section title: "Moisture Readings"
- Trend indicator: green down-arrow "↓ Trending down" (readings are improving)
- Mini data table:
  | Date | Location | Reading | Instrument |
  |------|----------|---------|------------|
  | Mar 18 | Kitchen subfloor | 18.2% | Delmhorst BD-2100 |
  | Mar 17 | Kitchen subfloor | 22.5% | Delmhorst BD-2100 |
  | Mar 16 | Kitchen subfloor | 31.8% | Delmhorst BD-2100 |
  | Mar 15 | Kitchen subfloor | 48.2% | Delmhorst BD-2100 |
- The readings visually show progress (numbers going down = drying working = good)
- "+ Log Reading" button

### Bottom padding
- 120px to clear tab bar

---

## Screen 4: CONTACTS

Tracks the referral network that drives 30-40% of revenue — insurance agents, adjusters, property managers, plumbers, and clients.

### Header
- Screen title: "Contacts" — 28px, 700 weight
- Subtitle: "Your referral network" — 14px, gray

### Filter Tabs (horizontal scroll)
Pills: **All (12)** | **Agents (5)** | **Adjusters (3)** | **Clients (2)** | **Property Mgrs (1)** | **Plumbers (1)**
- Same style as Jobs filter pills

### Search Bar
- Same style as Jobs search bar
- Placeholder: "Search contacts..."

### Contact Cards
Each card:
- **Left:** 40x40 circular avatar with gradient background + white initials
  - Agents: blue gradient (#0055ff → #3b82f6)
  - Adjusters: purple gradient (#7c3aed → #a855f7)
  - Clients: green gradient (#10b981 → #34d399)
  - Property Mgrs: orange gradient (#f59e0b → #fb923c)
  - Plumbers: teal gradient (#06b6d4 → #22d3ee)
- **Middle:**
  - Name — 15px, 600 weight ("Sarah Mitchell")
  - Company — 13px, gray ("State Farm — Scottsdale Office")
  - Type pill badge — tiny colored pill matching avatar gradient
- **Right side (stacked, right-aligned):**
  - Referral count — 13px, bold ("12 referrals")
  - Revenue — 12px, green ("$156K revenue")
  - Last contact — 11px, gray ("3 days ago") — turns yellow/red if stale (>14 days)

Card styling: white surface, 16px rounded, subtle shadow, 14px padding, 10px gap between cards.

**Mock Contacts Data (12):**

**Insurance Agents:**
1. Sarah Mitchell | State Farm — Scottsdale | Agent | 12 referrals | $156K | Last: 3 days ago
2. David Park | Allstate — Phoenix Central | Agent | 8 referrals | $98K | Last: 1 week ago
3. Maria Gonzalez | USAA — Tempe | Agent | 15 referrals | $210K | Last: 2 days ago
4. James O'Brien | Liberty Mutual — Mesa | Agent | 5 referrals | $62K | Last: 16 days ago (STALE — yellow warning)
5. Rachel Kim | Farmers — Chandler | Agent | 3 referrals | $38K | Last: 5 days ago

**Adjusters:**
6. Tom Bradley | State Farm (desk adjuster) | Adjuster | 6 jobs handled | Last: yesterday
7. Nicole Foster | Allstate (field adjuster) | Adjuster | 4 jobs handled | Last: 3 days ago
8. Marcus Webb | USAA | Adjuster | 3 jobs handled | Last: 1 week ago

**Clients:**
9. Martinez Family | 4821 E Cactus Rd | Client | Active job: Water damage
10. Chen Family | 1190 W Camelback Rd | Client | Active job: Fire restoration

**Property Managers:**
11. Kevin Tran | Sunset Property Group — 20 units | PM | 7 referrals | $89K revenue

**Plumbers:**
12. Mike Hernandez | Mike's Plumbing — Phoenix | Plumber | 9 referrals | $112K revenue | Last: 4 days ago

### Contact Detail Screen (tapping a contact)
Full screen:
- Large avatar (64x64) + name (24px bold) + company + type badge
- **Quick action row:** Call | Text | Email | Log Visit — 4 icon buttons in a row
- **Referral Stats Card:**
  - Total referrals: 12
  - Total revenue: $156,000
  - Avg job size: $13,000
  - Last referral: Mar 15, 2026
- **Interaction Timeline:**
  - Mar 28 — "Dropped off lunch at Scottsdale office" — visit icon
  - Mar 22 — "Called re: Martinez claim status" — phone icon
  - Mar 15 — "Received referral: Martinez water damage" — referral icon (star)
  - Mar 8 — "Attended CE event at State Farm regional" — event icon
  - Feb 28 — "Dropped off marketing materials" — visit icon
- **Linked Jobs:** Cards showing jobs this contact referred/is tied to
- "+ Log Interaction" blue button at bottom

---

## Screen 5: NOTES

Field notes linked to jobs, with voice-first input.

### Header
- Screen title: "Notes" — 28px, 700 weight
- Subtitle: "Capture observations instantly." — 14px, gray

### Voice Note Button (prominent, centered)
- Large circle button: 64x64, blue gradient background, white mic icon (28px)
- Below: "Tap to dictate" label (13px, gray)
- **Recording state (toggle on tap):** Red pulsing ring animation around button, background shifts to dark, waveform visualization bars animate below, timer "Recording... 0:04", "Tap to stop" label. This is UI only — doesn't need to actually record audio.

### Category Filter Tabs
Pills: **All** | **Internal** | **Customer** | **Insurance**
- Same pill style as other screens

### Note Input Area
- **Job selector row:** "Link to: [Select job ▾]" — tappable dropdown that shows list of active jobs
- **Text input:** Multiline, light background, rounded 12px, placeholder "Type or dictate your note...", min-height 100px
- **Right of input:** small mic icon button (for inline dictation)
- **"Save Note"** button — blue, full width, rounded 12px

### Recent Notes List
Note cards, each with:
- **Top row:** Category badge pill (Internal=blue, Insurance=orange-red, Customer=green) + timestamp ("14 mins ago") + job link ("Martinez Residence · Water")
- **Body:** Note text preview, 2-3 lines
- **Bottom row:** Attachment indicators (📎 "2 Photos", 🎤 "Voice Memo") + author ("A. Miller")

**Mock Notes (4):**
1. **Internal** | 14 mins ago | Martinez Residence · Water Damage | "Moisture levels in primary bathroom subfloor remain at 18.2%. Elevated from yesterday's 16.5%. Recommend adding secondary dehumidifier unit to accelerate drying." | 2 Photos | A. Miller
2. **Insurance** | 2 hours ago | Thompson Home · Mold Remediation | "Claim #71830: Verified visual signs of Category 3 water intrusion. Documented mold growth behind the baseboard in utility room. Photos submitted to adjuster." | Voice Memo | M. Chen
3. **Customer** | 4 hours ago | Davis Residence · Storm Damage | "Homeowner confirmed they'll be out of the house through Friday. Temporary housing covered by carrier. Left contact card for emergency reach." | J. Rodriguez
4. **Internal** | Yesterday | Wilson Property · Water Damage | "All equipment performing within spec. Humidity readings trending toward goal. Expecting to hit drying standard by Thursday. Will schedule equipment pickup for Friday AM." | M. Kowalski

---

## Screen 6: SETTINGS

Clean, standard iOS-style settings. Branded as SiteFlow.

### Header
- Screen title: "Settings" — 28px, 700 weight

### Profile Section
- Large avatar (80x80) with gradient + initials "JR"
- Name: "Juan Rodriguez" — 20px, bold
- Role: "Project Manager" — 14px, gray
- Company: "ABC Restoration Services" — 14px, gray (this is the USER'S company, not SiteFlow)
- "Edit Profile" button — small, outline style

### Notification Preferences
White card with toggle rows:
1. **SMS Notifications** — "Urgent dispatch alerts" — toggle ON by default
2. **Email Updates** — "Daily job summaries" — toggle ON by default
3. **In-App Alerts** — "Real-time status changes" — toggle OFF by default

### Security
White card with list rows (tappable, chevron on right):
1. 🔒 Change Password
2. 👆 Biometric Authentication — "On" value
3. 📱 Managed Devices

### About Section
Small gray text at bottom:
- "SiteFlow v2.0.0"
- "Built for the field"

---

## General Design Rules

- **All data is mock/hardcoded** — no backend, no API, no database. This is a UI prototype.
- **Mobile-first** — design for iPhone screen width (375-390px). Should look great on mobile, acceptable on tablet/desktop.
- **Every screen: 120px bottom padding** to clear the floating tab bar.
- Use **Material Design Icons** (or equivalent) for all icons throughout.
- **No emojis in the actual UI** — use proper icons. Emojis in this prompt are for illustration only.
- **Red/Yellow/Green status system** is used consistently across ALL screens — jobs, tasks, contacts (stale warnings), supplements, deadlines.
- **All cards use surface layering:** white cards on light gray (#f5f5fa) background with subtle shadows. No hard 1px borders.
- **App name throughout: "SiteFlow"** — in the top bar, login screen, settings, and anywhere the brand appears.
- **The app serves ANY restoration or construction company** — it is not specific to one company. The Settings screen shows the user's own company name as their profile, but SiteFlow is the product.
- **Big touch targets** — buttons are minimum 48px, preferred 56px+. This app is used by people with dirty hands and work gloves.
- **Headers across screens should be consistent** — screen title (bold) with optional subtitle, right-aligned action icon. No "Restoration Intelligence" branding.
