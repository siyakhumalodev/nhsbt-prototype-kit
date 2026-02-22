# NHSBT Prototype Kit — Functional Specification

## 1. Overview

### 1.1 Purpose

The NHSBT Prototype Kit is a rapid prototyping tool that enables designers, developers, and product teams at **NHS Blood and Transplant (NHSBT)** to quickly create realistic HTML prototypes of internal and public-facing digital services. It mirrors the approach of the NHS.UK Prototype Kit but is specifically tailored to NHSBT's distinct branding, services, and design language.

### 1.2 Scope

This document describes **what** the prototype kit does from a user/functional perspective. It covers:

- Who uses the kit and why
- Core capabilities
- Page templates and components
- Data handling
- Routing and navigation
- Deployment model

### 1.3 Target Users

| Role | Usage |
|---|---|
| **Interaction/UX Designers** | Build clickable prototypes for user research sessions |
| **Service Designers** | Map end-to-end journeys across NHSBT services |
| **Content Designers** | Draft and preview content in realistic page layouts |
| **Developers** | Quickly spike UI ideas before production implementation |
| **Product Owners** | Review and sign-off proposed user journeys |

---

## 2. Functional Requirements

### 2.1 Prototype Creation

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Users can create new pages by adding `.html` (Nunjucks) files to the `app/views/` directory | Must |
| FR-02 | Pages automatically inherit the NHSBT-branded layout (header, footer, typography, colours) | Must |
| FR-03 | Users can override the header and footer on a per-page or global basis | Must |
| FR-04 | The kit provides a library of pre-imported Nunjucks macros for all supported UI components | Must |
| FR-05 | A default index/home page is provided as a starting point | Must |
| FR-06 | Users can set a global service name that appears in the header and page titles | Must |

### 2.2 Live Reload & Development Experience

| ID | Requirement | Priority |
|---|---|---|
| FR-07 | Changes to HTML, Sass, and JavaScript files are automatically detected and the browser refreshes | Must |
| FR-08 | The kit uses Nodemon + BrowserSync for watch/reload in development mode | Must |
| FR-09 | Sass files are compiled automatically via esbuild with the sass plugin | Must |
| FR-10 | JavaScript entry points are bundled automatically via esbuild | Must |
| FR-11 | The development server starts on a configurable port (default `3000`) | Must |
| FR-12 | If the default port is in use, the kit prompts the user to choose an alternative | Should |

### 2.3 Routing

| ID | Requirement | Priority |
|---|---|---|
| FR-13 | Users can define custom Express routes in `app/routes.js` | Must |
| FR-14 | The kit supports **auto-routing**: any `.html` file placed in `app/views/` is automatically served at its corresponding URL path (e.g. `app/views/start.html` → `/start`) | Must |
| FR-15 | Custom routes take precedence over auto-routes | Must |
| FR-16 | POST requests are automatically redirected to GET (PRG pattern) to support form prototyping | Must |

### 2.4 Form Data & Session Management

| ID | Requirement | Priority |
|---|---|---|
| FR-17 | All form inputs are automatically stored in the user's session (`req.session.data`) | Must |
| FR-18 | Session data is available in all Nunjucks templates via the `data` variable | Must |
| FR-19 | Default session data can be configured in `app/data/session-data-defaults.js` | Must |
| FR-20 | A "Reset data" link/route is provided to clear session data back to defaults | Must |
| FR-21 | Sessions expire after 4 hours of inactivity | Should |

### 2.5 Templating & Components

| ID | Requirement | Priority |
|---|---|---|
| FR-22 | The kit uses **Nunjucks** as its templating engine | Must |
| FR-23 | Users can create custom Nunjucks filters in `app/filters.js` | Must |
| FR-24 | Users can set additional template locals via `app/locals.js` | Must |
| FR-25 | The base template extends a master layout that provides NHSBT branding | Must |
| FR-26 | All common UI components are available as Nunjucks macros (see Component List below) | Must |

### 2.6 Error Handling

| ID | Requirement | Priority |
|---|---|---|
| FR-27 | A styled 404 "Page not found" page is displayed for unmatched routes | Must |
| FR-28 | A styled 500 error page is displayed for server errors | Must |

### 2.7 Production / Hosting

| ID | Requirement | Priority |
|---|---|---|
| FR-29 | The kit can run in production mode (`NODE_ENV=production`) | Must |
| FR-30 | In production mode, a simple password authentication screen is shown to prevent public access to prototypes | Must |
| FR-31 | Security headers are applied in production mode | Must |

---

## 3. Component Library

The prototype kit must provide the following Nunjucks macros, pre-imported and ready to use in any page template. These components are adapted from the NHS.UK Design System but themed for NHSBT.

| Component | Nunjucks Macro | Description |
|---|---|---|
| Action Link | `{{ actionLink({...}) }}` | Link styled as a call-to-action |
| Back Link | `{{ backLink({...}) }}` | Navigation link to go back |
| Breadcrumb | `{{ breadcrumb({...}) }}` | Hierarchical navigation trail |
| Button | `{{ button({...}) }}` | Primary, secondary, and warning buttons |
| Card | `{{ card({...}) }}` | Content card with optional image/link |
| Character Count | `{{ characterCount({...}) }}` | Textarea with live character count |
| Checkboxes | `{{ checkboxes({...}) }}` | Checkbox group with labels and hints |
| Contents List | `{{ contentsList({...}) }}` | Numbered/linked contents navigation |
| Date Input | `{{ dateInput({...}) }}` | Day / Month / Year input group |
| Details | `{{ details({...}) }}` | Expandable content section |
| Do/Don't List | `{{ list({...}) }}` | Lists of things to do or avoid |
| Error Message | `{{ errorMessage({...}) }}` | Inline error message for form fields |
| Error Summary | `{{ errorSummary({...}) }}` | Summary box of errors at top of page |
| Fieldset | `{{ fieldset({...}) }}` | Group of related form fields |
| File Upload | `{{ fileUpload({...}) }}` | File upload input |
| Footer | `{{ footer({...}) }}` | Page footer with links and branding |
| Header | `{{ header({...}) }}` | Page header with logo and navigation |
| Hero | `{{ hero({...}) }}` | Full-width hero banner |
| Hint | `{{ hint({...}) }}` | Helper text for form fields |
| Image | `{{ image({...}) }}` | Responsive image component |
| Input | `{{ input({...}) }}` | Text input field |
| Inset Text | `{{ insetText({...}) }}` | Bordered inset text block |
| Label | `{{ label({...}) }}` | Form field label |
| Notification Banner | `{{ notificationBanner({...}) }}` | Success/info notification |
| Pagination | `{{ pagination({...}) }}` | Previous/next page navigation |
| Panel | `{{ panel({...}) }}` | Confirmation/success panel |
| Password Input | `{{ passwordInput({...}) }}` | Password field with show/hide |
| Radios | `{{ radios({...}) }}` | Radio button group |
| Select | `{{ select({...}) }}` | Dropdown select input |
| Skip Link | `{{ skipLink({...}) }}` | Accessibility skip-to-content link |
| Summary List | `{{ summaryList({...}) }}` | Key-value summary display |
| Table | `{{ table({...}) }}` | Data tables |
| Tabs | `{{ tabs({...}) }}` | Tabbed content sections |
| Tag | `{{ tag({...}) }}` | Status tag/badge |
| Task List | `{{ taskList({...}) }}` | Task list with statuses |
| Textarea | `{{ textarea({...}) }}` | Multi-line text input |
| Warning Callout | `{{ warningCallout({...}) }}` | Important warning message box |

---

## 4. User Journeys

### 4.1 Getting Started

1. User clones the NHSBT Prototype Kit repository
2. Runs `npm install` to install dependencies
3. Runs `npm start` to start the development server
4. Opens `http://localhost:3000` in a browser
5. Sees the NHSBT-branded index page with the configured service name

### 4.2 Creating a New Page

1. User creates a new `.html` file in `app/views/` (e.g. `app/views/register.html`)
2. The file extends `layout.html` using `{% extends 'layout.html' %}`
3. User adds content using Nunjucks macros and HTML inside `{% block content %}`
4. The page is immediately available at `/register` in the browser

### 4.3 Building a Multi-Step Form

1. User creates pages for each step (e.g. `step-1.html`, `step-2.html`, `check-answers.html`)
2. Each page contains a form with `method="post"` and `action="/step-2"` etc.
3. Form data is automatically saved to `req.session.data`
4. On the check-answers page, user displays stored data using `{{ data['field-name'] }}`
5. Branching logic can be added in `app/routes.js`

### 4.4 Resetting a Prototype

1. User clicks the "Reset data" link in the footer
2. Session data is cleared and replaced with defaults from `session-data-defaults.js`
3. User is redirected back to the current page

---

## 5. NHSBT Service Domains

The prototype kit should support prototyping services across all NHSBT divisions:

| Domain | Example Services |
|---|---|
| **Blood Donation** | Appointment booking, donor registration, eligibility checking |
| **Organ Donation** | Donor registration, consent management, family approach workflows |
| **Platelet Donation** | Appointment scheduling, donor information |
| **Plasma Donation** | Eligibility screening, session booking |
| **Stem Cell Donation** | Registry management, matching workflows |
| **Tissue Donation** | Referral and consent processes |
| **Diagnostic & Therapeutic Services** | Specialist lab services, therapeutic apheresis referrals |
| **Internal Operations** | Staff dashboards, supply chain management, logistics |
| **Research** | Clinical trial management, data collection forms |

---

## 6. Non-Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-01 | The kit must be usable by non-developers (designers and content people) with minimal setup | Must |
| NFR-02 | Prototypes must meet WCAG 2.2 AA accessibility standards through the component library | Must |
| NFR-03 | The kit must work on Windows, macOS, and Linux | Must |
| NFR-04 | Node.js v22.11.0 or v24.11.0 required | Must |
| NFR-05 | The kit must start within 10 seconds on a standard development machine | Should |
| NFR-06 | The kit must support deployment to common PaaS platforms (e.g. Heroku, Azure Web Apps) | Should |

---

## 7. Out of Scope

- Production-grade application code
- Backend API integrations (prototypes use mock data only)
- User authentication beyond simple password protection for hosted prototypes
- Database or persistent storage (session data is ephemeral)
- Automated testing of prototypes
