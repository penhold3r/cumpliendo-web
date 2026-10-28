# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who track their workouts with structure — sets, reps, weight, rest timers, circuits, supersets. They range from gym regulars building progressive overload to CrossFit/class-goers logging WODs. Some already use the Cumpliendo mobile app and want the same data on a bigger screen; others discover the web app first and may never install the native version. Spanish-speaking and English-speaking, with Spanish as the primary locale.

## Product Purpose

Full-featured web workout tracker with complete parity to the Cumpliendo React Native app. Users can plan routines, run live workouts, log past sessions, browse and create exercises, track streaks and personal records, and review history — all synced to the same Firestore backend. The web version exists so the product is accessible on any device with a browser, not gated behind an app store install, while giving desktop users the screen real estate to manage their training more comfortably.

## Positioning

A workout tracker that ships the same depth on web as native — live workout tracking with rest timers, circuit/AMRAP/superset blocks, and progressive overload metrics — without requiring an app install. Most competitors are either mobile-only or offer a stripped-down web dashboard.

## Operating Context

- Users open the web app on laptop/desktop between sessions (planning routines, reviewing history/stats) and on mobile browsers when they don't have the native app installed.
- Workout data syncs via Firestore REST API (no Firebase JS SDK). Offline-first: localStorage/IndexedDB for persistence, background sync when online.
- The app supports two languages (ES primary, EN) via i18next with cookie-based SSR detection.
- Authentication via Google Sign-In (NextAuth.js).
- Deployed to Vercel.

## Capabilities and Constraints

**Confirmed capabilities:**
- 5-section navigation: Home (stats/streaks), Train (live workout + hub), Routines (CRUD + start), Exercises (library + custom), History (session log)
- Overlay screens: Profile/Settings, Log Past Workout, Routine Editor
- Live workout: set tracking, rest timer, superset/circuit/AMRAP blocks, warmup/cooldown
- Streak tracking, 30-day rolling stats, personal records, muscle staleness
- Units: metric/imperial toggle
- Theme: system/light/dark

**Constraints:**
- Desktop-first layout that also works on mobile — NOT a 1:1 port of the mobile UI
- Uses Latty Design System exclusively (`@latty-ds/react`, `@latty-ds/tokens`, `@latty-ds/web`) — no Tailwind, no raw CSS frameworks
- Blue Grey neutral palette (Material Blue Grey scale) overriding Latty's default pure greys — must match the Android app's color language
- Funnel Display for headings, Inter for body — loaded via Google Fonts CDN through Latty's configure API
- No raw hex codes outside `src/theme/`
- Pure reducer pattern for state (WorkoutContext dispatch + workoutActions)

## Brand Commitments

- Primary: indigo `#4F46E5` (matches the Android app's MD3 primary)
- Neutrals: Material Blue Grey scale (not pure grey) — `#192024` dark bg through `#F2F4F5` light bg
- Fonts: Funnel Display (headings/display), Inter (body/UI)
- Border radius: 8px global default
- No logo or wordmark assets exist yet; the product name "Cumpliendo" is the only brand identifier
- Visual language must "speak the same language" as the Android app: icon circles with primaryContainer backgrounds, uppercase overline labels on metrics, tag/chip patterns for metadata

## Evidence on Hand

- 10 Android app reference screenshots (light + dark) at `DOCS/cumpliendo-web/app-reference/` showing Home, Train, Routines, Exercises, and History screens
- Full Android app source at `DEV/cumpliendo/` including `materialTheme.ts` (color system) and `designTokens.ts` (spacing, radius, elevation)
- PROJECT_PLAN.md at `PLANS/CumpliendoWeb/PROJECT_PLAN.md` with full component mapping and architecture decisions
- No user analytics, testimonials, or external content to reference

## Product Principles

1. **Parity, not porting.** Every feature the native app has should work on web, but the UI adapts to desktop affordances — more columns, header nav, bigger hit targets for mouse, side-by-side layouts.
2. **One data truth.** Firestore REST sync means a workout started on the phone shows up on the web and vice versa. Offline-first on both sides.
3. **Design system discipline.** Every component, token, and pattern comes through Latty DS. The Blue Grey palette and indigo brand live in overrides, not forks.
4. **Speak the same language.** The web and Android apps should feel like siblings — same color relationships, same information hierarchy, same metric card patterns — even though the layouts differ.
5. **Ship incrementally.** The app is built in phases; each phase should be usable on its own.

## Accessibility & Inclusion

- WCAG 2.1 AA as baseline (color contrast, keyboard nav, screen reader labels)
- Bilingual (ES/EN) with i18next; language detected from browser/cookie
- Metric and imperial unit support
