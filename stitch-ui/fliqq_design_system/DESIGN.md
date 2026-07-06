---
name: FLIQQ Design System
colors:
  surface: '#15121b'
  surface-dim: '#15121b'
  surface-bright: '#3c3742'
  surface-container-lowest: '#100d16'
  surface-container-low: '#1d1a24'
  surface-container: '#221e28'
  surface-container-high: '#2c2833'
  surface-container-highest: '#37333e'
  on-surface: '#e8dfee'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#e8dfee'
  inverse-on-surface: '#332f39'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#b4c5ff'
  on-secondary: '#002a78'
  secondary-container: '#0053db'
  on-secondary-container: '#cdd7ff'
  tertiary: '#ffb784'
  on-tertiary: '#4f2500'
  tertiary-container: '#a15100'
  on-tertiary-container: '#ffe0cd'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb784'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#15121b'
  on-background: '#e8dfee'
  surface-variant: '#37333e'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  title-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  chat-msg:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-margin: 24px
  gutter: 16px
---

## Brand & Style
The design system for FLIQQ is built to facilitate high-energy, premium live-streaming experiences. It targets a demographic of digital-native creators and viewers who value both professional aesthetics and immersive interactivity. 

The visual style is **Glassmorphism**, characterized by translucent surfaces, vibrant background blurs, and depth through layering rather than traditional shadows. The interface feels like a high-end command center—dark, sleek, and focused on the content. By utilizing deep blacks and electric accents, the system ensures that live video feeds remain the hero while UI controls appear as sophisticated overlays.

## Colors
The palette is rooted in a deep, nocturnal base to minimize eye strain during long streaming sessions and to provide a "cinema" feel. 

- **Primary Background:** A specialized deep navy-black (#0A0A0F) that provides more depth than pure black.
- **Electric Accents:** Vibrant Purple and Electric Blue are used for interactive states, highlighting creators, and signifying "Live" status.
- **Gradients:** The Purple-to-Blue gradient is the signature "High Energy" brand mark, reserved for primary Actions (e.g., "Go Live," "Subscribe").
- **Neutral System:** Grays are avoided in favor of varying opacities of White (e.g., 60% for secondary text, 40% for disabled states) to maintain the glass effect.

## Typography
The system uses a pairing of **Geist** for high-impact technical precision and **Inter** for versatile readability.

- **Headlines:** Use Geist with tight letter-spacing and heavy weights to create a commanding, modern presence.
- **Body & Chat:** Inter is used for its exceptional legibility in high-density environments like live chat sidebars.
- **Micro-copy:** Small labels (e.g., viewer counts, timestamps) use Geist in all-caps to maintain a professional, "dashboard" aesthetic.

## Layout & Spacing
This design system utilizes a **Fluid Grid** model to accommodate various streaming aspect ratios.

- **Desktop:** 12-column grid with 24px margins. The sidebar (Chat/Navigation) typically spans 3 columns, leaving 9 columns for the primary video viewport.
- **Mobile:** Single column with 16px safe-area margins. UI elements are docked to the bottom to allow for "thumb-friendly" interaction during vertical streams.
- **Rhythm:** All spacing follows a 4px base unit. Component internal padding should favor `md` (16px) or `lg` (24px) to maintain the airy, premium feel.

## Elevation & Depth
Depth in the design system is achieved through **Tonal Layering** and **Background Blurs** rather than heavy shadows.

1.  **Base Layer:** The deepest background (#0A0A0F).
2.  **Surface Layer:** Semi-transparent white (5% opacity) with a 20px backdrop blur. This is used for cards, sidebars, and navigation bars.
3.  **Overlay Layer:** Floating menus or modals use a higher opacity (10%) and more intense blur (40px) to distinguish themselves from the surface.
4.  **Accents:** Thin 1px borders (rgba 255, 255, 255, 0.1) are applied to all glass elements to define their edges against the dark background.

## Shapes
The shape language is ultra-modern and soft, contrasting with the technical nature of the typography.

- **Standard Elements:** Buttons, inputs, and small cards use a 0.5rem (8px) radius.
- **Primary Containers:** Video players, feed cards, and main glass overlays use a **Large** radius (1rem / 16px) or **Extra Large** (1.5rem / 24px) to create a friendly, approachable feel within the dark environment.
- **Avatars:** Always circular to distinguish people from content containers.

## Components
Consistent styling of these key elements ensures a cohesive experience:

- **Buttons:**
    - *Primary:* Vibrant Gradient (Purple to Blue) with white text. No border.
    - *Secondary:* Glass surface (5% white) with a 1px white border (10% opacity).
- **Chips (Live Tags):** Small, rounded containers with a background of 10% Primary Purple. Use a "Live" pulse icon for active streams.
- **Input Fields:** Darker than the background (#050507) with a 1px border that glows Purple when focused.
- **Cards:** Glassmorphic surfaces with a 16px corner radius. The content should have a 1px subtle top-highlight to simulate light hitting the glass edge.
- **Live Chat:** Messages should have high contrast between the username (Primary Purple) and the message text (80% White).
- **Stream Overlays:** Use "Floating" glass panels for viewer stats and gift animations to avoid blocking the stream content.