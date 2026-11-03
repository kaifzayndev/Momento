# Momento — Fine-Art Photography Exhibition & Curated Gallery Platform

A state-of-the-art, responsive fine-art photography gallery and exhibition management system built with **React 19**, **React Router v6**, and modern **CSS3**. 

Momento presents a curated collection of high-resolution masterworks in a dedicated **pure dark aesthetic**, featuring full-bleed exhibition plinths, multi-density layout modes, direct lossless 4K downloads, user collection curation, and a comprehensive **Administration Dashboard** with user and photographer tracking.

---

## ✨ Features

### 👤 Exhibition & Gallery Features
- **🖼️ Curated Masterworks**: 24 fine-art photographs spanning 10 disciplines: *Nature*, *Architecture*, *Travel*, *Animals*, *People*, *Street*, *Ocean*, *Astrophotography*, *Minimalism*, and *Aerial*.
- **💎 Full-Bleed Exhibition Plinths**: Edge-to-edge imagery with 24px curvature, subtle luminous hairline borders, and smooth cinematic hover zoom.
- **🎛️ Multi-Density Exhibition Switcher**:
  - **⊞ Editorial Mode**: Balanced 3-column museum showcase (`minmax(360px, 1fr)`).
  - **⊟ Compact Mode**: Dense 4-column fine-art grid for rapid catalog browsing (`minmax(280px, 1fr)`).
  - **▥ Panoramic Mode**: Wide 2-column landscape presentation with immersive wide crops (`minmax(520px, 1fr)`).
- **🛸 Floating Glass Top Dock**: Minimalist frosted capsule displaying category classification with a pulsing status dot alongside a unified Download and Favourite action dock.
- **🌌 Ambient Obsidian Bottom HUD**: Frosted glass information bar displaying archive accession numbers (`ARCHIVE № 01`), display typography title, photographer avatar badge, shot location, like pill counter (`👍 428`), and direct inspection links.
- **🔍 Real-Time Live Filtering**: Instantaneous search across titles, artists, locations, and descriptions coupled with category pill selectors and result count indicators.
- **⬇️ Direct 4K Export**: One-click high-resolution downloads with instant visual checkmark confirmation.
- **❤️ Favourites & Collections (`/collection`)**: Interactive personal space allowing users to toggle and inspect their saved favourites and liked works.
- **🌑 Pure Dark Aesthetic**: Engineered exclusively for dark mode with OLED obsidian surfaces, frosted glassmorphism, and warm coral/amber ambient accents.
- **📄 Deep Photo Detail Inspection (`/photo/:id`)**: High-res view featuring comprehensive camera/shot metadata, artist details, location, like counters, and curated recommendations.

### 🛡️ Administration Section (`/admin`)
- **🔐 Unified Authentication Portal**: Seamless tabbed role switcher supporting credentialed Administrator access (`admin@bwu.edu` / `admin123`) and User access.
- **📊 Real-Time Metric Cards**:
  - **Total Gallery Photos**: Live counter tracking all catalog items.
  - **👥 Our Users**: Interactive modal listing registered user accounts, active status badges, and login records.
  - **📸 Photographers**: Interactive modal showcasing featured photographers, shot locations, total community likes, and horizontal photo strip previews.
  - **👍 Total Likes**: Aggregate community engagement metrics across the catalog.
- **🔎 Table Search, Filter & Multi-Sort**: Search photos by title, photographer, or location, filter by category, and sort by Newest, Oldest, Most Liked, or Title (A–Z / Z–A).
- **🖼️ Live Image Preview in Add/Edit Modal**: Instant URL preview with real-time validation before publishing new exhibits.
- **👁️ Quick "View in Gallery" Action**: Direct row links to inspect the live exhibit in the public exhibition view.
- **📱 Responsive Mobile/Desktop UX**: Horizontal table view for desktop and tablet screens, adaptive card grid for mobile devices, and a manual `Auto | Table | Cards` view switcher.

---

## 🛠️ Tech Stack

- **Frontend Core**: [React 19](https://react.dev/)
- **Client Routing**: [React Router v6](https://reactrouter.com/)
- **Styling Architecture**: Pure CSS3 with CSS Custom Properties, CSS Grid, Flexbox, and Glassmorphism
- **Typography**: Google Fonts (*Plus Jakarta Sans*, *Outfit*, *Space Grotesk*)
- **Test Framework**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)
- **Persistence Layer**: Web Storage API (`localStorage`)
- **Image Assets**: High-resolution curated CDN photography (Unsplash)

---

## 📁 Project Structure

```text
gallery-system/
├── public/
│   ├── favicon.ico
│   ├── index.html            # HTML5 entry with fonts & dark theme attribute
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── FilterBar.jsx     # Search input, category pills & favourite filters
│   │   ├── Footer.jsx        # Footer with brand reload trigger & links
│   │   ├── Header.jsx        # Floating island pill navbar & user menu
│   │   ├── ImageCard.jsx     # Full-bleed exhibition card with floating HUD
│   │   └── ScrollToTop.jsx   # Route transition scroll reset handler
│   ├── data/
│   │   └── galleryData.js    # Curated 24-piece masterwork catalog (10 categories)
│   ├── pages/
│   │   ├── AdminPage.jsx     # Admin dashboard, user/photographer modals & CRUD
│   │   ├── DetailPage.jsx    # Photo exhibit view with metadata & related works
│   │   ├── GalleryPage.jsx   # Exhibition showcase with view density switcher
│   │   ├── LoginPage.jsx     # Unified user & administrator portal
│   │   └── MyCollectionPage.jsx # Personal collection & saved favourites
│   ├── utils/
│   │   └── downloadHelper.js # Lossless image download utility
│   ├── App.css               # Design system tokens, full-bleed card & layout styles
│   ├── App.jsx               # Root router, global auth state & notification toast
│   ├── App.test.js           # Comprehensive unit and integration test suite
│   ├── index.css             # Base resets & pure dark theme variables
│   ├── index.js              # React DOM render entry point
│   ├── reportWebVitals.js
│   └── setupTests.js         # Jest testing configuration
├── .gitignore
├── LICENSE                   # MIT License
├── package.json              # Project dependencies & scripts
├── package-lock.json
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd gallery-system
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm start
   # or
   npm run dev
   ```

4. **Access in browser**:
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧪 Testing

Run the full integration and unit test suite:

```bash
npm test -- --watchAll=false
```

To run in CI mode:
```bash
CI=true npm test
```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm start` / `npm run dev` | Launches development server at `http://localhost:3000` with hot reloading |
| `npm run build` | Compiles an optimized, production-ready bundle into the `build/` directory |
| `npm test` | Executes the Jest test runner with React Testing Library |
| `npm run eject` | Ejects create-react-app configuration (irreversible) |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
