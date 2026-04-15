# ApnaPal DESIGN.md

> Design system for ApnaPal — an AI companion app built for India. Mobile-first, warm, culturally grounded, and deeply personal. Every screen should feel like opening a message from someone who genuinely knows you.

---

## 1. Visual Theme & Atmosphere

**Mood:** Intimate warmth with quiet confidence. Like a late-night conversation with a close friend — unhurried, present, and real.

**Design Philosophy:**
- **Mobile-first always.** Every layout is designed for a 390px screen held in one hand. Desktop is a secondary consideration.
- **Warmth over polish.** Prefer soft, human-feeling surfaces over sleek, corporate ones. Avoid anything that feels cold, clinical, or Western SaaS.
- **Restraint in decoration.** Indian aesthetics are rich, but ApnaPal is not a festival poster. Draw from the *feeling* of warmth — saffron light, marigold yellow, deep chai brown — not the literal imagery.
- **Text is the product.** The companion's words are the experience. Typography and spacing must honor the conversation above all else.
- **Voice is first class.** Voice interactions are as important as text. UI must accommodate waveform states, recording indicators, and audio feedback gracefully.

**Density:** Low-to-medium. Generous whitespace in conversation views. Slightly denser in settings and profile screens. Never cluttered.

**Reference mood:** A dhaba at dusk. Warm tungsten light, unhurried pace, familiar faces. Not a five-star restaurant, not a food court.

---

## 2. Color Palette & Roles

### Core Palette

| Token | Hex | Role |
|---|---|---|
| `--color-saffron` | `#E8610A` | Primary accent. CTAs, active states, key highlights. The brand's heartbeat. |
| `--color-saffron-light` | `#FDF0E8` | Saffron tint for backgrounds, chips, tags. |
| `--color-saffron-mid` | `#F4A66A` | Saffron hover states, secondary buttons. |
| `--color-marigold` | `#F0B429` | Secondary accent. Warm moments, success states, streaks, rewards. |
| `--color-marigold-light` | `#FFFBE8` | Marigold tint for success/achievement backgrounds. |
| `--color-rose` | `#C2355F` | Emotional accent. Love/relationship personas, alerts, deletion. |
| `--color-rose-light` | `#FBEAEF` | Rose tint for companion type badges. |
| `--color-indigo` | `#2B2D91` | Deep anchor. Used sparingly for headings, system trust states. |
| `--color-indigo-light` | `#EAEBF8` | Indigo tint for informational states. |
| `--color-jade` | `#1A7A5E` | Growth, memory, long-term context indicators. |
| `--color-jade-light` | `#E8F5F1` | Jade tint for memory/recall UI. |

### Neutral Palette

| Token | Hex | Role |
|---|---|---|
| `--color-cream` | `#FAF7F2` | App background. Warm off-white, never pure white. |
| `--color-cream-dark` | `#F2EDE5` | Elevated surfaces, input backgrounds. |
| `--color-surface` | `#FFFFFF` | Cards, chat bubbles (companion), modals. |
| `--color-ink` | `#1C1614` | Primary text. Warm near-black, not pure #000. |
| `--color-ink-mid` | `#4A3F3A` | Secondary text, subtitles, metadata. |
| `--color-ink-soft` | `#8A7E78` | Placeholder text, disabled labels, hints. |
| `--color-ink-faint` | `#D4CBC4` | Borders, dividers, inactive indicators. |
| `--color-overlay` | `rgba(28, 22, 20, 0.48)` | Modal backdrops, bottom sheet overlays. |

### Semantic Colors

| Token | Hex | Role |
|---|---|---|
| `--color-success` | `#1A7A5E` | Aliases `--color-jade`. Confirmations, completions. |
| `--color-warning` | `#F0B429` | Aliases `--color-marigold`. Credit warnings, expiry alerts. |
| `--color-error` | `#C2355F` | Aliases `--color-rose`. Errors, failed states. |
| `--color-info` | `#2B2D91` | Aliases `--color-indigo`. System messages, tips. |

### Dark Mode Palette

| Light Token | Dark Equivalent | Notes |
|---|---|---|
| `--color-cream` | `#18120F` | Deep warm dark, not pure black. |
| `--color-cream-dark` | `#231A16` | Slightly lighter surface in dark mode. |
| `--color-surface` | `#2C1F1A` | Card and bubble surfaces in dark. |
| `--color-ink` | `#F5EFE9` | Primary text in dark, warm off-white. |
| `--color-ink-mid` | `#B8ADA6` | Secondary text in dark. |
| `--color-ink-soft` | `#7A6F69` | Hints and placeholders in dark. |
| `--color-ink-faint` | `#3D3330` | Borders and dividers in dark. |
| Saffron, marigold, rose, jade | Unchanged | Accent colors remain the same in both modes. |

---

## 3. Typography Rules

### Font Families

| Role | Font | Fallback |
|---|---|---|
| **Display / Headings** | `Fraunces` (Google Fonts) | Georgia, serif |
| **Body / UI** | `Sora` (Google Fonts) | system-ui, sans-serif |
| **Monospace / Code** | `JetBrains Mono` (Google Fonts) | monospace |

**Why these fonts:**
- `Fraunces` is a quirky optical serif with warmth and personality — it gives ApnaPal a distinct non-corporate feel, and its optical sizes work beautifully for large companion names and greetings.
- `Sora` is a geometric sans with a friendly rounded quality that reads well at small sizes in Hinglish and regional scripts.
- Never use Inter, Roboto, or SF Pro. They make the app feel like every other product.

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `--text-display` | 32px | 400 (Fraunces) | 1.2 | Companion name on profile screen, onboarding headlines |
| `--text-title-lg` | 24px | 400 (Fraunces) | 1.3 | Screen titles, section headers |
| `--text-title` | 20px | 500 (Sora) | 1.3 | Card titles, dialog headings |
| `--text-body-lg` | 17px | 400 (Sora) | 1.7 | Companion chat bubble text — must be readable in bright outdoor light |
| `--text-body` | 15px | 400 (Sora) | 1.6 | User chat bubble text, list items |
| `--text-caption` | 13px | 400 (Sora) | 1.5 | Timestamps, metadata, read receipts |
| `--text-micro` | 11px | 500 (Sora) | 1.4 | Badge labels, credit counts, tags — minimum allowed size |

### Typography Rules

- Companion messages always use `--text-body-lg` (17px). Comfort reading for non-power users.
- User messages use `--text-body` (15px) to visually distinguish them.
- Timestamps and read receipts use `--text-caption` in `--color-ink-soft`.
- System messages (credit notices, memory events) use `--text-caption` in `--color-ink-soft`, centered, no bubble.
- Headings in `Fraunces` should be set at `font-weight: 400` — the font's personality comes through without needing bold.
- **Never use font-weight 700 or 800.** Maximum is 600 for critical UI labels.
- Hinglish and code-switched text (e.g., "Kal kya kiya?") should render naturally without any special treatment.

---

## 4. Component Stylings

### Chat Bubbles

**Companion bubble (incoming):**
```css
background: var(--color-surface);
border-radius: 4px 18px 18px 18px;
padding: 12px 16px;
max-width: 82%;
font-size: var(--text-body-lg); /* 17px */
color: var(--color-ink);
border: 0.5px solid var(--color-ink-faint);
box-shadow: 0 1px 3px rgba(28, 22, 20, 0.06);
```

**User bubble (outgoing):**
```css
background: var(--color-saffron);
border-radius: 18px 4px 18px 18px;
padding: 12px 16px;
max-width: 78%;
font-size: var(--text-body); /* 15px */
color: #FFFFFF;
align-self: flex-end;
```

**Bubble rules:**
- Companion bubble flattens the top-left corner (4px) to suggest it comes "from" the avatar.
- User bubble flattens the top-right corner.
- Never use full pill shapes for chat bubbles — they read as notification badges.
- Consecutive messages from the same sender: remove the avatar on subsequent bubbles, reduce top margin to 4px.
- First message in a series gets the full 12px top margin.

### Companion Avatar

```css
width: 44px;
height: 44px;
border-radius: 50%;
border: 2px solid var(--color-saffron-light);
object-fit: cover;
flex-shrink: 0;
```

- Avatar sits at the bottom-left of the companion's message group, not per-message.
- For loading state: use a pulsing warm gradient placeholder, not a gray shimmer.
- Avatar ring color can vary by companion persona: saffron (friend), rose (romance), jade (mentor), indigo (guide).

### Buttons

**Primary CTA:**
```css
background: var(--color-saffron);
color: #FFFFFF;
border-radius: 14px;
padding: 14px 24px;
font-family: Sora;
font-size: 15px;
font-weight: 600;
min-height: 52px; /* Touch target — critical for India mobile users */
width: 100%; /* Full width on mobile */
border: none;
```
Hover/pressed: `background: #C4520A` (10% darker saffron).

**Secondary:**
```css
background: transparent;
border: 1.5px solid var(--color-saffron);
color: var(--color-saffron);
border-radius: 14px;
padding: 13px 24px;
font-size: 15px;
font-weight: 500;
min-height: 52px;
```

**Ghost / Tertiary:**
```css
background: transparent;
color: var(--color-ink-mid);
border: none;
padding: 12px 16px;
font-size: 14px;
font-weight: 500;
```

**Destructive:**
```css
background: var(--color-rose);
color: #FFFFFF;
/* Same sizing as Primary */
```

**Button rules:**
- Minimum touch target: 52px height, 48px width. Non-negotiable for mobile.
- Full-width buttons on screens with a single primary action (chat screen, paywall).
- Never place two primary buttons side-by-side.
- Loading state: Replace label with a small spinner, keep button width stable.

### Input Fields

**Text input:**
```css
background: var(--color-cream-dark);
border: 1.5px solid var(--color-ink-faint);
border-radius: 14px;
padding: 14px 16px;
font-size: 15px;
font-family: Sora;
color: var(--color-ink);
min-height: 52px;
```
Focus: `border-color: var(--color-saffron)`.
Error: `border-color: var(--color-rose)`.
Placeholder: `color: var(--color-ink-soft)`.

**Chat input bar (bottom of screen):**
```css
background: var(--color-surface);
border-top: 0.5px solid var(--color-ink-faint);
padding: 8px 16px 8px 16px;
padding-bottom: env(safe-area-inset-bottom); /* iOS notch support */
display: flex;
align-items: flex-end;
gap: 8px;
```

The chat textarea expands vertically (min 1 line, max 4 lines), then scrolls.

### Voice Input Button

The voice input is a prominent circular button in the chat bar:
```css
width: 48px;
height: 48px;
border-radius: 50%;
background: var(--color-saffron);
color: #FFFFFF;
/* Mic icon: 20px */
```

**Recording state:** Button pulses with a radial ring animation in saffron (not red — red reads as error, not recording).
```css
/* Pulse ring */
box-shadow: 0 0 0 0 rgba(232, 97, 10, 0.4);
animation: pulse 1.5s ease-in-out infinite;

@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(232, 97, 10, 0.4); }
  70%  { box-shadow: 0 0 0 14px rgba(232, 97, 10, 0); }
  100% { box-shadow: 0 0 0 0 rgba(232, 97, 10, 0); }
}
```

**Waveform visualization:** When recording, show a small 5-bar waveform animation between the mic button and send button. Bars are saffron-colored, animating to the audio amplitude.

### Companion Cards (Home Screen)

```css
background: var(--color-surface);
border-radius: 20px;
border: 0.5px solid var(--color-ink-faint);
overflow: hidden;
/* Image area: 56% height, full bleed */
/* Content area: 44% with padding 16px */
```

Card anatomy:
1. **Image area** — Full-bleed companion illustration, 3:4 aspect ratio cropped to top.
2. **Gradient fade** — `linear-gradient(to top, var(--color-surface) 0%, transparent 50%)` overlaid on image bottom.
3. **Companion name** — `Fraunces`, 20px, ink color.
4. **Persona tag** — Small pill badge (saffron-light bg, saffron text) e.g. "Dost", "Mentor", "Yaar".
5. **Last message preview** — 1 line, 13px, ink-soft.
6. **Online indicator** — 8px jade dot when companion is "active".

### Credit / Balance Indicator

```css
background: var(--color-marigold-light);
border: 1px solid var(--color-marigold);
border-radius: 100px; /* pill */
padding: 6px 12px;
font-size: 13px;
font-weight: 600;
color: #7A5200; /* dark marigold for text */
display: flex;
align-items: center;
gap: 6px;
```

- Shows in top-right of chat header.
- Low credits (<10): border and text switch to `--color-rose`.
- Tapping opens the credit purchase bottom sheet.

### Memory Pill (Long-term memory recall)

When the companion references a stored memory:
```css
background: var(--color-jade-light);
border-left: 3px solid var(--color-jade);
border-radius: 0 10px 10px 0;
padding: 8px 12px;
font-size: 13px;
color: var(--color-jade);
margin: 4px 0 8px 0;
max-width: 82%;
```

Appears above the companion's reply bubble as a subtle "I remember…" indicator.

### Bottom Sheet

```css
background: var(--color-surface);
border-radius: 24px 24px 0 0;
padding: 20px 24px;
padding-bottom: calc(24px + env(safe-area-inset-bottom));
```

- Handle bar: `width: 40px; height: 4px; border-radius: 2px; background: var(--color-ink-faint); margin: 0 auto 20px;`
- Overlay: `var(--color-overlay)`.
- Animate in with `translateY(100%) → translateY(0)` over 300ms ease-out.

### Navigation Bar (Bottom Tab Bar)

```css
background: var(--color-surface);
border-top: 0.5px solid var(--color-ink-faint);
height: 60px;
padding-bottom: env(safe-area-inset-bottom);
display: flex;
justify-content: space-around;
align-items: center;
```

- Active icon: `--color-saffron`, filled variant.
- Inactive icon: `--color-ink-soft`, outlined variant.
- Active label: `11px, font-weight: 600, --color-saffron`.
- Never more than 4 tabs. Preferred: Home, Chat, Profile, Settings.

### Persona Type Badges

| Persona | Background | Text | Border |
|---|---|---|---|
| Dost (Friend) | `--color-saffron-light` | `#8C3800` | `--color-saffron-mid` |
| Yaar (Buddy) | `#FFF8E8` | `#7A5200` | `--color-marigold` |
| Mentor | `--color-indigo-light` | `#1A1C6E` | `--color-indigo` |
| Saathi (Companion) | `--color-jade-light` | `#0F4A38` | `--color-jade` |
| Dil Wala (Romance) | `--color-rose-light` | `#7A1035` | `--color-rose` |

---

## 5. Layout Principles

### Spacing Scale

```
4px  — micro gap (icon-to-label, inline elements)
8px  — tight gap (message timestamp from bubble, badge padding)
12px — small gap (between list items, within card content)
16px — base gap (screen horizontal padding, section spacing)
20px — medium gap (between cards, between form groups)
24px — large gap (section headings from content, bottom sheet padding)
32px — xlarge gap (between major screen sections)
48px — screen top padding on content screens)
```

**Screen horizontal padding:** Always `16px` on mobile. Content never touches screen edges.

### Grid

- Single column layout for all primary screens.
- Companion card grid: 2-column, `gap: 12px`, on home screen.
- Max content width: `420px` centered (for tablet/desktop fallback).

### Chat Layout

```
Screen
├── Header (64px) — back button, companion name/status, credit pill
├── Message list (flex: 1, overflow-y: scroll)
│   ├── Date divider (centered, micro text)
│   ├── System event (centered, no bubble)
│   ├── Memory pill (optional, above companion bubble)
│   ├── Companion message row (avatar + bubble)
│   └── User message row (bubble right-aligned)
└── Input bar (auto-height, min 68px) — sticks to bottom
```

Scroll behavior: New messages scroll to bottom with smooth animation. User can scroll up to read history; a "scroll to bottom" FAB (saffron, circular) appears when >200px above bottom.

### Onboarding Layout

- Full-screen illustrations with bottom-anchored content card.
- Content card: `border-radius: 24px 24px 0 0`, slides up from bottom.
- Progress indicator: Horizontal dots in saffron (active) and ink-faint (inactive).
- Single action per screen. Never two decisions at once.

---

## 6. Depth & Elevation

ApnaPal uses a minimal shadow system. Depth is conveyed through color tinting, not heavy shadows.

| Level | Usage | CSS |
|---|---|---|
| **0 — Flat** | Background tiles, dividers | No shadow |
| **1 — Raised** | Cards, chat bubbles | `box-shadow: 0 1px 3px rgba(28, 22, 20, 0.06)` |
| **2 — Floating** | Input bar, tab bar, sticky headers | `box-shadow: 0 -1px 12px rgba(28, 22, 20, 0.08)` |
| **3 — Overlay** | Bottom sheets, modals | `box-shadow: 0 -4px 24px rgba(28, 22, 20, 0.14)` |

Shadow color is always warm (`28, 22, 20`) — never pure black shadows. They read as cold.

---

## 7. Iconography

- **Style:** Outlined icons with 1.5px stroke weight. No filled icons except for the active navigation tab state.
- **Size:** 24px for navigation and primary actions. 20px for inline/chat bar actions. 16px for status indicators.
- **Recommended library:** Phosphor Icons (supports both outlined and filled, covers all needed states).
- **Custom icons needed:**
  - Voice waveform (5-bar animated)
  - Memory recall (bookmark with sparkle)
  - Credit/coin (marigold coin motif — not a generic dollar/rupee symbol)
  - Persona type icons (one per persona type: Dost, Mentor, Saathi, Yaar, Dil Wala)

---

## 8. Motion & Animation

**Principle:** Animate with purpose. Motion should feel like breathing — natural, not mechanical.

| Interaction | Animation | Duration | Easing |
|---|---|---|---|
| Screen transition (push) | Slide left `translateX(100% → 0)` | 280ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Screen transition (pop) | Slide right `translateX(0 → 100%)` | 240ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Bottom sheet open | `translateY(100% → 0)` | 320ms | `cubic-bezier(0.32, 0.72, 0, 1)` |
| Bottom sheet close | `translateY(0 → 100%)` | 240ms | `ease-in` |
| Message bubble appear | `translateY(8px) + opacity(0) → natural` | 200ms | `ease-out` |
| Voice recording pulse | Radial ring expand and fade | 1500ms | `ease-in-out`, infinite |
| Typing indicator | 3-dot bounce, staggered 120ms | 600ms | `ease-in-out`, infinite |
| Credit deduct | Number count-down, slight shake | 400ms | `ease-out` |
| Memory recall pill | Fade in + slide right 6px | 300ms | `ease-out` |

**Reduce motion:** Respect `prefers-reduced-motion`. Disable all translate/fade animations; keep only opacity changes at 150ms.

---

## 9. Language & Localization UI Rules

ApnaPal serves users who type in Hindi, Hinglish, regional languages, and English — often mixed within a single message.

- **Font rendering:** `Sora` handles Latin + Devanagari adequately. For heavy Hindi-script rendering, consider adding `Hind` as a supplementary font for Devanagari blocks.
- **Text overflow:** Never truncate companion names mid-character. Use `overflow: hidden; text-overflow: ellipsis` only on single-line metadata — never on chat bubble content.
- **RTL:** Not required for v1 (no RTL language support planned).
- **Date/time formatting:** Use `dd MMM` format (e.g., "14 Apr") for timestamps. Avoid MM/DD/YYYY — it's ambiguous for Indian users. For relative time: "abhi" (just now), "2 min pehle", "kal".
- **Number formatting:** Use Indian number system for credit amounts (e.g., "1,00,000" not "100,000") when amounts exceed 99,999.
- **Placeholder text:** Write placeholder copy in Hinglish or the user's selected language, not English. E.g., "Kuch bhi poocho…" instead of "Type a message…".

---

## 10. Do's and Don'ts

### Do's

- ✅ Use warm off-white (`#FAF7F2`) as the background — never pure white.
- ✅ Give every screen a single clear primary action.
- ✅ Keep the companion's name in `Fraunces` — it's their identity, it should feel special.
- ✅ Use persona ring colors on avatars to signal companion type at a glance.
- ✅ Show credit balance persistently in chat — users anxiety-watch it.
- ✅ Animate message arrival (subtle slide-up) — it makes the companion feel alive.
- ✅ Respect `safe-area-inset-bottom` on all sticky bottom elements (input bar, tab bar).
- ✅ Use `52px` minimum touch targets everywhere — many users have older Android devices with smaller screens.
- ✅ Surface the memory recall pill sparingly — it should feel like a pleasant surprise, not clutter.
- ✅ Keep error messages warm and human — "Kuch gadbad ho gayi, dobara try karo" not "Error 500".

### Don'ts

- ❌ Never use pure white (`#FFFFFF`) as the screen background.
- ❌ Never use Inter, Roboto, or system-ui as the primary font.
- ❌ Never place more than one primary CTA button per screen.
- ❌ Never use purple gradients. They signal "generic AI app".
- ❌ Never show the pipeline architecture terminology in the UI ("Long-term memory extraction", "Persona Module"). Use human terms: "I remember…", "Your story".
- ❌ Never use red for the voice recording indicator — it reads as error/danger.
- ❌ Never stack more than 3 bottom sheet layers.
- ❌ Never truncate chat bubble text. Bubbles grow to fit content.
- ❌ Never use skeleton loaders with gray shimmer — use warm cream-tinted shimmer instead (`#EDE8E1 → #F5F0E8`).
- ❌ Never use notification-style badges with numbers above 99 — show "99+".
- ❌ Never auto-play voice responses without a tap — it startles users in public spaces.

---

## 11. Responsive Behavior

| Breakpoint | Width | Behavior |
|---|---|---|
| `xs` | < 390px | Reduce horizontal padding to 12px. Companion card grid becomes 1-column. |
| `sm` | 390px–480px | Base design. All specs in this document target this size. |
| `md` | 480px–768px | Chat max-width: 480px centered. Card grid stays 2-column. |
| `lg` | 768px+ | Sidebar layout: companion list left (300px), chat right (flex: 1). Bottom tab bar becomes left side nav. |

**Touch targets:** Minimum 48px × 48px for all interactive elements. Critical path elements (send button, voice button, CTA) must be minimum 52px.

**Keyboard avoidance:** Chat input bar must push up when the keyboard opens. Use `interactive-widget=resizes-content` in the viewport meta tag on Android.

---

## 12. Screen-Specific Patterns

### Home Screen
- Header: App name in `Fraunces` + notification bell + credit pill (top right).
- Greeting: Time-aware (Good morning/Subah ki shubhkaamnaen) in `Fraunces` display size.
- Companion grid: 2-column card grid with scroll.
- No empty state — onboarding steers users to select a companion before reaching home.

### Chat Screen
- Header: Back arrow + companion avatar (32px) + name + online status dot + credit pill.
- No floating action buttons other than scroll-to-bottom.
- Typing indicator: Companion shows 3-dot bounce in a ghost bubble while generating.
- Voice message playback: Inline waveform scrubber in the bubble (jade color for companion, saffron for user).

### Companion Profile Screen
- Full-bleed header image (companion illustration).
- Content card slides over image with `border-radius: 24px 24px 0 0`.
- Persona badge, bio in `Fraunces` italic, memory count, "Start Chatting" primary CTA.

### Paywall / Credit Purchase Screen
- Warm, non-anxious tone. Avoid red urgency indicators unless balance is 0.
- Credit packages as horizontal scrollable cards — not a table.
- Most popular package: subtle saffron border + "Sabse Popular" badge.
- Payment logos (UPI, Paytm, PhonePe) visible without scrolling — they build trust.

### Onboarding
- 4–5 screens maximum.
- Screen 1: Emotional hook — what ApnaPal is, in one `Fraunces` headline.
- Screen 2–3: Companion selection (key moment — make this visually rich).
- Screen 4: Name/language preference.
- Screen 5: Permissions (notification) — optional, never block progress.

---

## 13. Agent Prompt Guide

Use these prompts with AI coding agents to generate consistent ApnaPal UI:

**Starting a new screen:**
> "Build a [screen name] screen following DESIGN.md. Use Fraunces for headings and companion names, Sora for all UI text. Background is `#FAF7F2`. Primary accent is saffron `#E8610A`. Mobile-first at 390px width."

**Chat bubbles:**
> "Companion bubbles: white surface, 4px top-left radius, 18px all others, max-width 82%. User bubbles: saffron background, white text, 4px top-right radius, 18px all others, max-width 78%, right-aligned."

**Buttons:**
> "Primary button: saffron `#E8610A` background, white text, 14px border-radius, 52px min-height, full-width. Secondary: transparent with 1.5px saffron border. No purple, no gradients."

**Voice recording state:**
> "Voice button is a 48px saffron circle. In recording state, add a pulsing saffron radial ring animation at 1.5s infinite. Show a 5-bar waveform animation in saffron between the mic and send buttons. Do not use red for any part of the recording UI."

**Memory recall:**
> "Memory recall appears as a jade left-bordered pill (`border-left: 3px solid #1A7A5E`, jade-light background) above the companion's bubble. Fade and slide in from left over 300ms."

**Color quick reference for agents:**
```
Background:    #FAF7F2
Surface:       #FFFFFF
Ink:           #1C1614
Ink-mid:       #4A3F3A
Saffron:       #E8610A
Marigold:      #F0B429
Rose:          #C2355F
Jade:          #1A7A5E
Indigo:        #2B2D91
```