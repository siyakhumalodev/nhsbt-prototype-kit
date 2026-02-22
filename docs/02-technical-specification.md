# NHSBT Prototype Kit — Technical Specification

## 1. Architecture Overview

The NHSBT Prototype Kit is a Node.js web application that acts as a thin customisation layer on top of a core prototype-kit engine package. It uses Express.js for HTTP handling, Nunjucks for server-side HTML templating, esbuild for asset compilation, and BrowserSync/Nodemon for live-reload during development.

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                        │
│   (BrowserSync proxy in dev: localhost:3000)             │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Express.js HTTP Server                      │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Middleware Stack                      │   │
│  │  cookie-parser → body-parser → express-session    │   │
│  │  → flash → setCurrentPage → setServiceName        │   │
│  │  → [production: headers + auth]                   │   │
│  │  → resetSessionData → setSessionDataDefaults      │   │
│  │  → autoStoreData → customLocals                   │   │
│  │  → customRoutes → redirectPostToGet → autoRoutes  │   │
│  │  → 404 handler → error handler                    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────┐  ┌─────────────────────────────┐  │
│  │  Static Assets   │  │  Nunjucks Template Engine    │  │
│  │  /assets/        │  │  Views: app/views/           │  │
│  │  /nhsbt-frontend │  │  Components: frontend macros │  │
│  │  /images/        │  │  Filters: built-in + custom  │  │
│  └──────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              esbuild (Asset Pipeline)                    │
│  Entry: app/assets/sass/main.scss                       │
│         app/assets/javascript/*.js                      │
│  Output: public/assets/                                 │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Key Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Runtime | Node.js | ^22.11.0 or ^24.11.0 | JavaScript runtime |
| Web Framework | Express.js | ^5.2.0 | HTTP server and routing |
| Templating | Nunjucks | ^3.2.4 | Server-side HTML templates |
| Frontend Library | nhsuk-frontend (customised for NHSBT) | ^10.3.x | Design system components, CSS, JS |
| Asset Bundler | esbuild | ^0.27.x | Sass compilation & JS bundling |
| Sass Compiler | sass-embedded via esbuild-sass-plugin | ^1.97.x / ^3.3.x | SCSS to CSS |
| Live Reload | BrowserSync | ^3.0.x | Proxy + auto-reload in dev |
| Process Monitor | Nodemon | ^3.1.x | Auto-restart on file changes |
| Session | express-session | ^1.19.x | In-memory session store |

---

## 2. Project Structure

```
nhsbt-prototype-kit/
├── app.js                              # Application entry point
├── package.json                        # Dependencies and scripts
├── README.md                           # Project documentation
│
├── app/
│   ├── config.js                       # Service name, port configuration
│   ├── routes.js                       # Custom Express routes
│   ├── filters.js                      # Custom Nunjucks filters
│   ├── locals.js                       # Custom template locals middleware
│   │
│   ├── assets/
│   │   ├── images/                     # Static images
│   │   ├── javascript/
│   │   │   └── main.js                 # Custom JS entry point
│   │   └── sass/
│   │       └── main.scss               # Custom SCSS entry point
│   │
│   ├── data/
│   │   └── session-data-defaults.js    # Default session data
│   │
│   └── views/
│       ├── layout.html                 # Master layout template
│       ├── index.html                  # Homepage template
│       └── [additional pages].html     # User-created page templates
│
├── public/                             # Compiled static assets (generated)
│   └── assets/
│       ├── sass/main.css               # Compiled CSS
│       └── javascript/application.js   # Bundled JS
│
├── docs/                               # Documentation
│
└── node_modules/
    ├── nhsbt-prototype-kit/            # Core kit engine package
    │   └── lib/
    │       ├── nhsbt-prototype-kit.js  # Main kit class
    │       ├── index.js                # Package entry
    │       ├── build/                  # esbuild configuration
    │       ├── express-settings/       # Express config helpers
    │       ├── middleware/             # All middleware modules
    │       ├── nunjucks-filters/       # Built-in Nunjucks filters
    │       ├── utils/                  # Utility functions
    │       ├── views/                  # Kit-level templates (404, 500, etc.)
    │       └── javascripts/            # Kit-level browser JS
    │
    └── nhsbt-frontend/                 # NHSBT design system (new package)
        └── dist/nhsbt/
            ├── nhsbt-frontend.min.js   # Frontend JavaScript
            ├── assets/                 # Icons, images, fonts
            ├── components/             # Nunjucks component macros
            └── macros/                 # Macro entry points
```

---

## 3. Application Entry Point

### 3.1 `app.js`

The entry point initialises the prototype kit by passing configuration options to the core engine:

```javascript
const NHSBTPrototypeKit = require('nhsbt-prototype-kit')

const config = require('./app/config')
const sessionDataDefaults = require('./app/data/session-data-defaults')
const filters = require('./app/filters')
const locals = require('./app/locals')
const routes = require('./app/routes')

const viewsPath = ['app/views/']

const entryPoints = [
  'app/assets/sass/main.scss',
  'app/assets/javascript/*.js'
]

async function init() {
  const prototype = await NHSBTPrototypeKit.init({
    serviceName: config.serviceName,
    buildOptions: { entryPoints },
    viewsPath,
    routes,
    locals,
    filters,
    sessionDataDefaults
  })

  prototype.start(config.port)
}

init()
```

### 3.2 Configuration (`app/config.js`)

```javascript
module.exports = {
  serviceName: 'Service name goes here',
  port: 4000
}
```

---

## 4. Core Engine Package (`nhsbt-prototype-kit`)

### 4.1 Initialisation Flow

The `NHSBTPrototypeKit.init()` static method orchestrates startup:

```
init(options)
  │
  ├─ Check NODE_ENV
  │   ├─ Development (default) → spawn via Nodemon (watch mode)
  │   └─ Production → continue with setup
  │
  ├─ normaliseOptions()
  │   ├─ Create Express app (if not provided)
  │   ├─ Resolve view paths:
  │   │   1. app/views/  (user views)
  │   │   2. lib/views/  (kit views: 404, 500, etc.)
  │   │   3. nhsbt-frontend/dist/nhsbt/components/
  │   │   4. nhsbt-frontend/dist/nhsbt/macros/
  │   │   5. nhsbt-frontend/dist/nhsbt/
  │   │   6. nhsbt-frontend/dist/
  │   └─ Configure Nunjucks with noCache: true
  │
  ├─ Set Express settings (view engine, query parser, trust proxy)
  │
  ├─ Add built-in Nunjucks filters (formatNhsNumber, log, startsWith)
  ├─ Add custom Nunjucks filters (from app/filters.js)
  │
  ├─ Mount static asset routes:
  │   ├─ /nhsbt-frontend → nhsbt-frontend/dist/nhsbt/
  │   ├─ /nhsbt-prototype-kit/javascripts → lib/javascripts/
  │   ├─ / → public/
  │   ├─ /assets → app/assets/
  │   └─ /images → app/images/
  │
  ├─ Configure middleware stack (see §5)
  │
  └─ Return NHSBTPrototypeKit instance
```

### 4.2 Development Mode (Watch)

In development mode (`NODE_ENV !== 'production'`):

1. **Nodemon** watches for file changes and restarts the Express server
2. **esbuild** compiles Sass and bundles JavaScript (with watch mode enabled)
3. **BrowserSync** runs as a proxy in front of Express, injecting live-reload scripts
4. **wait-on** ensures BrowserSync only refreshes after the server is ready

Port allocation:
- BrowserSync proxy → `port` (default 4000, user-facing)
- Express server → `port + 1` (internal)

### 4.3 Production Mode

In production mode (`NODE_ENV=production`):

- No Nodemon, BrowserSync, or file watching
- Assets are built once on startup
- Password authentication middleware is enabled
- Security headers middleware is enabled
- Server listens directly on the configured port

---

## 5. Middleware Stack

The middleware is applied in strict order. The sequence matters for correct behaviour.

| Order | Middleware | Module | Purpose |
|---|---|---|---|
| 1 | `cookieParser()` | cookie-parser | Parse cookies from request |
| 2 | `bodyParser.urlencoded()` | body-parser | Parse form POST data |
| 3 | `session()` | express-session | In-memory session (4h TTL) |
| 4 | `flash()` | express-flash | Flash messages |
| 5 | `setCurrentPageInLocals` | Custom | Sets `currentPage` in `res.locals` |
| 6 | `setServiceName` | Inline | Sets `serviceName` in `res.locals` |
| 7 | `productionHeaders` | Custom | Security headers (prod only) |
| 8 | `authentication` | Custom | Password gate (prod only) |
| 9 | `resetSessionData` | Custom | Handles `/prototype-admin/reset` route |
| 10 | `setSessionDataDefaults` | Custom | Populates session with defaults if empty |
| 11 | `autoStoreData` | Custom | Auto-saves all form inputs to session |
| 12 | `customLocals` | User-defined | `app/locals.js` middleware |
| 13 | `customRoutes` | User-defined | `app/routes.js` Express Router |
| 14 | `redirectPostToGet` | Custom | PRG pattern: redirects POST → GET |
| 15 | `autoRoutes` | Custom | Serves views as pages by file path |
| 16 | `renderPageNotFound` | Custom | 404 handler |
| 17 | `renderErrorPage` | Custom | 500 error handler |

### 5.1 Auto-Store Data

The `autoStoreData` middleware intercepts all requests and:
1. Copies `req.body` (POST data) into `req.session.data`
2. Copies `req.query` (GET parameters) into `req.session.data`
3. Makes `req.session.data` available as `data` in all Nunjucks templates

### 5.2 Auto-Routes

The `autoRoutes` middleware:
1. Takes the request URL path
2. Looks for a matching `.html` file in the views directories
3. If found, renders it with the Nunjucks engine
4. Falls through to 404 if no match

### 5.3 Session Configuration

- **Session name**: Generated from a hash of `serviceName` (prefixed with `nhsbt-prototype-kit-`)
- **Secret**: Same as session name (acceptable for prototyping only)
- **Cookie max-age**: 4 hours (14,400,000ms)
- **Storage**: In-memory (MemoryStore — data lost on restart)
- **saveUninitialized**: `true`
- **resave**: `false`

---

## 6. Templating System

### 6.1 Template Inheritance Chain

```
nhsbt-frontend/dist/nhsbt/template.njk       ← Base HTML5 document
  └─ lib/views/prototype-kit-template.njk     ← Imports all component macros
      └─ app/views/layout.html                ← NHSBT-branded header/footer
          └─ app/views/[page].html            ← Individual page content
```

### 6.2 Available Blocks

| Block | Defined In | Purpose |
|---|---|---|
| `pageTitle` | prototype-kit-template.njk | `<title>` tag content |
| `head` | template.njk | Additional `<head>` content |
| `header` | template.njk | Page header |
| `beforeContent` | template.njk | Area between header and main content |
| `content` | template.njk | Main page content |
| `footer` | template.njk | Page footer |
| `bodyEnd` | template.njk | Scripts before `</body>` |
| `pageScripts` | layout.html | Additional page-specific scripts |

### 6.3 Template Variables

| Variable | Source | Description |
|---|---|---|
| `serviceName` | `config.js` via middleware | The service name displayed in header |
| `data` | `req.session.data` | All stored form data |
| `currentPage` | Middleware | Current URL path |
| `errors` | Flash/custom | Error state for showing error prefix in title |
| `pageName` | Set per-page | Page name for `<title>` |

### 6.4 Built-in Nunjucks Filters

| Filter | Usage | Description |
|---|---|---|
| `log` | `{{ variable \| log }}` | Outputs to server console for debugging |
| `startsWith` | `{{ string \| startsWith('prefix') }}` | Boolean string prefix check |
| `formatNhsNumber` | `{{ '1234567890' \| formatNhsNumber }}` | Formats a 10-digit NHS number as `123 456 7890` |

---

## 7. Asset Pipeline

### 7.1 Entry Points

Configured in `app.js`:

```javascript
const entryPoints = [
  'app/assets/sass/main.scss',
  'app/assets/javascript/*.js'
]
```

### 7.2 esbuild Configuration

- **Sass Plugin**: `esbuild-sass-plugin` with `sass-embedded` compiler
- **Output**: Files are written to `public/` directory
- **Watch mode**: Enabled in development (esbuild rebuild on change)
- **Source maps**: Inline in development

### 7.3 Sass Architecture

```scss
// app/assets/sass/main.scss

// Import the NHSBT frontend library (customised from NHS.UK frontend)
@import "nhsbt-frontend/dist/nhsbt";

// Add custom SCSS below
```

The NHSBT frontend library provides all base styles including:
- Typography (Frutiger / fallback system fonts)
- Grid system (nhsuk-grid-row, nhsuk-grid-column-*)
- Colour variables
- Component styles
- Print styles

### 7.4 JavaScript Architecture

```javascript
// app/assets/javascript/main.js
// Custom client-side JavaScript (ES6)
```

The kit loads:
1. `nhsbt-frontend.min.js` — Frontend library initialisation
2. `send-unchecked-checkboxes.js` — Kit utility for form prototyping
3. `application.js` — Bundled user JavaScript

---

## 8. npm Package Structure

### 8.1 Dependencies (Consumer Package: `nhsbt-prototype-kit-template`)

```json
{
  "dependencies": {
    "nhsbt-frontend": "^1.0.0",
    "nhsbt-prototype-kit": "^1.0.0"
  },
  "engines": {
    "node": "^22.11.0 || ^24.11.0"
  }
}
```

### 8.2 Core Kit Package Dependencies (`nhsbt-prototype-kit`)

| Package | Purpose |
|---|---|
| `body-parser` | Parse POST request bodies |
| `browser-sync` | Live reload proxy |
| `cookie-parser` | Cookie parsing |
| `esbuild` | JavaScript/CSS bundling |
| `esbuild-sass-plugin` | Sass compilation in esbuild |
| `express-flash` | Flash messages |
| `express-session` | Session management |
| `nodemon` | File watching and restart |
| `sass-embedded` | Dart Sass compiler |
| `wait-on` | Wait for server readiness |

### 8.3 Peer Dependencies

| Package | Version | Purpose |
|---|---|---|
| `express` | ^5.2.0 | Web framework |
| `nhsbt-frontend` | ^1.0.0 | Design system components |
| `nunjucks` | ^3.2.4 | Templating engine |

---

## 9. npm Scripts

```json
{
  "scripts": {
    "start": "node .",
    "watch": "echo 'run this instead: npm start'"
  }
}
```

- `npm start` — Starts the kit (development mode by default, production if `NODE_ENV=production`)
- In development, `npm start` triggers Nodemon + BrowserSync automatically

---

## 10. Development vs Production Comparison

| Feature | Development | Production |
|---|---|---|
| File watching | ✅ Nodemon | ❌ |
| Live reload | ✅ BrowserSync | ❌ |
| Asset rebuild | ✅ Watch mode | ✅ One-time build |
| Nunjucks cache | ❌ (noCache: true) | ❌ (noCache: true) |
| Password auth | ❌ | ✅ |
| Security headers | ❌ | ✅ |
| Proxy port | ✅ (port + 1 for Express) | ❌ (single port) |

---

## 11. Creating the NHSBT Frontend Package

Since NHSBT has its own branding distinct from NHS.UK, a new `nhsbt-frontend` npm package needs to be created. This package should:

### 11.1 Approach Options

**Option A: Fork `nhsuk-frontend` (Recommended)**
1. Fork `nhsuk-frontend` from GitHub
2. Replace NHS.UK branding with NHSBT branding (colours, logo, typography)
3. Update component templates to use NHSBT class prefixes or keep `nhsuk-` prefixes with customised styles
4. Publish as `nhsbt-frontend`

**Option B: Wrapper/Override Package**
1. Create `nhsbt-frontend` that depends on `nhsuk-frontend`
2. Override only the Sass variables (colours, fonts)
3. Provide a custom header/footer component
4. Re-export everything else from `nhsuk-frontend`

**Option C: CSS Override Layer (Simplest)**
1. Keep `nhsuk-frontend` as the base
2. In the prototype kit template, layer NHSBT-specific CSS overrides on top
3. Replace the header/footer Nunjucks macro invocations in `layout.html`

### 11.2 Recommended: Option C for Prototype Kit

For a **prototype kit** (not production), Option C is the most pragmatic:
- Use `nhsuk-frontend` as-is for the component library
- Override colours and branding via custom Sass variables and overrides in `main.scss`
- Replace the header component with a custom NHSBT header
- Replace the footer component with a custom NHSBT footer
- Add the NHSBT logo as a static asset

---

## 12. Deployment

### 12.1 Local Development

```bash
git clone <repository-url>
cd nhsbt-prototype-kit
npm install
npm start
# Opens at http://localhost:4000
```

### 12.2 Production Deployment

```bash
NODE_ENV=production PASSWORD=<secret> npm start
```

Set environment variables:
- `NODE_ENV=production`
- `PASSWORD` — Required password for access
- `PORT` — Override default port (optional)

### 12.3 Platform Deployment

Compatible with:
- **Heroku** — Include `Procfile: web: npm start`
- **Azure App Service** — Set startup command `npm start`
- **Docker** — Standard Node.js Dockerfile pattern
