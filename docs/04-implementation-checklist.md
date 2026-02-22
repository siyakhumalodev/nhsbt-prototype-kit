# NHSBT Prototype Kit — Implementation Checklist

This document provides a step-by-step checklist for building the NHSBT Prototype Kit from scratch. It is designed to be used alongside the Functional Specification, Technical Specification, and Branding Guide.

---

## Phase 1: Repository & Project Setup

- [ ] Create a new GitHub repository named `nhsbt-prototype-kit`
- [ ] Initialise with `npm init` — set name to `nhsbt-prototype-kit-template`
- [ ] Set `"main": "app.js"` in package.json
- [ ] Set Node.js engine requirement: `"node": "^22.11.0 || ^24.11.0"`
- [ ] Add MIT license
- [ ] Create `.gitignore` (node_modules, public/, .cache/)
- [ ] Create the following directory structure:
  ```
  app/
    assets/images/
    assets/javascript/
    assets/sass/
    data/
    views/
  docs/
  ```

## Phase 2: Dependencies

- [ ] Install production dependencies:
  - `nhsuk-frontend` (^10.3.1) — base component library
  - `nhsuk-prototype-kit` (^8.0.1) — core prototyping engine
- [ ] Add npm scripts:
  ```json
  "scripts": {
    "start": "node .",
    "watch": "echo 'run this instead: npm start'"
  }
  ```

## Phase 3: Core Application Files

- [ ] Create `app.js` — entry point that initialises the prototype kit
- [ ] Create `app/config.js` — serviceName and port settings
- [ ] Create `app/routes.js` — Express router for custom routes
- [ ] Create `app/filters.js` — Custom Nunjucks filters
- [ ] Create `app/locals.js` — Custom template locals middleware
- [ ] Create `app/data/session-data-defaults.js` — Default session data

## Phase 4: NHSBT Branding

- [ ] Add NHSBT logo files to `app/assets/images/`:
  - `nhsbt-logo.svg` (dark-text version for white header background)
  - `nhsbt-logo-white.svg` (white version for dark backgrounds, not currently used)
  - `nhsbt-corporate-logo.svg` (footer)
  - `favicon.ico`
- [ ] Create `app/assets/sass/main.scss` with:
  - Import of `nhsuk-frontend/dist/nhsuk`
  - NHSBT colour variable overrides (15 variables — see Branding Guide §3.3)
  - Custom `.nhsbt-header` styles (white background, box-shadow, 40px logo)
  - Custom `.nhsbt-nav-bar` styles (blue service name bar)
  - Custom `.nhsbt-footer` styles (links, social icons, department buttons, corporate logo)
  - Focus state overrides
  - Responsive breakpoints
- [ ] Create `app/assets/javascript/main.js` (empty, for custom JS)

## Phase 5: Templates

- [ ] Create `app/views/layout.html`:
  - Extend `prototype-kit-template.njk`
  - Add `{% block head %}` with `<link>` to compiled CSS (`/assets/sass/main.css`)
  - Override `{% block header %}` with NHSBT header (white bg, logo, separate blue nav bar)
  - Override `{% block footer %}` with NHSBT footer (links, social, department buttons, corporate logo)
  - Include back-to-top link in footer
  - Include prototype-specific meta section with Home and Reset data links
- [ ] Create `app/views/index.html`:
  - Extend `layout.html`
  - Show service name heading
  - Include getting started links
  - Reference NHSBT service manual / documentation

## Phase 6: Documentation

- [ ] Copy docs/ folder from this project into the new repo
- [ ] Create README.md with:
  - Project description
  - Prerequisites (Node.js version)
  - Installation steps
  - How to run locally
  - How to create new pages
  - Link to NHS Design System for components

## Phase 7: Testing & Validation

- [ ] Run `npm install` successfully
- [ ] Run `npm start` and verify server starts on port `4000`
- [ ] Verify index page renders with NHSBT branding
- [ ] Verify header shows NHSBT logo on white background with box-shadow
- [ ] Verify blue service name nav bar appears below header
- [ ] Verify footer shows links, social icons, department buttons, and corporate logo
- [ ] Verify NHSBT colour scheme is applied
- [ ] Create a test page to verify auto-routing works
- [ ] Create a test form to verify session data storage works
- [ ] Verify "Reset data" link clears session
- [ ] Verify custom routes work in routes.js
- [ ] Verify custom filters work in filters.js
- [ ] Verify live reload works (change a view file, browser refreshes)

## Phase 8: Production Readiness

- [ ] Test with `NODE_ENV=production npm start`
- [ ] Verify password authentication screen appears
- [ ] Add Procfile for Heroku deployment (optional)
- [ ] Document deployment instructions

---

## File Reference

| File | Source Document |
|---|---|
| `app.js` | Technical Specification §3.1 |
| `app/config.js` | Technical Specification §3.2 |
| `app/routes.js` | Technical Specification §5, Functional Specification §2.3 |
| `app/filters.js` | Technical Specification §6.4 |
| `app/locals.js` | Functional Specification §2.5 |
| `app/data/session-data-defaults.js` | Functional Specification §2.4 |
| `app/views/layout.html` | Branding Guide §5, §6 |
| `app/views/index.html` | Functional Specification §2.1 |
| `app/assets/sass/main.scss` | Branding Guide §3.3, Technical Specification §7.3 |
| `package.json` | Technical Specification §8 |
