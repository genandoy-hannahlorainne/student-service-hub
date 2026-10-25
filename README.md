# University Organization Student Services Hub

The University Organization Student Services Hub is a unified student-services platform for PUP Taguig. It connects students and guests with approved providers for printing, school supplies, and academic resource rentals.

This repository contains:

- A React/Vite web frontend
- A Flutter mobile frontend
- Product and architecture documentation

## Features

- Browse approved student services and resource listings
- Request printing services
- Purchase school supplies
- Rent or offer academic resources
- Track orders and transactions
- Separate student, guest, provider, and admin experiences
- Shared Biscotti, Cafe Noir, black, and white visual system
- Bootstrap Icons across the web and mobile interfaces

## Project structure

```text
.
├── src/                         # React/Vite web frontend
│   ├── components/              # Shared web UI components
│   ├── screens/                 # Web screens and role-based flows
│   ├── assets/                  # Web assets and organization logo
│   ├── App.tsx                  # Web application entry component
│   └── index.css                # Global styles and design tokens
├── student-service-hub/         # Flutter mobile frontend
│   ├── lib/                     # Flutter application source
│   ├── assets/                  # Flutter assets
│   └── pubspec.yaml             # Flutter dependencies
├── public/                      # Public web files
├── PRD.md                       # Product requirements
├── ARCHITECTURE.md              # Complete system architecture
└── ARCHITECTURE-ESSENTIALS.md   # Condensed architecture reference
```

## Web frontend

### Requirements

- Node.js
- npm

### Install dependencies

From the repository root:

```bash
npm install
```

### Run locally

```bash
npm run dev
```

The web frontend is served at:

```text
http://localhost:8000
```

The development command builds the application first and then serves the production bundle through Vite preview for reliable local rendering.

### Other commands

```bash
npm run build    # Create a production build
npm run preview  # Preview the existing production build
npm run format   # Format supported source files
```

## Flutter frontend

### Requirements

- Flutter SDK
- Android Studio or another configured Android toolchain for Android testing
- A connected Android device or emulator for mobile runs

From the Flutter project directory:

```bash
cd student-service-hub
flutter pub get
flutter analyze
flutter test
flutter run
```

The Flutter app uses the organization logo at:

```text
student-service-hub/assets/images/org_ssh_logo.png
```

## Design system

The project uses the following primary colors:

| Role | Color |
| --- | --- |
| Biscotti | `#E3C565` |
| Cafe Noir | `#4B3621` |
| Black | `#000000` |
| Neutral background | `#FFFFFF` |

The interfaces use Bento-inspired layouts, responsive cards, clear role-based navigation, and Bootstrap Icons. The web frontend is standalone and does not depend on Figma at runtime.

## Documentation

- [PRD.md](./PRD.md) — product requirements and user flows
- [ARCHITECTURE.md](./ARCHITECTURE.md) — full architecture and data model
- [ARCHITECTURE-ESSENTIALS.md](./ARCHITECTURE-ESSENTIALS.md) — implementation-focused architecture summary
- [AGENTS.md](./AGENTS.md) — repository development instructions

## Git workflow

Changes should be reviewed and tested locally before committing. The project does not automatically commit or push changes.
