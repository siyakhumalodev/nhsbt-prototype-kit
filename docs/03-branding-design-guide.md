# NHSBT Prototype Kit — Branding & Design Guide

## 1. Organisation Overview

**NHS Blood and Transplant (NHSBT)** is a Special Health Authority within the NHS responsible for:
- Managing blood donation services across England
- Organ donation and transplantation across the UK
- Platelet, plasma, and stem cell donation services
- Tissue donation and banking
- Diagnostic and therapeutic specialist services
- Clinical research in transfusion and transplantation

**Website**: [https://www.nhsbt.nhs.uk/](https://www.nhsbt.nhs.uk/)  
**Tagline**: *"We help people do something extraordinary — donate blood, organs, tissues or stem cells to save someone in need"*

---

## 2. Brand Identity

### 2.1 Logo

NHSBT uses a dual-logo approach:
- **Primary**: "NHS Blood and Transplant" wordmark alongside the NHS logo
- **Corporate footer**: "NHSBT Corporate Logo" — the organisation's own identity mark

The logo must always appear in the header of the prototype kit, replacing the standard NHS logo.

**Logo placement**:
- Top-left of the header bar
- White text/logo on the NHSBT branded header background
- The logo links to the homepage (`/`)

### 2.2 Brand Relationship to NHS

NHSBT operates under the NHS brand umbrella but has its own distinct visual identity:
- Uses the NHS blue colour family as a base
- Has its own supplementary colour palette for accent and feature areas
- Uses a different header/footer structure compared to NHS.UK
- Includes division-specific sub-brands (blood.co.uk, organdonation.nhs.uk)

---

## 3. Colour Palette

### 3.1 Primary Colours

Based on the nhsbt.nhs.uk website analysis:

| Colour | Hex | Usage |
|---|---|---|
| **NHSBT Dark Blue** | `#003087` | Primary header background, primary buttons, headings |
| **NHSBT Blue** | `#005EB8` | Links, interactive elements, NHS blue identity |
| **NHSBT Light Blue** | `#41B6E6` | Accent, highlights, secondary actions |
| **White** | `#FFFFFF` | Page background, text on dark backgrounds |
| **NHSBT Dark Grey** | `#231F20` | Body text colour |
| **NHSBT Grey** | `#4C6272` | Secondary text, metadata |

### 3.2 Supporting Colours

| Colour | Hex | Usage |
|---|---|---|
| **NHSBT Red** | `#DA291C` | Blood donation theme, error states, warnings |
| **NHSBT Green** | `#009639` | Success states, organ donation theme |
| **NHSBT Yellow** | `#FAE100` | Warning callouts, focus states |
| **NHSBT Pink** | `#AE2573` | Feature areas, campaign highlights |
| **Pale Grey** | `#F0F4F5` | Section backgrounds, card backgrounds |
| **Border Grey** | `#D8DDE0` | Borders, dividers |

### 3.3 Sass Variable Overrides

```scss
// NHSBT colour overrides (in main.scss, after importing nhsuk-frontend)

$color-nhsbt-dark-blue: #003087;
$color-nhsbt-blue: #005EB8;
$color-nhsbt-light-blue: #41B6E6;
$color-nhsbt-red: #DA291C;
$color-nhsbt-green: #009639;
$color-nhsbt-yellow: #FAE100;
$color-nhsbt-pink: #AE2573;
$color-nhsbt-dark-grey: #231F20;
$color-nhsbt-grey: #4C6272;
$color-nhsbt-pale-grey: #F0F4F5;
$color-nhsbt-border-grey: #D8DDE0;
```

---

## 4. Typography

### 4.1 Font Family

NHSBT follows the NHS typography standards:

| Weight | Font | Fallback Stack |
|---|---|---|
| Regular (400) | Frutiger Light | Arial, sans-serif |
| Bold (700) | Frutiger Bold | Arial Bold, sans-serif |

**Note**: Frutiger is a licensed font. For the prototype kit, fall back to the NHS-recommended system font stack:

```scss
$nhsbt-font-family: "Frutiger W01", "Frutiger", Arial, sans-serif;
```

### 4.2 Type Scale

Following the NHS Design System's type scale:

| Element | Size (desktop) | Size (mobile) | Weight | Line Height |
|---|---|---|---|---|
| H1 (`.nhsuk-heading-xl`) | 48px | 32px | Bold | 56px / 36px |
| H2 (`.nhsuk-heading-l`) | 32px | 24px | Bold | 40px / 30px |
| H3 (`.nhsuk-heading-m`) | 24px | 20px | Bold | 32px / 28px |
| H4 (`.nhsuk-heading-s`) | 22px | 18px | Bold | 32px / 28px |
| Body (`.nhsuk-body`) | 19px | 16px | Regular | 28px / 24px |
| Body Small (`.nhsuk-body-s`) | 16px | 14px | Regular | 24px / 20px |
| Caption (`.nhsuk-caption-xl`) | 32px | 24px | Regular | 40px / 30px |

---

## 5. Header

### 5.1 NHSBT Header Structure

The NHSBT header differs from the standard NHS.UK header:

```
┌─────────────────────────────────────────────────────────────────┐
│ [Skip to main content]                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [NHSBT Logo]  NHS Blood and Transplant    [MENU ☰]            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  (Optional: Service name banner below header)                    │
│  (Optional: Navigation links)                                    │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Header Implementation

The prototype kit should provide a custom header in `layout.html`:

```html
{% block header %}
  <header class="nhsbt-header" role="banner">
    <div class="nhsuk-width-container nhsbt-header__container">
      <div class="nhsbt-header__logo">
        <a class="nhsbt-header__link" href="/" aria-label="NHS Blood and Transplant homepage">
          <!-- NHSBT Logo SVG or image -->
          <span class="nhsbt-header__logotype">
            NHS Blood and Transplant
          </span>
        </a>
      </div>
      {% if serviceName %}
        <div class="nhsbt-header__service-name">
          <a class="nhsbt-header__service-link" href="/">{{ serviceName }}</a>
        </div>
      {% endif %}
      <div class="nhsbt-header__menu">
        <button class="nhsbt-header__menu-toggle" aria-controls="header-navigation" aria-expanded="false">
          MENU
        </button>
      </div>
    </div>
  </header>
{% endblock %}
```

### 5.3 Header CSS

```scss
.nhsbt-header {
  background-color: $color-nhsbt-dark-blue;
  padding: 20px 0;
}

.nhsbt-header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nhsbt-header__link {
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.nhsbt-header__logotype {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}

.nhsbt-header__service-name {
  margin-left: 32px;
}

.nhsbt-header__service-link {
  color: #fff;
  font-size: 19px;
  font-weight: 700;
  text-decoration: none;
}

.nhsbt-header__menu-toggle {
  background: none;
  border: 2px solid #fff;
  color: #fff;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}
```

---

## 6. Footer

### 6.1 NHSBT Footer Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  Social Media Links:                                             │
│  [Facebook] [X/Twitter] [YouTube] [LinkedIn]                     │
├─────────────────────────────────────────────────────────────────┤
│  [NHSBT Corporate Logo]                                          │
├─────────────────────────────────────────────────────────────────┤
│  Additional Links:                                               │
│  Contact us | Accessibility statement | Cookies | Privacy        │
│  Jobs | Diversity and inclusion | Site map                       │
├─────────────────────────────────────────────────────────────────┤
│  Related Sites:                                                  │
│  Blood Donation | Organ Donation | Platelet Donation             │
│  Plasma Donation | Careers | ODT Clinical                        │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Footer Implementation

```html
{% block footer %}
  <footer class="nhsbt-footer" role="contentinfo">
    <div class="nhsuk-width-container">
      
      <!-- Social media links -->
      <div class="nhsbt-footer__social">
        <a href="https://www.facebook.com/nhsbloodandtransplant/" class="nhsbt-footer__social-link" target="_blank" rel="noopener">
          <span class="nhsuk-u-visually-hidden">Facebook</span>
          <!-- Facebook icon SVG -->
        </a>
        <a href="https://twitter.com/NHSBT" class="nhsbt-footer__social-link" target="_blank" rel="noopener">
          <span class="nhsuk-u-visually-hidden">X (Twitter)</span>
          <!-- X icon SVG -->
        </a>
        <a href="https://www.youtube.com/@nhsbloodandtransplant3483/videos" class="nhsbt-footer__social-link" target="_blank" rel="noopener">
          <span class="nhsuk-u-visually-hidden">YouTube</span>
          <!-- YouTube icon SVG -->
        </a>
        <a href="https://uk.linkedin.com/company/nhs-blood-and-transplant" class="nhsbt-footer__social-link" target="_blank" rel="noopener">
          <span class="nhsuk-u-visually-hidden">LinkedIn</span>
          <!-- LinkedIn icon SVG -->
        </a>
      </div>
      
      <!-- Corporate logo -->
      <div class="nhsbt-footer__logo">
        <!-- NHSBT Corporate Logo -->
      </div>
      
      <!-- Links -->
      <div class="nhsbt-footer__links">
        <ul class="nhsbt-footer__list">
          <li><a href="/contact-us">Contact us</a></li>
          <li><a href="/accessibility">Accessibility statement</a></li>
          <li><a href="/cookies">Cookies</a></li>
          <li><a href="/privacy">Privacy</a></li>
        </ul>
      </div>
      
      <!-- Prototype kit specific -->
      <div class="nhsbt-footer__meta">
        <ul class="nhsbt-footer__list">
          <li><a href="/">Home</a></li>
          <li><a href="/prototype-admin/reset?returnPage={{ currentPage | urlencode }}">Reset data</a></li>
        </ul>
      </div>
      
    </div>
  </footer>
{% endblock %}
```

---

## 7. Navigation

### 7.1 Primary Navigation

The NHSBT website uses a hamburger menu pattern with the following top-level items:

| Item | URL |
|---|---|
| How you can help | /how-you-can-help/ |
| What we do | /what-we-do/ |
| How we help | /how-we-help/ |
| Who we are | /who-we-are/ |
| News | /news/ |

### 7.2 Service Navigation

For individual service prototypes, a service-level navigation should be available:

```html
{{ header({
  service: {
    text: serviceName,
    href: "/"
  },
  primaryLinks: [
    { url: "/step-1", label: "Step 1" },
    { url: "/step-2", label: "Step 2" }
  ]
}) }}
```

---

## 8. Page Layout

### 8.1 Grid System

Uses the NHS.UK responsive grid system:

```html
<div class="nhsuk-grid-row">
  <div class="nhsuk-grid-column-two-thirds">
    <!-- Main content (66%) -->
  </div>
  <div class="nhsuk-grid-column-one-third">
    <!-- Sidebar (33%) -->
  </div>
</div>
```

Available column widths:
- `nhsuk-grid-column-full` — 100%
- `nhsuk-grid-column-three-quarters` — 75%
- `nhsuk-grid-column-two-thirds` — 66.66%
- `nhsuk-grid-column-one-half` — 50%
- `nhsuk-grid-column-one-third` — 33.33%
- `nhsuk-grid-column-one-quarter` — 25%

### 8.2 Width Container

All page content sits inside a max-width container:

```html
<div class="nhsuk-width-container">
  <!-- Content -->
</div>
```

Max width: 960px (centred)

---

## 9. Component Branding

### 9.1 Buttons

| Variant | Background | Text | Border |
|---|---|---|---|
| Primary | `#005EB8` (NHSBT Blue) | White | None |
| Secondary | Transparent | `#005EB8` | `#005EB8` |
| Reverse | White | `#005EB8` | None |
| Warning | `#DA291C` (NHSBT Red) | White | None |

### 9.2 Links

| State | Colour |
|---|---|
| Default | `#005EB8` (NHSBT Blue) |
| Hover | `#003087` (NHSBT Dark Blue) |
| Visited | `#330072` (Purple) |
| Focus | `#231F20` text on `#FAE100` yellow background |

### 9.3 Focus State

All interactive elements must have a visible focus indicator:
- **Background**: `#FAE100` (NHSBT Yellow)
- **Text**: `#231F20` (NHSBT Dark Grey)
- **Outline**: 3px solid `#231F20`

### 9.4 Cards

Cards on the NHSBT website use:
- White background with subtle box shadow
- Heading as a link in NHSBT Blue
- Body text in dark grey
- Optional image at top
- Hover state: underline on heading, slight shadow increase

### 9.5 Notification Banner / Cookie Banner

The NHSBT cookie banner and notification banners use:
- Light grey (`#F0F4F5`) background
- NHSBT Blue for action buttons
- Clear "Accept" and "Reject" button pattern

---

## 10. Imagery & Icons

### 10.1 Logo Files Required

The prototype kit must include these logo assets in `app/assets/images/`:

| File | Format | Usage |
|---|---|---|
| `nhsbt-logo.svg` | SVG | Header logo (primary) |
| `nhsbt-logo-white.svg` | SVG | Header logo on dark background |
| `nhsbt-corporate-logo.svg` | SVG | Footer corporate logo |
| `nhsbt-logo.png` | PNG | Fallback for email/print |
| `favicon.ico` | ICO | Browser favicon |
| `apple-touch-icon.png` | PNG | Mobile bookmark icon |

### 10.2 Icon Style

NHSBT uses the NHS icon set. No custom icon library is required for prototyping.

---

## 11. Accessibility Requirements

All branded components must meet:

- **WCAG 2.2 Level AA** compliance
- Minimum contrast ratio of **4.5:1** for normal text
- Minimum contrast ratio of **3:1** for large text and UI components
- Visible focus indicators on all interactive elements
- Semantic HTML structure
- ARIA labels where necessary
- Skip-to-content link
- Responsive from 320px to 1200px+

---

## 12. Responsive Breakpoints

| Breakpoint | Width | Usage |
|---|---|---|
| Mobile | < 641px | Single column, stacked layout |
| Tablet | 641px – 960px | Two-column where appropriate |
| Desktop | > 960px | Full layout with sidebars |

---

## 13. Print Styles

Prototypes should include basic print styles:
- Hide header and footer navigation
- Show URLs after links
- Black text on white background
- Remove background colours and images
