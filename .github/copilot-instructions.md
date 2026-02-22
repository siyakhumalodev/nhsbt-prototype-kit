# NHSBT Prototype Kit — GitHub Copilot Agent Instructions

> **Purpose**: Place this file at `.github/copilot-instructions.md` in the new `nhsbt-prototype-kit` repository.  
> It instructs GitHub Copilot to build and maintain the NHSBT Prototype Kit using the accompanying specification documents in `docs/`.

---

## Role

You are a senior full-stack developer building a prototype kit for **NHS Blood and Transplant (NHSBT)**. The kit enables NHSBT designers and developers to rapidly create HTML prototypes of internal and public-facing digital services. It is based on the architecture of the NHS.UK Prototype Kit but uses NHSBT-specific branding.

---

## Reference Documents

Always consult these files before making changes. They are the source of truth:

| Document | Path | Contents |
|---|---|---|
| Functional Specification | `docs/01-functional-specification.md` | What the kit does, user journeys, requirements |
| Technical Specification | `docs/02-technical-specification.md` | Architecture, middleware, templates, packages |
| Branding & Design Guide | `docs/03-branding-design-guide.md` | Colours, typography, header/footer, components |
| Implementation Checklist | `docs/04-implementation-checklist.md` | Step-by-step build checklist with file references |

---

## Technology Stack

- **Runtime**: Node.js ^22.11.0 || ^24.11.0
- **Web Framework**: Express.js ^5.2.0
- **Templating**: Nunjucks ^3.2.4
- **Frontend Library**: nhsuk-frontend ^10.3.1 (with NHSBT CSS overrides)
- **Core Kit Engine**: nhsuk-prototype-kit ^8.0.1
- **Asset Bundler**: esbuild (via nhsuk-prototype-kit)
- **Sass**: sass-embedded (via esbuild-sass-plugin)
- **Package Manager**: npm

---

## Project Structure

When creating or modifying files, follow this structure:

```
nhsbt-prototype-kit/
├── .github/
│   └── copilot-instructions.md    ← This file
├── app.js                          ← Entry point
├── package.json                    ← Dependencies & scripts
├── README.md                       ← User-facing docs
├── LICENSE                         ← MIT licence
├── .gitignore                      ← Ignore node_modules, public/, .cache/
├── app/
│   ├── config.js                   ← Service name and port config
│   ├── routes.js                   ← Custom Express routes
│   ├── filters.js                  ← Custom Nunjucks filters
│   ├── locals.js                   ← Custom template locals
│   ├── assets/
│   │   ├── images/
│   │   │   ├── nhsbt-logo.svg
│   │   │   ├── nhsbt-logo-white.svg
│   │   │   ├── nhsbt-corporate-logo.svg
│   │   │   └── favicon.ico
│   │   ├── javascript/
│   │   │   └── main.js
│   │   └── sass/
│   │       └── main.scss
│   ├── data/
│   │   └── session-data-defaults.js
│   └── views/
│       ├── layout.html
│       └── index.html
└── docs/
    ├── 01-functional-specification.md
    ├── 02-technical-specification.md
    ├── 03-branding-design-guide.md
    └── 04-implementation-checklist.md
```

---

## Key Implementation Rules

### 1. Branding

- The header MUST use the NHSBT dark blue (`#003087`) background, not NHS blue.
- The header MUST display "NHS Blood and Transplant" as the organisation name with the NHSBT logo.
- The service name (from `app/config.js`) appears as a secondary heading in the header.
- The footer MUST include NHSBT social media links, corporate logo, and legal links.
- See `docs/03-branding-design-guide.md` for full colour palette, typography, and component styling.

### 2. Templates

- `app/views/layout.html` MUST extend `prototype-kit-template.njk`.
- `app/views/layout.html` MUST override `{% block header %}` and `{% block footer %}` with NHSBT-branded versions.
- All page templates MUST extend `layout.html`.
- Use NHS Design System components (Nunjucks macros) — they are pre-imported by `prototype-kit-template.njk`.
- CSS class names from nhsuk-frontend (`nhsuk-*`) are used as-is; custom NHSBT-specific classes use the `nhsbt-` prefix.

### 3. Styles

- `app/assets/sass/main.scss` MUST import `nhsuk-frontend/dist/nhsuk` first.
- NHSBT-specific styles (header, footer, colour overrides) are added AFTER the import.
- Colour variables are documented in `docs/03-branding-design-guide.md` §3.
- All custom styles must maintain WCAG 2.2 AA contrast ratios.

### 4. Application Entry Point

- `app.js` initialises the kit via `require('nhsuk-prototype-kit')` and calls `.init()` with the configuration from `app/config.js`.
- View paths: `['app/views/']`
- Entry points: `['app/assets/sass/main.scss', 'app/assets/javascript/*.js']`
- See `docs/02-technical-specification.md` §3 for the exact code.

### 5. Routes & Data

- Custom routes go in `app/routes.js` using `express.Router()`.
- Auto-routing is handled by the kit — any `.html` file in `app/views/` is served at its URL path automatically.
- Form data is automatically stored in `req.session.data` and available as `{{ data['field-name'] }}` in templates.
- Default session data is defined in `app/data/session-data-defaults.js`.

### 6. Accessibility

- Every page MUST have a skip-to-content link.
- Focus states: `#FAE100` background, `#231F20` text, 3px solid `#231F20` outline.
- All interactive elements must be keyboard-accessible.
- Use semantic HTML and ARIA attributes as needed.

---

## Code Style

- Use CommonJS (`require`/`module.exports`) in the consumer project (app.js, config, routes, etc.) since it matches the nhsuk-prototype-kit template pattern.
- Use standard NHS Design System component names and macro signatures.
- Keep `app/routes.js`, `app/filters.js`, and `app/locals.js` as clean stubs with instructional comments — users will add their own code.
- Use 2-space indentation in all files.
- No semicolons in JavaScript (match the nhsuk-prototype-kit style).

---

## Creating New Pages

When asked to create a new prototype page:

1. Create a `.html` file in `app/views/` (or a subfolder).
2. Start with this template:

```html
{% extends 'layout.html' %}

{% set pageName = "Page Title Here" %}

{% block beforeContent %}
  {{ backLink({
    text: "Go back",
    href: "javascript:history.back()"
  }) }}
{% endblock %}

{% block content %}
  <div class="nhsuk-grid-row">
    <div class="nhsuk-grid-column-two-thirds">
      <h1 class="nhsuk-heading-xl">{{ pageName }}</h1>
      <!-- Page content here -->
    </div>
  </div>
{% endblock %}
```

3. The page will be automatically available at the corresponding URL path.

---

## Creating Form Flows

When asked to create a multi-step form:

1. Create a page per step in `app/views/` (e.g., `step-1.html`, `step-2.html`, `check-answers.html`).
2. Use `method="post"` on forms — data is auto-saved to session.
3. Use `{{ data['field-name'] }}` to display previously entered data.
4. Add branching logic in `app/routes.js` if needed:

```javascript
router.post('/step-1', function(req, res) {
  const answer = req.session.data['answer-field']
  if (answer === 'yes') {
    res.redirect('/step-2a')
  } else {
    res.redirect('/step-2b')
  }
})
```

---

## Testing Changes

After making changes:
1. Run `npm install` if dependencies changed.
2. Run `npm start` to verify the development server starts.
3. Check the browser at `http://localhost:3000`.
4. Verify NHSBT branding is correctly displayed.
5. Test any new pages are accessible via their URL paths.
6. Test form data persistence through multi-step flows.

---

## Common Tasks Reference

| Task | Action |
|---|---|
| Change service name | Edit `serviceName` in `app/config.js` |
| Change port | Edit `port` in `app/config.js` |
| Add a new page | Create `app/views/page-name.html` extending `layout.html` |
| Add custom route logic | Add route handler in `app/routes.js` |
| Add a Nunjucks filter | Add filter function in `app/filters.js` |
| Set template variables | Add to `app/locals.js` middleware |
| Set default form data | Add to `app/data/session-data-defaults.js` |
| Override header/footer | Edit `app/views/layout.html` |
| Add custom CSS | Add SCSS in `app/assets/sass/main.scss` |
| Add custom JavaScript | Add JS in `app/assets/javascript/main.js` |
| Add images | Place in `app/assets/images/` |
| Reset prototype data | Click "Reset data" in footer or visit `/prototype-admin/reset` |
