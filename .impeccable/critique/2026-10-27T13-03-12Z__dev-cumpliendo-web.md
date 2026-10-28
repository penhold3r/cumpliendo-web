---
target: cumpliendo-web app
total_score: 15
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:/Users/nico/Documents/CODE/Agent/DEV/cumpliendo-web/dev-cumpliendo-web"
timestamp: 2026-10-27T13-03-12Z
slug: dev-cumpliendo-web
closed: true
---
# Cumpliendo Web — Design Critique

**Method: dual-agent (A: design-review · B: detector-evidence)**

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 1 | No loading indicators, no sync status, auth guard renders blank screen |
| 2 | Match System / Real World | 3 | Familiar workout terminology, natural i18n, logical IA |
| 3 | User Control and Freedom | 1 | No undo, no cancel flows, all action handlers are TODOs |
| 4 | Consistency and Standards | 2 | Blue Grey palette consistent, but card patterns vary; Profile renders wrong theme; button variant inconsistency |
| 5 | Error Prevention | 1 | No validation, no confirmation dialogs, no destructive-action guards |
| 6 | Recognition Rather Than Recall | 3 | Nav labeled with icons+text, active state visible, section titles descriptive |
| 7 | Flexibility and Efficiency | 1 | No keyboard shortcuts, no search, no filters, no bulk actions |
| 8 | Aesthetic and Minimalist Design | 2 | Clean but too sparse — empty space is missing content, not intentional negative space |
| 9 | Error Recovery | 1 | No error messages, no recovery paths anywhere |
| 10 | Help and Documentation | 0 | No help, no tooltips, no onboarding, no contextual guidance |
| **Total** | | **15/40** | **Poor** |

## Design Specificity Verdict

### LLM Assessment

Low-to-moderate specificity. The app has the right brand colors (indigo primary, Blue Grey neutrals) and Funnel Display headings, but the overall composition is category-interchangeable. Swap out "Cumpliendo" and translations, and this could be any SaaS dashboard.

The Android app has a rich visual vocabulary that the web version hasn't adopted: colored tag/chip rows on routine and history cards, exercise-specific icons in the library, secondaryContainer tonal buttons, a rich streak/goal card with progress bar and day-of-week circles. The web has the icon circles on Home metric tiles and Train cards — but stops there.

### Deterministic Scan

2 CLI warnings:
- `side-tab` (warning) in AmrapBlock.module.css:9 — border-left accent. Likely false positive (functional indicator).
- `overused-font` (warning) in lattyConfig.ts:8 — Inter font. Deliberate product decision.

Browser overlay: 1 finding on /exercises — OVERUSED FONT: inter (97% of text).

Profile page renders in light mode while every other page is dark — theme sync bug confirmed by both assessments.

## Overall Impression

Architectural foundation is solid: Blue Grey palette overrides cascade cleanly through Latty's semantic tokens, nav structure is well-built, component organization is good. But the app is visually hollow. Every page has the structure of a finished screen with the content density of a wireframe. The Android app packs meaningful information into every card and the web version strips it away, leaving cards that are 70% empty padding.

## What's Working

1. Blue Grey palette integration is architecturally clean — overriding Latty's neutral primitives cascades Material Blue Grey through all semantic tokens.
2. Train hub is the strongest screen — 3-card layout with icon circles, correct button hierarchy.
3. Header navigation is well-structured — Latty Header + Nav + NavItem with responsive breakpoints.

## Priority Issues

### [P1] Routine cards lack the Android app's information density
Web shows name, time, description, exercise count, start button. Android shows 3 tag chips, 4-exercise preview list with set×rep, "+3 más...", edit/delete icons.
Fix: Add tag chips, exercise preview list, edit/delete IconButtons.
Suggested: /impeccable layout

### [P1] Exercises page missing search, filters, tabs, and exercise icons
Android has search, 3 filter chips, All/Mine tabs, unique icons. Web has 99+ flat text-only cards.
Fix: Add search, All/Mine TabGroup, filter chips, exercise icons.
Suggested: /impeccable layout

### [P1] No loading states — blank screen flash
Every component returns null during isLoading. No skeletons, no spinners.
Fix: Replace null returns with skeleton/shimmer components.
Suggested: /impeccable harden

### [P2] Profile page theme mismatch
Profile renders light mode while rest is dark. Confirmed by both assessments.
Fix: Debug theme cascade to Profile.
Suggested: /impeccable audit

### [P2] Streak banner is a skeleton of the Android's rich weekly goal card
Android shows record, weekly goal, progress bar, day circles. Web shows one line of text.
Fix: Build StreakCard component matching Android pattern.
Suggested: /impeccable layout

## Persona Red Flags

Alex (Power User): No keyboard shortcuts. No search/filter in exercises. Train cards promise interactivity (hover states) but handlers are TODOs.

Jordan (First-Timer): No onboarding. "0 min" metrics with no guidance. Misleading streak banner for 0-session users. History offers two buttons with no explanation of the difference.

Marco (Android daily user): Routine cards missing exercise breakdown. History blank. No "New Routine" button. Exercise library text-only.

## Minor Observations

- Logo is plain text (Android has dumbbell icon + all-caps)
- No "Create" CTA on Routines page
- Button variant inconsistency (outlined vs neutral for secondary)
- 🔥 emoji in Profile stats grid — should be icon
- 64rem max-width creates wide empty gutters on large monitors
- Card hover outlines could be softer
