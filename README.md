# NHSBT Prototype Kit

Quickly create HTML prototypes for NHS Blood and Transplant digital services.

This kit is based on the [NHS.UK Prototype Kit](https://nhsuk-prototype-kit.azurewebsites.net/docs), customised with NHSBT branding (colours, header, footer, and logos).

## Prerequisites

- [Node.js](https://nodejs.org/) v22.11.0 or v24.11.0 (or later patch versions)
- npm (comes with Node.js)

## Getting started

### 1. Clone the repository

```bash
git clone <repository-url>
cd nhsbt-prototype-kit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm start
```

The kit will start at [http://localhost:4000](http://localhost:4000).

Changes to HTML, Sass, and JavaScript files are automatically detected and the browser refreshes.

## Creating pages

Create new pages by adding `.html` files to `app/views/`.

Each page should extend the NHSBT-branded layout:

```html
{% extends 'layout.html' %}

{% set pageName = "Page Title" %}

{% block content %}
  <div class="nhsuk-grid-row">
    <div class="nhsuk-grid-column-two-thirds">
      <h1 class="nhsuk-heading-xl">{{ pageName }}</h1>
      <p>Your content here.</p>
    </div>
  </div>
{% endblock %}
```

Pages are automatically available at their URL path. For example, `app/views/register.html` is served at `/register`.

## Building forms

Use `method="post"` on forms — data is automatically saved to the session and available in templates as `{{ data['field-name'] }}`.

Add branching logic in `app/routes.js`:

```javascript
router.post('/step-1', function (req, res) {
  const answer = req.session.data['answer-field']
  if (answer === 'yes') {
    res.redirect('/step-2a')
  } else {
    res.redirect('/step-2b')
  }
})
```

## Configuration

| Setting | File | Description |
|---|---|---|
| Service name | `app/config.js` | Appears in the header and page titles |
| Port | `app/config.js` | Development server port (default: 4000) |
| Default data | `app/data/session-data-defaults.js` | Pre-populated form data |
| Custom routes | `app/routes.js` | Express route handlers |
| Custom filters | `app/filters.js` | Nunjucks template filters |
| Custom locals | `app/locals.js` | Variables available in all templates |
| Styles | `app/assets/sass/main.scss` | Custom SCSS |
| JavaScript | `app/assets/javascript/main.js` | Client-side JS |

## Components

All [NHS Design System components](https://service-manual.nhs.uk/design-system/components) are available as Nunjucks macros. Use them in your templates:

```html
{{ button({
  text: "Continue"
}) }}

{{ input({
  label: { text: "Full name" },
  id: "full-name",
  name: "full-name"
}) }}

{{ radios({
  idPrefix: "contact-preference",
  name: "contact-preference",
  fieldset: { legend: { text: "How would you like to be contacted?" } },
  items: [
    { value: "email", text: "Email" },
    { value: "phone", text: "Phone" }
  ]
}) }}
```

## Production mode

To run in production mode with password protection:

```bash
NODE_ENV=production PASSWORD=your-secret npm start
```

## Project structure

```
app/
  config.js              — Service name and port
  routes.js              — Custom Express routes
  filters.js             — Custom Nunjucks filters
  locals.js              — Custom template locals
  assets/
    images/              — Logo and image files
    javascript/main.js   — Client-side JavaScript
    sass/main.scss       — Custom styles (NHSBT branding)
  data/
    session-data-defaults.js — Default session values
  views/
    layout.html          — NHSBT-branded master layout
    index.html           — Homepage
docs/                    — Specification documents
```

## Licence

MIT
