---
name: premium-editorial-ui
description: >-
  Design system and rules for a high-end, "Editorial Brutalism" website aesthetic.
  Use this for generating HTML/CSS that feels expensive, agency-level, and print-inspired.
  Key features: Massive brutalist typography, off-white backgrounds, asymmetric grids,
  and continuous GSAP marquees.
---

# Premium Editorial UI — Design System

## 1. Creative Philosophy
- **Editorial Brutalism:** Treat the web page like a high-end magazine spread.
- **Extreme Contrast:** Mix very small utility text with absurdly massive display text.
- **Anti-Symmetry:** Avoid perfectly centered, equal-column layouts. Shift text blocks to create tension and negative space.
- **Print Aesthetics:** Never use pure white or pure black. Use paper-like off-whites and deep charcoals. No heavy drop shadows.

## 2. Color Palette
- **Background (Paper):** `#F2F0E9` (A warm, elegant bone/cream color).
- **Foreground (Ink):** `#1A1A1A` (Deep charcoal, easier on the eyes than pure black).
- **Accents:** Use very sparingly. Rely on monochrome greyscale images.

## 3. Typography System
- **Massive Display (The Ticker):** 
  - Style: Ultra-bold, condensed sans-serif (e.g., 'Impact', 'Oswald', or 'Anton').
  - Usage: `font-size: 25vw; line-height: 0.8; letter-spacing: -0.04em; text-transform: uppercase;`.
- **Primary Headlines:**
  - Style: Clean, modern neo-grotesque (e.g., 'Inter', 'Helvetica Neue').
  - Usage: `font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 500; letter-spacing: -0.02em;`.
- **Body & Utility:**
  - Style: Same neo-grotesque, regular weight.
  - Usage: `font-size: 1rem; line-height: 1.6;`.
- **CTAs & Links:**
  - Style: All-caps, small text (`0.85rem`), bold, with a solid 1px bottom border and a minimal arrow (`SEE EXECUTIVES →`).

## 4. Spacing & Layout Rules (Grid)
- **Top Navigation:** Minimal. Logo left, links center, dark circular hamburger button right (`width: 50px; height: 50px; background: #1a1a1a; border-radius: 50%;`).
- **Hero Layout (Asymmetrical):**
  - Left column (narrow): Small intro paragraph and CTA link pushed to the middle-left of the viewport.
  - Right column (wide): Main descriptive headline ("Digital Home...") aligned to the right or center-right, sitting higher than the left text.
- **Padding:** Use generous viewport-based padding (e.g., `padding: 4vw 6vw`).

## 5. The "Signature Hero Marquee" Component (GSAP)
Whenever the user asks for the "Hero Marquee" or "Scrolling Image Text", implement this exact pattern:
- **Structure:** A full-width `overflow-hidden` container. Inside, a flex track that holds the repeating content.
- **Content Mix:** Combine the massive display text ("LAWSSA UNIBEN") inline with a portrait image (The President's Image).
- **Image Treatment:** The image should be cleanly masked (cut out background or solid grey background), placed directly beside the massive text, and scaled to match the exact height of the text block.
- **Animation (GSAP ModifiersPlugin):** 
  - Create a seamless infinite horizontal scroll using GSAP.
  - Set `ease: "none"` so it moves at a constant, mechanical speed.
  - Connect it to `ScrollTrigger` so that scrolling the mouse wheel down *accelerates* the horizontal movement slightly (scrub effect integrated with timeline).