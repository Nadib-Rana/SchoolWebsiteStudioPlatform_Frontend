# 🚀 Next.js_Starter_Template

[![Next.js 16](https://img.shields.io/badge/Next.js-16.0+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

A clean, modern, scalable, and production-ready **Next.js 16 + React 19 + TypeScript + Tailwind CSS v4** starter template. Designed with a clear separation of concerns, accessible UI primitives, and zero domain-specific bloat to jumpstart any web application.

---

## ✨ Features

- ⚡ **Next.js 16 App Router**: Server Components, streaming, Turbopack, and static generation.
- ⚛️ **React 19**: Modern concurrent features and fast hydration.
- 🎨 **Tailwind CSS v4**: Modern CSS theme tokens (OKLCH), responsive design, and dark/light mode readiness.
- 🧩 **Accessible UI Components**: Pre-configured Shadcn / Radix UI primitives (`Button`, `Card`, `Input`, `Badge`, `Dialog`, etc.).
- 🛡️ **Strict TypeScript**: Full end-to-end type safety with strict compiler options.
- 🗂️ **Clean Modular Architecture**: Logical separation between pages, UI primitives, global layout, hooks, utils, and configs.
- 🔍 **SEO & Metadata Ready**: Built-in OpenGraph, Twitter Cards, and dynamic title templating.
- 📦 **Minimal Dependencies**: Stripped down to essential, battle-tested packages.

---

## 🏛️ Multi-Tenant Studio & Dynamic Workflow

The frontend is powered by a reactive multi-tenant management system that dynamically synchronizes user sessions, school memberships, and live public website previews.

For the full architectural specification, sequence diagrams, and data-flow models:
👉 [**Multi-Tenant Workflow Architecture (`docs/architecture/MULTI_TENANT_WORKFLOW_ARCHITECTURE.md`)**](../docs/architecture/MULTI_TENANT_WORKFLOW_ARCHITECTURE.md)

### Key Frontend Features:
- **Dynamic School Switcher**: Interactive sidebar popover displaying all owned/managed schools with active indicators.
- **Reactive Tenant Context (`StudioContext`)**: Automatically synchronizes `currentUser`, `currentSchool`, and `userSchools` with zero page reloads.
- **Self-Service Registration**: Dual-mode login page supporting direct administrator onboarding with custom passwords.
- **Live Website SSR Routing**: Dynamic `/[schoolSlug]` routes rendering high-performance public school websites with instant cache invalidation on publish.

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── favicon.ico / icon.svg   # Favicon and app icons
│   ├── globals.css              # Tailwind v4 theme & global CSS rules
│   ├── layout.tsx               # Root layout with fonts, header, and footer
│   ├── not-found.tsx            # Custom 404 page
│   └── page.tsx                 # Starter home page
├── components/
│   ├── common/                  # Shared layout components (Navbar, Footer, etc.)
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── ui/                      # Reusable accessible UI primitives (Shadcn UI)
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       └── ...
├── config/
│   └── site.ts                  # Site-wide configuration, navigation, and links
├── hooks/
│   └── use-mobile.ts            # Viewport & responsive detection hooks
├── lib/
│   └── utils.ts                 # Utility functions (cn class merger)
└── types/
    └── index.ts                 # Shared global TypeScript types
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <repository-url>
cd <repository-folder>
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with Turbopack |
| `npm run build` | Builds the optimized production application |
| `npm run start` | Runs the production build locally |
| `npm run lint` | Runs ESLint to check for code quality issues |

---

## 🎨 Customization

1. **Brand & Metadata**: Update site title, description, and navigation links in [`src/config/site.ts`](file:///c:/Users/Nadib/office-project/polaris-care/src/config/site.ts).
2. **Color Palette & Theming**: Adjust theme variables in [`src/app/globals.css`](file:///c:/Users/Nadib/office-project/polaris-care/src/app/globals.css).
3. **Adding New Routes**: Create new subdirectories in `src/app/` (e.g. `src/app/dashboard/page.tsx`).
4. **Adding UI Components**: Drop new Shadcn UI primitives into `src/components/ui/`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
# SchoolWebsiteStudioPlatform_Frontend
