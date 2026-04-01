# Design System Documentation

## 1. Overview & Creative North Star
**The Creative North Star: "Precision Utility"**

This design system is built for the intersection of the construction site and the executive office. It moves away from the cluttered, data-heavy "spreadsheet" look of traditional CRMs, opting instead for a "Precision Utility" aesthetic. We take the high-end, editorial clarity of a premium iOS experience and apply it to rugged, field-service data.

To move beyond the "template" look, this system utilizes **Intentional Asymmetry** and **Tonal Depth**. Instead of containing information within rigid, outlined boxes, we use massive typographic scales and layered surfaces to guide the eye. Information isn't just displayed; it is curated. The layout feels "breathable" yet authoritative, ensuring that a project manager on a loud construction site can glean critical metrics at a single glance.

---

## 2. Colors & Surface Philosophy

### Color Palette (Material Logic)
The color system is anchored by a vibrant, high-performance blue, balanced by a sophisticated cool-gray foundation.

*   **Primary Logic:** 
    *   `primary`: `#0041c8` (Core actions)
    *   `primary_container`: `#0055ff` (Vibrant interaction states/Heratbeat)
    *   `on_primary`: `#ffffff`
*   **Surface Foundation:**
    *   `background`: `#f9f9fe` (The base "canvas")
    *   `surface_container_low`: `#f3f3f8` (Secondary grouping)
    *   `surface_container_highest`: `#e2e2e7` (Deep nesting or inactive states)
*   **Status Tonalities:**
    *   `error`: `#ba1a1a` (Status: Urgent/Delayed)
    *   `tertiary`: `#972500` (Status: In-Progress/Warning)

### The "No-Line" Rule
**Traditional 1px borders are strictly prohibited.** To define sections, designers must use background color shifts. A `surface_container_lowest` card sitting on a `background` provides all the edge definition required. This creates a softer, more modern interface that feels native to high-end mobile hardware.

### The "Glass & Gradient" Rule
To add a layer of "soul" to the utility:
*   **Tab Bars & Overlays:** Must use Glassmorphism (semi-transparent `surface` with a 20px-30px backdrop blur).
*   **Main CTAs:** Use a subtle linear gradient from `primary_container` to `primary` (top-to-bottom) to give buttons a tangible, tactile weight.

---

## 3. Typography
We use **Inter** as our sole typeface, relying on extreme weight contrasts and tight tracking to create an editorial feel.

*   **Display & Headlines:** Use `display-md` (2.75rem) or `headline-lg` (2rem) with a font weight of **800** and a letter-spacing of `-0.02em`. These are for "At-a-Glance" metrics (e.g., $1.2M Revenue).
*   **The Signature Label:** Labels (`label-sm`) are our primary navigation tool. Set at **11px**, **700 weight**, **Uppercase**, with a **+0.05em** letter-spacing. Use `on_surface_variant` to keep them subordinate to data.
*   **Body:** `body-md` (0.875rem) is for descriptions. Keep line-height generous (1.5) to maintain readability on moving job sites.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through "Tonal Stacking" rather than elevation shadows alone.
1.  **Level 0 (Base):** `background` (#f9f9fe)
2.  **Level 1 (Section):** `surface_container_low`
3.  **Level 2 (Card):** `surface_container_lowest` (Pure #ffffff)

### Ambient Shadows
When a card must float (e.g., a critical notification), use an **Ambient Shadow**:
*   `Shadow`: 0px 2px 16px rgba(0, 0, 0, 0.06)
*   The shadow should never look "black"; it should feel like a soft occlusion of the background light.

### The Ghost Border
If contrast ratios fail in specific edge cases, use a **Ghost Border**: `outline_variant` at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons & Touch Targets
*   **Sizing:** All primary actions must have a minimum height of **56px** for field-use accessibility.
*   **Radius:** `xl` (12px) for standard buttons; `full` (20px+) for status pills.
*   **Primary:** `primary_container` background with `on_primary` text. Bold, heavy, and centered.

### Cards & Lists
*   **No Dividers:** Lists should never use horizontal lines. Use `1.4rem` (`spacing.4`) of vertical whitespace between items or alternate background tones.
*   **Nesting:** Cards use `xl` (16px) corner radius. Content inside cards should be inset by `spacing.4`.

### Field Inputs
*   **Style:** Minimalist. No bottom line or box outline. Use a `surface_container_low` background with a `md` (0.75rem) radius.
*   **Active State:** Transition the background to `surface_container_lowest` and add a 2px `primary` "Ghost Border" at 20% opacity.

### Glass Tab Bar
*   **Effect:** `surface` color at 70% opacity with `backdrop-filter: blur(20px)`.
*   **Interaction:** Active icons use `primary` color; inactive use `outline`.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use bold metrics. If a number is important, make it `headline-lg`.
*   **DO** lean on whitespace. If the UI feels "tight," double the spacing scale.
*   **DO** use status colors for backgrounds of chips (e.g., a red chip has a 10% opacity red background with 100% opacity red text).

### Don't
*   **DON'T** use 1px solid borders to separate content.
*   **DON'T** use standard grey shadows. Always ensure shadows are diffused and low-contrast.
*   **DON'T** use icons without labels for primary navigation. On-site workers need zero ambiguity.
*   **DON'T** use "pure black" (#000000) for text. Use `on_surface` (#1a1c1f) to maintain the premium, soft-gray aesthetic.