# Meraki Studio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Meraki Studio marketing website — a static, responsive Next.js site with a locked brown/amber/sofa-blue design system, backed by a Sanity headless CMS so the non-technical owner can manage all content (team, clientele, works, studio photos, equipment, ad-slot creative, contact info, terms text) without touching code.

**Architecture:** Next.js (App Router) built with `output: 'export'` so the deployed artifact is plain static HTML/CSS/JS runnable on any host. All content beyond the fixed 5 services lives in Sanity and is fetched client-side at runtime (never baked in at build time), so the owner's edits in Sanity Studio appear on the live site immediately with no rebuild. A separate `studio/` Sanity Studio project provides the owner's no-code admin UI, deployed independently to Sanity's free hosting.

**Tech Stack:** Next.js 14 (App Router, TypeScript), Tailwind CSS, `@sanity/client` for reads, Sanity Studio v3 for the admin UI, Vitest + React Testing Library for tests.

## Global Constraints

- Static export only: the Next.js app must build with `next build` under `output: 'export'` and never rely on server-only APIs (route handlers, server actions, middleware).
- No pricing may appear anywhere in UI copy or placeholder content.
- Hyperlinks must always be visibly styled (underline/accent color), never disguised as plain text.
- Color tokens are locked and must be used verbatim: background `#FAF6EC`/`#211511`, section alt `#F3ECDC`/`#2E1F18`, heading text `#2F1B12`/`#F1E9D6`, body text `#5c5750`/`#c9bfae`, brand accent `#2F1B12`/`#C98B52`, CTA `#2F1B12`/`#E0952F`, sofa blue `#7C93A8`/`#8FA8BA` (light/dark respectively).
- Theme default is the visitor's system preference; manual overrides persist in `localStorage`; dark mode is applied via a `dark` class on `<html>` (Tailwind `darkMode: 'class'`).
- The site must be explicitly usable at phone width (~375px) and laptop width (~1440px), plus the tablet range between them.
- No contact form and no server-side business logic — WhatsApp deep links and static Sanity-sourced info are the only contact mechanism.
- Homepage section order is fixed: Hero, About, Services, Ad Slot, Studio, Our Works (teaser), Team, Clientele, Contact, Footer.
- The 5 service/work categories are fixed strings, used identically in the Services section, Sanity `workSample.category` field, and the `/our-works` grouping: `Recording`, `Music Production`, `Mixing & Mastering`, `Audiobook Productions`, `Music Distribution & Publishing`.

---

## Task 1: Project scaffold — Next.js, TypeScript, Tailwind, static export, test tooling

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Test: `src/app/page.test.tsx`

**Interfaces:**
- Produces: a working Next.js static-export app skeleton, a `@/*` → `src/*` import alias, and a `vitest run` test command that later tasks build on.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "meraki-studio-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@sanity/client": "^6.21.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "vitest": "^2.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "jsdom": "^24.1.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

- [ ] **Step 4: Create `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
```

- [ ] **Step 5: Create `postcss.config.js`**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 7: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 8: Create `src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 9: Create `src/app/layout.tsx`**

```tsx
import './globals.css'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 10: Create `src/app/page.tsx`**

```tsx
export default function HomePage() {
  return <main>Meraki Studio</main>
}
```

- [ ] **Step 11: Write the smoke test — `src/app/page.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HomePage from './page'

describe('HomePage smoke test', () => {
  it('renders without crashing', () => {
    render(<HomePage />)
    expect(screen.getByText('Meraki Studio')).toBeInTheDocument()
  })
})
```

- [ ] **Step 12: Install dependencies**

Run: `npm install`
Expected: install completes with no errors.

- [ ] **Step 13: Run the test suite**

Run: `npm test`
Expected: 1 test file, 1 test, PASS.

- [ ] **Step 14: Verify the static export build**

Run: `npm run build`
Expected: build succeeds; `out/index.html` exists.

- [ ] **Step 15: Commit**

```bash
git add package.json tsconfig.json next.config.ts tailwind.config.ts postcss.config.js vitest.config.ts vitest.setup.ts src/
git commit -m "chore: scaffold Next.js static-export app with Vitest"
```

---

## Task 2: Design tokens — Tailwind palette, fonts, link styling

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/layout.tsx`
- Create: `src/lib/styles.ts`
- Test: `src/lib/styles.test.ts`
- Test: `tailwind.config.test.ts`

**Interfaces:**
- Consumes: `tailwind.config.ts`, `src/app/layout.tsx` from Task 1.
- Produces: Tailwind color tokens (`cream`, `cream-alt`, `charcoal`, `charcoal-alt`, `espresso`, `ivory`, `ivory-soft`, `text-muted-light`, `text-muted-dark`, `amber`, `amber-cta`, `sofa-blue`, `sofa-blue-dark`), font classes `font-sans`/`font-heading`, and `LINK_CLASS: string` from `@/lib/styles` — used by every component task from here on.

- [ ] **Step 1: Write the failing token test — `tailwind.config.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import config from './tailwind.config'

describe('tailwind design tokens', () => {
  it('locks the exact palette from the design spec', () => {
    const colors = config.theme?.extend?.colors as Record<string, string>
    expect(colors.cream).toBe('#FAF6EC')
    expect(colors['cream-alt']).toBe('#F3ECDC')
    expect(colors.charcoal).toBe('#211511')
    expect(colors['charcoal-alt']).toBe('#2E1F18')
    expect(colors.espresso).toBe('#2F1B12')
    expect(colors.ivory).toBe('#F1E9D6')
    expect(colors['ivory-soft']).toBe('#EFDCC4')
    expect(colors.amber).toBe('#C98B52')
    expect(colors['amber-cta']).toBe('#E0952F')
    expect(colors['sofa-blue']).toBe('#7C93A8')
    expect(colors['sofa-blue-dark']).toBe('#8FA8BA')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tailwind.config.test.ts`
Expected: FAIL — `colors.cream` is `undefined`.

- [ ] **Step 3: Update `tailwind.config.ts` with the full palette, fonts, and scroll animation**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF6EC',
        'cream-alt': '#F3ECDC',
        charcoal: '#211511',
        'charcoal-alt': '#2E1F18',
        espresso: '#2F1B12',
        ivory: '#F1E9D6',
        'ivory-soft': '#EFDCC4',
        'text-muted-light': '#5c5750',
        'text-muted-dark': '#c9bfae',
        amber: '#C98B52',
        'amber-cta': '#E0952F',
        'sofa-blue': '#7C93A8',
        'sofa-blue-dark': '#8FA8BA',
      },
      fontFamily: {
        sans: ['var(--font-body)'],
        heading: ['var(--font-heading)'],
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        scroll: 'scroll 30s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 4: Run the token test again**

Run: `npm test -- tailwind.config.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the failing link-style test — `src/lib/styles.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { LINK_CLASS } from './styles'

describe('LINK_CLASS', () => {
  it('always includes a visible underline treatment', () => {
    expect(LINK_CLASS).toContain('underline')
  })
})
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npm test -- src/lib/styles.test.ts`
Expected: FAIL — cannot find module `./styles`.

- [ ] **Step 7: Create `src/lib/styles.ts`**

```ts
export const LINK_CLASS =
  'underline underline-offset-2 decoration-sofa-blue hover:text-sofa-blue transition-colors'
```

- [ ] **Step 8: Run the link-style test again**

Run: `npm test -- src/lib/styles.test.ts`
Expected: PASS.

- [ ] **Step 9: Wire up fonts in `src/app/layout.tsx`**

```tsx
import './globals.css'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-heading' })

export const metadata: Metadata = {
  title: 'Meraki Studio',
  description:
    'Professional audio recording studio — recording, production, mixing & mastering, audiobooks, and distribution.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans bg-cream dark:bg-charcoal">{children}</body>
    </html>
  )
}
```

- [ ] **Step 10: Run the full test suite**

Run: `npm test`
Expected: all tests PASS.

- [ ] **Step 11: Commit**

```bash
git add tailwind.config.ts tailwind.config.test.ts src/lib/styles.ts src/lib/styles.test.ts src/app/layout.tsx
git commit -m "feat: lock design tokens (palette, fonts, link styling)"
```

---

## Task 3: WhatsApp link builder

**Files:**
- Create: `src/lib/whatsapp.ts`
- Test: `src/lib/whatsapp.test.ts`

**Interfaces:**
- Produces: `buildWhatsAppLink(phoneNumber: string, message: string): string` — consumed by Task 19 (Contact section).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { buildWhatsAppLink } from './whatsapp'

describe('buildWhatsAppLink', () => {
  it('strips non-digit characters from the phone number', () => {
    const link = buildWhatsAppLink('+91 98765 43210', 'Hi')
    expect(link).toBe('https://wa.me/919876543210?text=Hi')
  })

  it('URL-encodes the message', () => {
    const link = buildWhatsAppLink('919876543210', "Hi, I'd like to book a session.")
    expect(link).toBe(
      'https://wa.me/919876543210?text=Hi%2C%20I\'d%20like%20to%20book%20a%20session.'
    )
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/lib/whatsapp.test.ts`
Expected: FAIL — cannot find module `./whatsapp`.

- [ ] **Step 3: Implement `src/lib/whatsapp.ts`**

```ts
export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  const digitsOnly = phoneNumber.replace(/[^0-9]/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${digitsOnly}?text=${encodedMessage}`
}
```

- [ ] **Step 4: Run the test again**

Run: `npm test -- src/lib/whatsapp.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/whatsapp.ts src/lib/whatsapp.test.ts
git commit -m "feat: add WhatsApp link builder utility"
```

---

## Task 4: Theme system (system-preference default + localStorage override)

**Files:**
- Create: `src/context/ThemeContext.tsx`
- Test: `src/context/ThemeContext.test.tsx`

**Interfaces:**
- Produces: `ThemeProvider({ children }: { children: ReactNode }): JSX.Element` and `useTheme(): { theme: 'light' | 'dark'; toggleTheme: () => void }` — consumed by Task 5 (ThemeToggle) and Task 9 (root layout wiring).

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ThemeProvider, useTheme } from './ThemeContext'

function ThemeProbe() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  )
}

beforeEach(() => {
  window.localStorage.clear()
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

describe('ThemeProvider / useTheme', () => {
  it('defaults to the system preference when nothing is stored', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light')
  })

  it('toggles the theme and persists it to localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    )
    fireEvent.click(screen.getByText('toggle'))
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
    expect(window.localStorage.getItem('meraki-theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('reads a previously stored theme instead of the system preference', () => {
    window.localStorage.setItem('meraki-theme', 'dark')
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/context/ThemeContext.test.tsx`
Expected: FAIL — cannot find module `./ThemeContext`.

- [ ] **Step 3: Implement `src/context/ThemeContext.tsx`**

```tsx
'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
const STORAGE_KEY = 'meraki-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
```

- [ ] **Step 4: Run the test again**

Run: `npm test -- src/context/ThemeContext.test.tsx`
Expected: PASS, all 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/context/ThemeContext.tsx src/context/ThemeContext.test.tsx
git commit -m "feat: add theme context with system-preference default"
```

---

## Task 5: Theme toggle button

**Files:**
- Create: `src/components/ThemeToggle.tsx`
- Test: `src/components/ThemeToggle.test.tsx`

**Interfaces:**
- Consumes: `useTheme` from `@/context/ThemeContext` (Task 4).
- Produces: `ThemeToggle(): JSX.Element` — consumed by Task 10 (Nav).

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ThemeProvider } from '@/context/ThemeContext'
import { ThemeToggle } from './ThemeToggle'

beforeEach(() => {
  window.localStorage.clear()
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

describe('ThemeToggle', () => {
  it('switches the icon when clicked', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )
    const button = screen.getByTestId('theme-toggle')
    expect(button).toHaveTextContent('☾')
    fireEvent.click(button)
    expect(button).toHaveTextContent('☀')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/ThemeToggle.test.tsx`
Expected: FAIL — cannot find module `./ThemeToggle`.

- [ ] **Step 3: Implement `src/components/ThemeToggle.tsx`**

```tsx
'use client'
import { useTheme } from '@/context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      data-testid="theme-toggle"
      className="w-8 h-8 rounded-full bg-cream-alt dark:bg-charcoal-alt text-espresso dark:text-ivory"
    >
      {theme === 'light' ? '☾' : '☀'}
    </button>
  )
}
```

- [ ] **Step 4: Run the test again**

Run: `npm test -- src/components/ThemeToggle.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ThemeToggle.tsx src/components/ThemeToggle.test.tsx
git commit -m "feat: add theme toggle button"
```

---

## Task 6: Sanity Studio scaffold and schemas

**Files:**
- Create: `studio/package.json`
- Create: `studio/sanity.config.ts`
- Create: `studio/schemaTypes/teamMember.ts`
- Create: `studio/schemaTypes/clientLogo.ts`
- Create: `studio/schemaTypes/workSample.ts`
- Create: `studio/schemaTypes/studioPhoto.ts`
- Create: `studio/schemaTypes/equipmentItem.ts`
- Create: `studio/schemaTypes/adCampaign.ts`
- Create: `studio/schemaTypes/siteSettings.ts`
- Create: `studio/schemaTypes/index.ts`

**Interfaces:**
- Produces: the 7 Sanity document types (`teamMember`, `clientLogo`, `workSample`, `studioPhoto`, `equipmentItem`, `adCampaign`, `siteSettings`) whose field shapes Task 7's TypeScript types must mirror exactly.

This task has no unit tests (schema definitions are configuration, not logic) — verification is a successful Studio build.

- [ ] **Step 1: Create `studio/package.json`**

```json
{
  "name": "meraki-studio-cms",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "sanity dev",
    "build": "sanity build",
    "deploy": "sanity deploy"
  },
  "dependencies": {
    "sanity": "^3.57.0",
    "styled-components": "^6.1.0"
  }
}
```

- [ ] **Step 2: Create `studio/schemaTypes/teamMember.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'bio', title: 'Bio', type: 'text' }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', title: 'Platform', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
        },
      ],
    }),
  ],
})
```

- [ ] **Step 3: Create `studio/schemaTypes/clientLogo.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const clientLogo = defineType({
  name: 'clientLogo',
  title: 'Client Logo',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Client Name', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', validation: (rule) => rule.required() }),
  ],
})
```

- [ ] **Step 4: Create `studio/schemaTypes/workSample.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const workSample = defineType({
  name: 'workSample',
  title: 'Work Sample',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'category',
      title: 'Service Category',
      type: 'string',
      options: {
        list: [
          'Recording',
          'Music Production',
          'Mixing & Mastering',
          'Audiobook Productions',
          'Music Distribution & Publishing',
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'image', title: 'Image', type: 'image', validation: (rule) => rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'featured', title: 'Featured on homepage', type: 'boolean', initialValue: false }),
  ],
})
```

- [ ] **Step 5: Create `studio/schemaTypes/studioPhoto.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const studioPhoto = defineType({
  name: 'studioPhoto',
  title: 'Studio Photo',
  type: 'document',
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'image', validation: (rule) => rule.required() }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
  ],
})
```

- [ ] **Step 6: Create `studio/schemaTypes/equipmentItem.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const equipmentItem = defineType({
  name: 'equipmentItem',
  title: 'Equipment Item',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'specLine', title: 'Spec Line', type: 'string' }),
    defineField({ name: 'image', title: 'Image', type: 'image' }),
  ],
})
```

- [ ] **Step 7: Create `studio/schemaTypes/adCampaign.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const adCampaign = defineType({
  name: 'adCampaign',
  title: 'Ad Campaign',
  type: 'document',
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'image', validation: (rule) => rule.required() }),
    defineField({ name: 'link', title: 'Link URL', type: 'url', validation: (rule) => rule.required() }),
    defineField({ name: 'active', title: 'Active', type: 'boolean', initialValue: false }),
  ],
})
```

- [ ] **Step 8: Create `studio/schemaTypes/siteSettings.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'address', title: 'Address', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone Number', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'whatsappNumber', title: 'WhatsApp Number', type: 'string' }),
    defineField({ name: 'mapsEmbedUrl', title: 'Google Maps Embed URL', type: 'url' }),
    defineField({ name: 'termsText', title: 'Terms & Conditions Text', type: 'text' }),
  ],
})
```

- [ ] **Step 9: Create `studio/schemaTypes/index.ts`**

```ts
import { teamMember } from './teamMember'
import { clientLogo } from './clientLogo'
import { workSample } from './workSample'
import { studioPhoto } from './studioPhoto'
import { equipmentItem } from './equipmentItem'
import { adCampaign } from './adCampaign'
import { siteSettings } from './siteSettings'

export const schemaTypes = [
  teamMember,
  clientLogo,
  workSample,
  studioPhoto,
  equipmentItem,
  adCampaign,
  siteSettings,
]
```

- [ ] **Step 10: Create `studio/sanity.config.ts`**

```ts
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Meraki Studio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'placeholder0',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
})
```

- [ ] **Step 11: Install and verify the Studio builds**

Run: `cd studio && npm install && npm run build`
Expected: build succeeds, producing `studio/dist/`.

> Before real content can be edited, create a free project at sanity.io, note its Project ID, and set `SANITY_STUDIO_PROJECT_ID` (for the Studio) and `NEXT_PUBLIC_SANITY_PROJECT_ID` (for the Next.js app, see Task 7) to that value — either as environment variables or in a `.env.local` file. This is a one-time manual setup step tied to the owner's Sanity account, not something the codebase can supply.

- [ ] **Step 12: Commit**

```bash
cd .. && git add studio/
git commit -m "feat: scaffold Sanity Studio with content schemas"
```

---

## Task 7: Sanity client and TypeScript types

**Files:**
- Create: `src/lib/sanity/client.ts`
- Create: `src/lib/sanity/types.ts`
- Create: `.env.local.example`

**Interfaces:**
- Consumes: schema field names from Task 6.
- Produces: `sanityClient: SanityClient` and types `TeamMember`, `ClientLogo`, `ServiceCategory`, `WorkSample`, `StudioPhoto`, `EquipmentItem`, `AdCampaign`, `SiteSettings` — consumed by Task 8 (queries) and every fetching component task.

No unit tests in this task — it's typed configuration with no branching logic. Task 8 tests the functions that use these types.

- [ ] **Step 1: Create `src/lib/sanity/types.ts`**

```ts
export interface TeamMember {
  _id: string
  name: string
  role: string
  bio: string
  photoUrl: string
  socialLinks: { platform: string; url: string }[]
}

export interface ClientLogo {
  _id: string
  name: string
  logoUrl: string
}

export type ServiceCategory =
  | 'Recording'
  | 'Music Production'
  | 'Mixing & Mastering'
  | 'Audiobook Productions'
  | 'Music Distribution & Publishing'

export interface WorkSample {
  _id: string
  title: string
  category: ServiceCategory
  imageUrl: string
  description: string
  featured: boolean
}

export interface StudioPhoto {
  _id: string
  imageUrl: string
  caption: string
}

export interface EquipmentItem {
  _id: string
  name: string
  specLine: string
  imageUrl: string
}

export interface AdCampaign {
  _id: string
  imageUrl: string
  linkUrl: string
  active: boolean
}

export interface SiteSettings {
  address: string
  phone: string
  email: string
  whatsappNumber: string
  mapsEmbedUrl: string
  termsText: string
}
```

- [ ] **Step 2: Create `src/lib/sanity/client.ts`**

```ts
import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})
```

- [ ] **Step 3: Create `.env.local.example`**

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
NEXT_PUBLIC_ADSENSE_SLOT_ID=
```

- [ ] **Step 4: Verify the app still builds**

Run: `npm run build`
Expected: build succeeds (the client is unused so far but must type-check cleanly).

- [ ] **Step 5: Commit**

```bash
git add src/lib/sanity/client.ts src/lib/sanity/types.ts .env.local.example
git commit -m "feat: add Sanity client and content types"
```

---

## Task 8: Sanity query functions

**Files:**
- Create: `src/lib/sanity/queries.ts`
- Test: `src/lib/sanity/queries.test.ts`

**Interfaces:**
- Consumes: `sanityClient` and all types from Task 7.
- Produces: `getTeamMembers`, `getClientLogos`, `getWorkSamples`, `getFeaturedWorkSamples`, `getStudioPhotos`, `getEquipment`, `getActiveAdCampaign`, `getSiteSettings` (all `async` functions matching the return types below) — consumed by every homepage section task and both dedicated page tasks.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sanityClient } from './client'
import {
  getTeamMembers,
  getClientLogos,
  getWorkSamples,
  getFeaturedWorkSamples,
  getStudioPhotos,
  getEquipment,
  getActiveAdCampaign,
  getSiteSettings,
} from './queries'

vi.mock('./client', () => ({
  sanityClient: { fetch: vi.fn() },
}))

const fetchMock = vi.mocked(sanityClient.fetch)

beforeEach(() => {
  fetchMock.mockReset()
})

describe('sanity queries', () => {
  it('getTeamMembers returns the fetched array', async () => {
    fetchMock.mockResolvedValueOnce([{ _id: '1', name: 'A' }])
    const result = await getTeamMembers()
    expect(result).toEqual([{ _id: '1', name: 'A' }])
  })

  it('getClientLogos returns the fetched array', async () => {
    fetchMock.mockResolvedValueOnce([{ _id: '1', name: 'Client A' }])
    const result = await getClientLogos()
    expect(result).toEqual([{ _id: '1', name: 'Client A' }])
  })

  it('getWorkSamples returns the fetched array', async () => {
    fetchMock.mockResolvedValueOnce([{ _id: '1', title: 'Track' }])
    const result = await getWorkSamples()
    expect(result).toEqual([{ _id: '1', title: 'Track' }])
  })

  it('getFeaturedWorkSamples returns the fetched array', async () => {
    fetchMock.mockResolvedValueOnce([{ _id: '1', title: 'Featured Track' }])
    const result = await getFeaturedWorkSamples()
    expect(result).toEqual([{ _id: '1', title: 'Featured Track' }])
  })

  it('getStudioPhotos returns the fetched array', async () => {
    fetchMock.mockResolvedValueOnce([{ _id: '1', imageUrl: 'x.jpg' }])
    const result = await getStudioPhotos()
    expect(result).toEqual([{ _id: '1', imageUrl: 'x.jpg' }])
  })

  it('getEquipment returns the fetched array', async () => {
    fetchMock.mockResolvedValueOnce([{ _id: '1', name: 'Mic' }])
    const result = await getEquipment()
    expect(result).toEqual([{ _id: '1', name: 'Mic' }])
  })

  it('getActiveAdCampaign returns the first result when present', async () => {
    fetchMock.mockResolvedValueOnce([{ _id: '1', imageUrl: 'ad.jpg', linkUrl: 'https://x.com', active: true }])
    const result = await getActiveAdCampaign()
    expect(result).toEqual({ _id: '1', imageUrl: 'ad.jpg', linkUrl: 'https://x.com', active: true })
  })

  it('getActiveAdCampaign returns null when nothing is active', async () => {
    fetchMock.mockResolvedValueOnce([])
    const result = await getActiveAdCampaign()
    expect(result).toBeNull()
  })

  it('getSiteSettings returns the fetched document', async () => {
    fetchMock.mockResolvedValueOnce({
      address: '123 Main St',
      phone: '555-1234',
      email: 'hi@meraki.studio',
      whatsappNumber: '15551234',
      mapsEmbedUrl: 'https://maps.example',
      termsText: 'Terms text',
    })
    const result = await getSiteSettings()
    expect(result.address).toBe('123 Main St')
  })

  it('getSiteSettings falls back to empty strings when no document exists', async () => {
    fetchMock.mockResolvedValueOnce(null)
    const result = await getSiteSettings()
    expect(result).toEqual({
      address: '',
      phone: '',
      email: '',
      whatsappNumber: '',
      mapsEmbedUrl: '',
      termsText: '',
    })
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/lib/sanity/queries.test.ts`
Expected: FAIL — cannot find module `./queries`.

- [ ] **Step 3: Implement `src/lib/sanity/queries.ts`**

```ts
import { sanityClient } from './client'
import type {
  TeamMember,
  ClientLogo,
  WorkSample,
  StudioPhoto,
  EquipmentItem,
  AdCampaign,
  SiteSettings,
} from './types'

export async function getTeamMembers(): Promise<TeamMember[]> {
  return sanityClient.fetch(`*[_type == "teamMember"]{
    _id, name, role, bio, "photoUrl": photo.asset->url, socialLinks
  }`)
}

export async function getClientLogos(): Promise<ClientLogo[]> {
  return sanityClient.fetch(`*[_type == "clientLogo"]{
    _id, name, "logoUrl": logo.asset->url
  }`)
}

export async function getWorkSamples(): Promise<WorkSample[]> {
  return sanityClient.fetch(`*[_type == "workSample"]{
    _id, title, category, "imageUrl": image.asset->url, description, featured
  }`)
}

export async function getFeaturedWorkSamples(): Promise<WorkSample[]> {
  return sanityClient.fetch(`*[_type == "workSample" && featured == true]{
    _id, title, category, "imageUrl": image.asset->url, description, featured
  }`)
}

export async function getStudioPhotos(): Promise<StudioPhoto[]> {
  return sanityClient.fetch(`*[_type == "studioPhoto"]{
    _id, "imageUrl": image.asset->url, caption
  }`)
}

export async function getEquipment(): Promise<EquipmentItem[]> {
  return sanityClient.fetch(`*[_type == "equipmentItem"]{
    _id, name, specLine, "imageUrl": image.asset->url
  }`)
}

export async function getActiveAdCampaign(): Promise<AdCampaign | null> {
  const result = await sanityClient.fetch<AdCampaign[]>(`*[_type == "adCampaign" && active == true]{
    _id, "imageUrl": image.asset->url, "linkUrl": link, active
  }`)
  return result[0] ?? null
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const result = await sanityClient.fetch<SiteSettings | null>(`*[_type == "siteSettings"][0]{
    address, phone, email, whatsappNumber, mapsEmbedUrl, termsText
  }`)
  return (
    result ?? {
      address: '',
      phone: '',
      email: '',
      whatsappNumber: '',
      mapsEmbedUrl: '',
      termsText: '',
    }
  )
}
```

- [ ] **Step 4: Run the tests again**

Run: `npm test -- src/lib/sanity/queries.test.ts`
Expected: PASS, all 10 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/sanity/queries.ts src/lib/sanity/queries.test.ts
git commit -m "feat: add typed Sanity query functions with fallbacks"
```

---

## Task 9: Root layout providers

**Files:**
- Modify: `src/app/layout.tsx`
- Test: `src/app/layout.test.tsx`

**Interfaces:**
- Consumes: `ThemeProvider` from `@/context/ThemeContext` (Task 4).
- Produces: `RootLayout` now wraps `children` in `ThemeProvider`, giving every later component access to `useTheme`.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTheme } from '@/context/ThemeContext'
import RootLayout from './layout'

function ThemeReader() {
  const { theme } = useTheme()
  return <span data-testid="theme-reader">{theme}</span>
}

beforeEach(() => {
  window.localStorage.clear()
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

describe('RootLayout', () => {
  it('provides theme context to descendants', () => {
    render(<RootLayout><ThemeReader /></RootLayout>)
    expect(screen.getByTestId('theme-reader')).toHaveTextContent('light')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/app/layout.test.tsx`
Expected: FAIL — `useTheme must be used within ThemeProvider`.

- [ ] **Step 3: Update `src/app/layout.tsx`**

```tsx
import './globals.css'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { ThemeProvider } from '@/context/ThemeContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-heading' })

export const metadata: Metadata = {
  title: 'Meraki Studio',
  description:
    'Professional audio recording studio — recording, production, mixing & mastering, audiobooks, and distribution.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans bg-cream dark:bg-charcoal">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Run the test again**

Run: `npm test -- src/app/layout.test.tsx`
Expected: PASS.

- [ ] **Step 5: Verify the build still succeeds**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/app/layout.test.tsx
git commit -m "feat: wire ThemeProvider into root layout"
```

---

## Task 10: Nav (sticky header, mobile menu, theme toggle)

**Files:**
- Create: `src/components/Nav.tsx`
- Test: `src/components/Nav.test.tsx`

**Interfaces:**
- Consumes: `ThemeToggle` (Task 5).
- Produces: `Nav(): JSX.Element` — consumed by Task 21 (homepage assembly) and Tasks 22–23 (dedicated pages).

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ThemeProvider } from '@/context/ThemeContext'
import { Nav } from './Nav'

beforeEach(() => {
  window.localStorage.clear()
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

function renderNav() {
  return render(
    <ThemeProvider>
      <Nav />
    </ThemeProvider>
  )
}

describe('Nav', () => {
  it('has a Book Now button that jumps to the Contact section', () => {
    renderNav()
    expect(screen.getByTestId('nav-book-now')).toHaveAttribute('href', '#contact')
  })

  it('mobile menu is closed by default and opens on toggle click', () => {
    renderNav()
    expect(screen.queryByTestId('mobile-links')).not.toBeInTheDocument()
    const toggle = screen.getByTestId('menu-toggle')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)
    expect(screen.getByTestId('mobile-links')).toBeInTheDocument()
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(toggle)
    expect(screen.queryByTestId('mobile-links')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/Nav.test.tsx`
Expected: FAIL — cannot find module `./Nav`.

- [ ] **Step 3: Implement `src/components/Nav.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

const SECTION_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Studio', href: '#studio' },
  { label: 'Works', href: '#works' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
]

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-cream dark:bg-charcoal px-6 py-4 flex items-center justify-between">
      <span className="font-heading font-bold text-espresso dark:text-ivory">MERAKI STUDIO</span>

      <nav className="hidden md:flex gap-6" data-testid="desktop-links">
        {SECTION_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="text-text-muted-light dark:text-text-muted-dark">
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <a
          href="#contact"
          className="bg-espresso dark:bg-amber-cta text-cream dark:text-charcoal px-4 py-2 rounded-lg text-sm font-semibold"
          data-testid="nav-book-now"
        >
          Book Now
        </a>
        <button
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden"
          data-testid="menu-toggle"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <nav
          data-testid="mobile-links"
          className="absolute top-full left-0 w-full bg-cream dark:bg-charcoal flex flex-col p-4 md:hidden"
        >
          {SECTION_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="py-2 text-text-muted-light dark:text-text-muted-dark">
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
```

- [ ] **Step 4: Run the test again**

Run: `npm test -- src/components/Nav.test.tsx`
Expected: PASS, both tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.tsx src/components/Nav.test.tsx
git commit -m "feat: add sticky Nav with mobile menu"
```

---

## Task 11: Hero section

**Files:**
- Create: `src/components/Hero.tsx`
- Test: `src/components/Hero.test.tsx`

**Interfaces:**
- Produces: `Hero(): JSX.Element` — consumed by Task 21 (homepage assembly).

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the tagline and both CTAs', () => {
    render(<Hero />)
    expect(screen.getByText('Where your sound comes to life.')).toBeInTheDocument()
    expect(screen.getByText('Book Now')).toHaveAttribute('href', '#contact')
    expect(screen.getByText('Our Works')).toHaveAttribute('href', '/our-works')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/Hero.test.tsx`
Expected: FAIL — cannot find module `./Hero`.

- [ ] **Step 3: Implement `src/components/Hero.tsx`**

```tsx
export function Hero() {
  return (
    <section id="hero" className="bg-cream-alt dark:bg-charcoal-alt py-24 px-6 text-center">
      <h1 className="font-heading text-espresso dark:text-ivory text-4xl font-bold mb-4">
        Where your sound comes to life.
      </h1>
      <p className="text-text-muted-light dark:text-text-muted-dark mb-8">
        Recording · Mixing &amp; Mastering · Music Production
      </p>
      <div className="flex justify-center gap-4">
        <a
          href="#contact"
          className="bg-espresso dark:bg-amber-cta text-cream dark:text-charcoal px-6 py-3 rounded-lg font-semibold"
        >
          Book Now
        </a>
        <a
          href="/our-works"
          className="border-2 border-sofa-blue dark:border-sofa-blue-dark text-sofa-blue dark:text-sofa-blue-dark px-6 py-3 rounded-lg font-semibold"
        >
          Our Works
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run the test again**

Run: `npm test -- src/components/Hero.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx src/components/Hero.test.tsx
git commit -m "feat: add Hero section"
```

---

## Task 12: About section

**Files:**
- Create: `src/components/About.tsx`
- Test: `src/components/About.test.tsx`

**Interfaces:**
- Produces: `About(): JSX.Element` — consumed by Task 21 (homepage assembly).

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { About } from './About'

describe('About', () => {
  it('renders the About heading', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: 'About Meraki Studio' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/About.test.tsx`
Expected: FAIL — cannot find module `./About`.

- [ ] **Step 3: Implement `src/components/About.tsx`**

```tsx
export function About() {
  return (
    <section id="about" className="bg-cream dark:bg-charcoal py-16 px-6 max-w-3xl mx-auto text-center">
      <h2 className="font-heading text-espresso dark:text-ivory text-2xl font-bold mb-4">About Meraki Studio</h2>
      <p className="text-text-muted-light dark:text-text-muted-dark">
        Meraki Studio is a professional audio recording studio built for artists, producers, and storytellers who
        care about the craft. From tracking to mastering, every session is run with the same obsessive attention to
        detail.
      </p>
    </section>
  )
}
```

- [ ] **Step 4: Run the test again**

Run: `npm test -- src/components/About.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/About.tsx src/components/About.test.tsx
git commit -m "feat: add About section"
```

---

## Task 13: Services (fixed data) — ServiceCard + Services section

**Files:**
- Create: `src/content/services.ts`
- Create: `src/components/ServiceCard.tsx`
- Create: `src/components/Services.tsx`
- Test: `src/components/Services.test.tsx`

**Interfaces:**
- Produces: `Service` interface, `SERVICES: Service[]`, `ServiceCard({ service }: { service: Service }): JSX.Element`, `Services(): JSX.Element` — consumed by Task 21 (homepage assembly).

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Services } from './Services'

describe('Services', () => {
  it('renders all 5 fixed service categories', () => {
    render(<Services />)
    expect(screen.getByText('Recording')).toBeInTheDocument()
    expect(screen.getByText('Music Production')).toBeInTheDocument()
    expect(screen.getByText('Mixing & Mastering')).toBeInTheDocument()
    expect(screen.getByText('Audiobook Productions')).toBeInTheDocument()
    expect(screen.getByText('Music Distribution & Publishing')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/Services.test.tsx`
Expected: FAIL — cannot find module `./Services`.

- [ ] **Step 3: Create `src/content/services.ts`**

```ts
export interface Service {
  name: string
  description: string
}

export const SERVICES: Service[] = [
  { name: 'Recording', description: 'Professional recording sessions in a fully treated studio space.' },
  { name: 'Music Production', description: 'End-to-end production, from arrangement to final track.' },
  { name: 'Mixing & Mastering', description: 'Polished, release-ready mixes and masters.' },
  { name: 'Audiobook Productions', description: 'Narration recording and post-production for audiobooks.' },
  {
    name: 'Music Distribution & Publishing',
    description: 'Getting your music onto every major platform.',
  },
]
```

- [ ] **Step 4: Create `src/components/ServiceCard.tsx`**

```tsx
import type { Service } from '@/content/services'

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="bg-cream-alt dark:bg-charcoal-alt rounded-lg p-6" data-testid={`service-${service.name}`}>
      <h3 className="font-heading text-espresso dark:text-ivory font-semibold mb-2">{service.name}</h3>
      <p className="text-text-muted-light dark:text-text-muted-dark text-sm">{service.description}</p>
    </div>
  )
}
```

- [ ] **Step 5: Create `src/components/Services.tsx`**

```tsx
import { SERVICES } from '@/content/services'
import { ServiceCard } from './ServiceCard'

export function Services() {
  return (
    <section id="services" className="bg-cream dark:bg-charcoal py-16 px-6">
      <h2 className="font-heading text-espresso dark:text-ivory text-2xl font-bold mb-8">Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SERVICES.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Run the test again**

Run: `npm test -- src/components/Services.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/content/services.ts src/components/ServiceCard.tsx src/components/Services.tsx src/components/Services.test.tsx
git commit -m "feat: add Services section with fixed service data"
```

---

## Task 14: AdSlot (campaign / AdSense fallback logic)

**Files:**
- Create: `src/components/AdSlot.tsx`
- Test: `src/components/AdSlot.test.tsx`

**Interfaces:**
- Consumes: `getActiveAdCampaign` from `@/lib/sanity/queries` (Task 8).
- Produces: `AdSlot(): JSX.Element | null` — consumed by Task 21 (homepage assembly).

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getActiveAdCampaign } from '@/lib/sanity/queries'
import { AdSlot } from './AdSlot'

vi.mock('@/lib/sanity/queries', () => ({
  getActiveAdCampaign: vi.fn(),
}))

const getActiveAdCampaignMock = vi.mocked(getActiveAdCampaign)

beforeEach(() => {
  getActiveAdCampaignMock.mockReset()
  vi.unstubAllEnvs()
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('AdSlot', () => {
  it('renders the studio campaign when one is active', async () => {
    getActiveAdCampaignMock.mockResolvedValueOnce({
      _id: '1',
      imageUrl: 'campaign.jpg',
      linkUrl: 'https://meraki.studio/promo',
      active: true,
    })
    render(<AdSlot />)
    await waitFor(() => expect(screen.getByTestId('ad-slot-campaign')).toBeInTheDocument())
    expect(screen.getByTestId('ad-slot-campaign')).toHaveAttribute('href', 'https://meraki.studio/promo')
  })

  it('renders a placeholder when no campaign is active and AdSense is not configured', async () => {
    getActiveAdCampaignMock.mockResolvedValueOnce(null)
    render(<AdSlot />)
    await waitFor(() => expect(screen.getByTestId('ad-slot-placeholder')).toBeInTheDocument())
  })

  it('renders an AdSense unit when no campaign is active and AdSense is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_CLIENT_ID', 'ca-pub-123')
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_SLOT_ID', 'slot-456')
    getActiveAdCampaignMock.mockResolvedValueOnce(null)
    render(<AdSlot />)
    await waitFor(() => expect(screen.getByTestId('ad-slot-adsense')).toBeInTheDocument())
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/AdSlot.test.tsx`
Expected: FAIL — cannot find module `./AdSlot`.

- [ ] **Step 3: Implement `src/components/AdSlot.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { getActiveAdCampaign } from '@/lib/sanity/queries'
import type { AdCampaign } from '@/lib/sanity/types'

export function AdSlot() {
  const [campaign, setCampaign] = useState<AdCampaign | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    getActiveAdCampaign().then((result) => {
      if (!cancelled) {
        setCampaign(result)
        setLoaded(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!loaded) return null

  if (campaign) {
    return (
      <a
        href={campaign.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="ad-slot-campaign"
        className="block px-6 py-4"
      >
        <img src={campaign.imageUrl} alt="Meraki Studio campaign" className="w-full" />
      </a>
    )
  }

  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
  const adsenseSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID

  if (!adsenseClient || !adsenseSlot) {
    return <div data-testid="ad-slot-placeholder" className="ad-slot-placeholder h-24 mx-6" />
  }

  return (
    <ins
      className="adsbygoogle block mx-6"
      style={{ display: 'block' }}
      data-ad-client={adsenseClient}
      data-ad-slot={adsenseSlot}
      data-testid="ad-slot-adsense"
    />
  )
}
```

- [ ] **Step 4: Run the tests again**

Run: `npm test -- src/components/AdSlot.test.tsx`
Expected: PASS, all 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/AdSlot.tsx src/components/AdSlot.test.tsx
git commit -m "feat: add AdSlot with campaign/AdSense fallback logic"
```

---

## Task 15: Studio section — EquipmentCard + StudioGallery (lightbox)

**Files:**
- Create: `src/components/EquipmentCard.tsx`
- Test: `src/components/EquipmentCard.test.tsx`
- Create: `src/components/StudioGallery.tsx`
- Test: `src/components/StudioGallery.test.tsx`
- Create: `src/components/Studio.tsx`
- Test: `src/components/Studio.test.tsx`

**Interfaces:**
- Consumes: `getStudioPhotos`, `getEquipment` from `@/lib/sanity/queries` (Task 8); `EquipmentItem`, `StudioPhoto` types (Task 7).
- Produces: `EquipmentCard({ item }: { item: EquipmentItem }): JSX.Element`, `StudioGallery({ photos }: { photos: StudioPhoto[] }): JSX.Element`, `Studio(): JSX.Element` — `Studio` consumed by Task 21.

- [ ] **Step 1: Write the failing EquipmentCard test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { EquipmentCard } from './EquipmentCard'

describe('EquipmentCard', () => {
  it('renders the equipment name and spec line', () => {
    render(<EquipmentCard item={{ _id: '1', name: 'Neumann U87', specLine: 'Large-diaphragm condenser', imageUrl: 'mic.jpg' }} />)
    expect(screen.getByText('Neumann U87')).toBeInTheDocument()
    expect(screen.getByText('Large-diaphragm condenser')).toBeInTheDocument()
    expect(screen.getByAltText('Neumann U87')).toHaveAttribute('src', 'mic.jpg')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/EquipmentCard.test.tsx`
Expected: FAIL — cannot find module `./EquipmentCard`.

- [ ] **Step 3: Implement `src/components/EquipmentCard.tsx`**

```tsx
import type { EquipmentItem } from '@/lib/sanity/types'

export function EquipmentCard({ item }: { item: EquipmentItem }) {
  return (
    <div className="bg-cream-alt dark:bg-charcoal-alt rounded-lg p-4" data-testid={`equipment-${item._id}`}>
      <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover rounded mb-2" />
      <h3 className="text-espresso dark:text-ivory font-semibold text-sm">{item.name}</h3>
      <p className="text-text-muted-light dark:text-text-muted-dark text-xs">{item.specLine}</p>
    </div>
  )
}
```

- [ ] **Step 4: Run the EquipmentCard test again**

Run: `npm test -- src/components/EquipmentCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Write the failing StudioGallery test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StudioGallery } from './StudioGallery'

const PHOTOS = [
  { _id: 'a', imageUrl: 'a.jpg', caption: 'Control room' },
  { _id: 'b', imageUrl: 'b.jpg', caption: 'Booth' },
]

describe('StudioGallery', () => {
  it('opens the lightbox with the clicked photo and closes on backdrop click', () => {
    render(<StudioGallery photos={PHOTOS} />)
    expect(screen.queryByTestId('gallery-lightbox')).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('gallery-thumb-a'))
    const lightbox = screen.getByTestId('gallery-lightbox')
    expect(lightbox).toBeInTheDocument()
    expect(screen.getByAltText('Control room')).toHaveAttribute('src', 'a.jpg')

    fireEvent.click(lightbox)
    expect(screen.queryByTestId('gallery-lightbox')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npm test -- src/components/StudioGallery.test.tsx`
Expected: FAIL — cannot find module `./StudioGallery`.

- [ ] **Step 7: Implement `src/components/StudioGallery.tsx`**

```tsx
'use client'
import { useState } from 'react'
import type { StudioPhoto } from '@/lib/sanity/types'

export function StudioGallery({ photos }: { photos: StudioPhoto[] }) {
  const [activePhoto, setActivePhoto] = useState<StudioPhoto | null>(null)

  return (
    <div>
      <div className="grid grid-cols-2 gap-4" data-testid="studio-gallery-grid">
        {photos.map((photo) => (
          <button key={photo._id} onClick={() => setActivePhoto(photo)} data-testid={`gallery-thumb-${photo._id}`}>
            <img src={photo.imageUrl} alt={photo.caption} className="w-full h-40 object-cover rounded" />
          </button>
        ))}
      </div>
      {activePhoto && (
        <div
          data-testid="gallery-lightbox"
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
        >
          <img src={activePhoto.imageUrl} alt={activePhoto.caption} className="max-h-[80vh] max-w-[90vw]" />
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 8: Run the StudioGallery test again**

Run: `npm test -- src/components/StudioGallery.test.tsx`
Expected: PASS.

- [ ] **Step 9: Write the failing Studio section test**

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getStudioPhotos, getEquipment } from '@/lib/sanity/queries'
import { Studio } from './Studio'

vi.mock('@/lib/sanity/queries', () => ({
  getStudioPhotos: vi.fn(),
  getEquipment: vi.fn(),
}))

const getStudioPhotosMock = vi.mocked(getStudioPhotos)
const getEquipmentMock = vi.mocked(getEquipment)

beforeEach(() => {
  getStudioPhotosMock.mockReset()
  getEquipmentMock.mockReset()
})

describe('Studio', () => {
  it('renders fetched photos and equipment', async () => {
    getStudioPhotosMock.mockResolvedValueOnce([{ _id: 'p1', imageUrl: 'photo.jpg', caption: 'Live room' }])
    getEquipmentMock.mockResolvedValueOnce([{ _id: 'e1', name: 'SSL Console', specLine: '48-channel', imageUrl: 'ssl.jpg' }])

    render(<Studio />)

    await waitFor(() => expect(screen.getByTestId('gallery-thumb-p1')).toBeInTheDocument())
    expect(screen.getByTestId('equipment-e1')).toBeInTheDocument()
  })
})
```

- [ ] **Step 10: Run it to verify it fails**

Run: `npm test -- src/components/Studio.test.tsx`
Expected: FAIL — cannot find module `./Studio`.

- [ ] **Step 11: Implement `src/components/Studio.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { getStudioPhotos, getEquipment } from '@/lib/sanity/queries'
import type { StudioPhoto, EquipmentItem } from '@/lib/sanity/types'
import { StudioGallery } from './StudioGallery'
import { EquipmentCard } from './EquipmentCard'

export function Studio() {
  const [photos, setPhotos] = useState<StudioPhoto[]>([])
  const [equipment, setEquipment] = useState<EquipmentItem[]>([])

  useEffect(() => {
    let cancelled = false
    getStudioPhotos().then((result) => {
      if (!cancelled) setPhotos(result)
    })
    getEquipment().then((result) => {
      if (!cancelled) setEquipment(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="studio" className="bg-cream dark:bg-charcoal py-16 px-6">
      <h2 className="font-heading text-espresso dark:text-ivory text-2xl font-bold mb-8">The Studio</h2>
      <StudioGallery photos={photos} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {equipment.map((item) => (
          <EquipmentCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 12: Run the Studio test again**

Run: `npm test -- src/components/Studio.test.tsx`
Expected: PASS.

- [ ] **Step 13: Commit**

```bash
git add src/components/EquipmentCard.tsx src/components/EquipmentCard.test.tsx src/components/StudioGallery.tsx src/components/StudioGallery.test.tsx src/components/Studio.tsx src/components/Studio.test.tsx
git commit -m "feat: add Studio section with equipment grid and photo lightbox"
```

---

## Task 16: Our Works — grouping util, WorkSampleCard, WorksTeaser

**Files:**
- Create: `src/lib/works.ts`
- Test: `src/lib/works.test.ts`
- Create: `src/components/WorkSampleCard.tsx`
- Test: `src/components/WorkSampleCard.test.tsx`
- Create: `src/components/WorksTeaser.tsx`
- Test: `src/components/WorksTeaser.test.tsx`

**Interfaces:**
- Consumes: `WorkSample`, `ServiceCategory` types (Task 7); `getFeaturedWorkSamples` (Task 8).
- Produces: `SERVICE_CATEGORIES: ServiceCategory[]`, `groupWorksByCategory(works: WorkSample[]): Record<ServiceCategory, WorkSample[]>` — consumed by Task 22 (`/our-works` page). `WorkSampleCard({ work }: { work: WorkSample }): JSX.Element` — consumed by Task 22. `WorksTeaser(): JSX.Element` — consumed by Task 21.

- [ ] **Step 1: Write the failing grouping test**

```ts
import { describe, it, expect } from 'vitest'
import { groupWorksByCategory, SERVICE_CATEGORIES } from './works'
import type { WorkSample } from './sanity/types'

const WORKS: WorkSample[] = [
  { _id: '1', title: 'Track A', category: 'Recording', imageUrl: 'a.jpg', description: '', featured: false },
  { _id: '2', title: 'Track B', category: 'Mixing & Mastering', imageUrl: 'b.jpg', description: '', featured: false },
  { _id: '3', title: 'Track C', category: 'Recording', imageUrl: 'c.jpg', description: '', featured: false },
]

describe('groupWorksByCategory', () => {
  it('groups works under their category and keeps every category present', () => {
    const grouped = groupWorksByCategory(WORKS)
    expect(grouped['Recording'].map((w) => w._id)).toEqual(['1', '3'])
    expect(grouped['Mixing & Mastering'].map((w) => w._id)).toEqual(['2'])
    expect(grouped['Music Production']).toEqual([])
  })

  it('returns every category with an empty array for an empty input', () => {
    const grouped = groupWorksByCategory([])
    for (const category of SERVICE_CATEGORIES) {
      expect(grouped[category]).toEqual([])
    }
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/lib/works.test.ts`
Expected: FAIL — cannot find module `./works`.

- [ ] **Step 3: Implement `src/lib/works.ts`**

```ts
import type { WorkSample, ServiceCategory } from './sanity/types'

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  'Recording',
  'Music Production',
  'Mixing & Mastering',
  'Audiobook Productions',
  'Music Distribution & Publishing',
]

export function groupWorksByCategory(works: WorkSample[]): Record<ServiceCategory, WorkSample[]> {
  const grouped = SERVICE_CATEGORIES.reduce((acc, category) => {
    acc[category] = []
    return acc
  }, {} as Record<ServiceCategory, WorkSample[]>)

  for (const work of works) {
    grouped[work.category].push(work)
  }

  return grouped
}
```

- [ ] **Step 4: Run the grouping test again**

Run: `npm test -- src/lib/works.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the failing WorkSampleCard test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WorkSampleCard } from './WorkSampleCard'

describe('WorkSampleCard', () => {
  it('renders the title and description', () => {
    render(
      <WorkSampleCard
        work={{ _id: '1', title: 'Album Mix', category: 'Mixing & Mastering', imageUrl: 'mix.jpg', description: 'A full album mix.', featured: true }}
      />
    )
    expect(screen.getByText('Album Mix')).toBeInTheDocument()
    expect(screen.getByText('A full album mix.')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npm test -- src/components/WorkSampleCard.test.tsx`
Expected: FAIL — cannot find module `./WorkSampleCard`.

- [ ] **Step 7: Implement `src/components/WorkSampleCard.tsx`**

```tsx
import type { WorkSample } from '@/lib/sanity/types'

export function WorkSampleCard({ work }: { work: WorkSample }) {
  return (
    <div className="bg-cream-alt dark:bg-charcoal-alt rounded-lg overflow-hidden" data-testid={`work-${work._id}`}>
      <img src={work.imageUrl} alt={work.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="font-heading text-espresso dark:text-ivory font-semibold">{work.title}</h3>
        <p className="text-text-muted-light dark:text-text-muted-dark text-sm">{work.description}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Run the WorkSampleCard test again**

Run: `npm test -- src/components/WorkSampleCard.test.tsx`
Expected: PASS.

- [ ] **Step 9: Write the failing WorksTeaser test**

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getFeaturedWorkSamples } from '@/lib/sanity/queries'
import { WorksTeaser } from './WorksTeaser'

vi.mock('@/lib/sanity/queries', () => ({
  getFeaturedWorkSamples: vi.fn(),
}))

const getFeaturedWorkSamplesMock = vi.mocked(getFeaturedWorkSamples)

beforeEach(() => {
  getFeaturedWorkSamplesMock.mockReset()
})

describe('WorksTeaser', () => {
  it('renders featured works and a link to the full works page', async () => {
    getFeaturedWorkSamplesMock.mockResolvedValueOnce([
      { _id: '1', title: 'Hit Single', category: 'Recording', imageUrl: 'hit.jpg', description: '', featured: true },
    ])
    render(<WorksTeaser />)
    await waitFor(() => expect(screen.getByText('Hit Single')).toBeInTheDocument())
    expect(screen.getByText('View All Works')).toHaveAttribute('href', '/our-works')
  })
})
```

- [ ] **Step 10: Run it to verify it fails**

Run: `npm test -- src/components/WorksTeaser.test.tsx`
Expected: FAIL — cannot find module `./WorksTeaser`.

- [ ] **Step 11: Implement `src/components/WorksTeaser.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { getFeaturedWorkSamples } from '@/lib/sanity/queries'
import type { WorkSample } from '@/lib/sanity/types'
import { WorkSampleCard } from './WorkSampleCard'
import { LINK_CLASS } from '@/lib/styles'

export function WorksTeaser() {
  const [works, setWorks] = useState<WorkSample[]>([])

  useEffect(() => {
    let cancelled = false
    getFeaturedWorkSamples().then((result) => {
      if (!cancelled) setWorks(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="works" className="bg-cream dark:bg-charcoal py-16 px-6">
      <h2 className="font-heading text-espresso dark:text-ivory text-2xl font-bold mb-8">Our Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {works.map((work) => (
          <WorkSampleCard key={work._id} work={work} />
        ))}
      </div>
      <a href="/our-works" className={`${LINK_CLASS} block mt-6`}>
        View All Works
      </a>
    </section>
  )
}
```

- [ ] **Step 12: Run the WorksTeaser test again**

Run: `npm test -- src/components/WorksTeaser.test.tsx`
Expected: PASS.

- [ ] **Step 13: Commit**

```bash
git add src/lib/works.ts src/lib/works.test.ts src/components/WorkSampleCard.tsx src/components/WorkSampleCard.test.tsx src/components/WorksTeaser.tsx src/components/WorksTeaser.test.tsx
git commit -m "feat: add works grouping util, WorkSampleCard, and WorksTeaser"
```

---

## Task 17: Team section

**Files:**
- Create: `src/components/TeamMemberCard.tsx`
- Test: `src/components/TeamMemberCard.test.tsx`
- Create: `src/components/Team.tsx`
- Test: `src/components/Team.test.tsx`

**Interfaces:**
- Consumes: `TeamMember` type (Task 7), `getTeamMembers` (Task 8), `LINK_CLASS` (Task 2).
- Produces: `TeamMemberCard({ member }: { member: TeamMember }): JSX.Element`, `Team(): JSX.Element` — `Team` consumed by Task 21.

- [ ] **Step 1: Write the failing TeamMemberCard test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TeamMemberCard } from './TeamMemberCard'

describe('TeamMemberCard', () => {
  it('renders name, role, bio, and social links', () => {
    render(
      <TeamMemberCard
        member={{
          _id: '1',
          name: 'Alex Rivera',
          role: 'Lead Engineer',
          bio: 'Ten years behind the desk.',
          photoUrl: 'alex.jpg',
          socialLinks: [{ platform: 'Instagram', url: 'https://instagram.com/alex' }],
        }}
      />
    )
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument()
    expect(screen.getByText('Lead Engineer')).toBeInTheDocument()
    expect(screen.getByText('Instagram')).toHaveAttribute('href', 'https://instagram.com/alex')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/TeamMemberCard.test.tsx`
Expected: FAIL — cannot find module `./TeamMemberCard`.

- [ ] **Step 3: Implement `src/components/TeamMemberCard.tsx`**

```tsx
import type { TeamMember } from '@/lib/sanity/types'
import { LINK_CLASS } from '@/lib/styles'

export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="bg-cream-alt dark:bg-charcoal-alt rounded-lg p-6 text-center" data-testid={`team-${member._id}`}>
      <img src={member.photoUrl} alt={member.name} className="w-24 h-24 rounded-full mx-auto object-cover mb-4" />
      <h3 className="font-heading text-espresso dark:text-ivory font-semibold">{member.name}</h3>
      <p className="text-sofa-blue dark:text-sofa-blue-dark text-sm mb-2">{member.role}</p>
      <p className="text-text-muted-light dark:text-text-muted-dark text-sm mb-3">{member.bio}</p>
      <div className="flex justify-center gap-3">
        {member.socialLinks.map((link) => (
          <a key={link.platform} href={link.url} className={LINK_CLASS} target="_blank" rel="noopener noreferrer">
            {link.platform}
          </a>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run the TeamMemberCard test again**

Run: `npm test -- src/components/TeamMemberCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Write the failing Team section test**

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTeamMembers } from '@/lib/sanity/queries'
import { Team } from './Team'

vi.mock('@/lib/sanity/queries', () => ({
  getTeamMembers: vi.fn(),
}))

const getTeamMembersMock = vi.mocked(getTeamMembers)

beforeEach(() => {
  getTeamMembersMock.mockReset()
})

describe('Team', () => {
  it('renders each fetched team member', async () => {
    getTeamMembersMock.mockResolvedValueOnce([
      { _id: '1', name: 'Alex Rivera', role: 'Lead Engineer', bio: '', photoUrl: 'alex.jpg', socialLinks: [] },
      { _id: '2', name: 'Sam Lee', role: 'Producer', bio: '', photoUrl: 'sam.jpg', socialLinks: [] },
    ])
    render(<Team />)
    await waitFor(() => expect(screen.getByTestId('team-1')).toBeInTheDocument())
    expect(screen.getByTestId('team-2')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npm test -- src/components/Team.test.tsx`
Expected: FAIL — cannot find module `./Team`.

- [ ] **Step 7: Implement `src/components/Team.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { getTeamMembers } from '@/lib/sanity/queries'
import type { TeamMember } from '@/lib/sanity/types'
import { TeamMemberCard } from './TeamMemberCard'

export function Team() {
  const [members, setMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    let cancelled = false
    getTeamMembers().then((result) => {
      if (!cancelled) setMembers(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="team" className="bg-cream-alt dark:bg-charcoal-alt py-16 px-6">
      <h2 className="font-heading text-espresso dark:text-ivory text-2xl font-bold mb-8">Meet the Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {members.map((member) => (
          <TeamMemberCard key={member._id} member={member} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 8: Run the Team test again**

Run: `npm test -- src/components/Team.test.tsx`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/components/TeamMemberCard.tsx src/components/TeamMemberCard.test.tsx src/components/Team.tsx src/components/Team.test.tsx
git commit -m "feat: add Team section"
```

---

## Task 18: Clientele — logo duplication util, ClientLogoStrip, Clientele section

**Files:**
- Create: `src/lib/logoStrip.ts`
- Test: `src/lib/logoStrip.test.ts`
- Create: `src/components/ClientLogoStrip.tsx`
- Test: `src/components/ClientLogoStrip.test.tsx`
- Create: `src/components/Clientele.tsx`
- Test: `src/components/Clientele.test.tsx`

**Interfaces:**
- Consumes: `ClientLogo` type (Task 7), `getClientLogos` (Task 8), `animate-scroll` Tailwind utility (Task 2).
- Produces: `duplicateForLoop<T>(items: T[]): T[]`, `ClientLogoStrip({ logos }: { logos: ClientLogo[] }): JSX.Element`, `Clientele(): JSX.Element` — `Clientele` consumed by Task 21.

- [ ] **Step 1: Write the failing duplication test**

```ts
import { describe, it, expect } from 'vitest'
import { duplicateForLoop } from './logoStrip'

describe('duplicateForLoop', () => {
  it('doubles the list for a seamless scroll loop', () => {
    expect(duplicateForLoop([1, 2, 3])).toEqual([1, 2, 3, 1, 2, 3])
  })

  it('handles an empty list', () => {
    expect(duplicateForLoop([])).toEqual([])
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/lib/logoStrip.test.ts`
Expected: FAIL — cannot find module `./logoStrip`.

- [ ] **Step 3: Implement `src/lib/logoStrip.ts`**

```ts
export function duplicateForLoop<T>(items: T[]): T[] {
  return [...items, ...items]
}
```

- [ ] **Step 4: Run the duplication test again**

Run: `npm test -- src/lib/logoStrip.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the failing ClientLogoStrip test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ClientLogoStrip } from './ClientLogoStrip'

const LOGOS = [
  { _id: '1', name: 'Client A', logoUrl: 'a.png' },
  { _id: '2', name: 'Client B', logoUrl: 'b.png' },
]

describe('ClientLogoStrip', () => {
  it('duplicates the logos for a seamless loop and pauses on hover', () => {
    render(<ClientLogoStrip logos={LOGOS} />)
    const strip = screen.getByTestId('logo-strip')
    expect(screen.getAllByRole('img')).toHaveLength(4)
    expect(strip.className).toContain('animate-scroll')

    fireEvent.mouseEnter(strip)
    expect(strip.className).toContain('animate-none')

    fireEvent.mouseLeave(strip)
    expect(strip.className).toContain('animate-scroll')
  })
})
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npm test -- src/components/ClientLogoStrip.test.tsx`
Expected: FAIL — cannot find module `./ClientLogoStrip`.

- [ ] **Step 7: Implement `src/components/ClientLogoStrip.tsx`**

```tsx
'use client'
import { useState } from 'react'
import type { ClientLogo } from '@/lib/sanity/types'
import { duplicateForLoop } from '@/lib/logoStrip'

export function ClientLogoStrip({ logos }: { logos: ClientLogo[] }) {
  const [paused, setPaused] = useState(false)
  const loopedLogos = duplicateForLoop(logos)

  return (
    <div
      data-testid="logo-strip"
      className={`flex gap-8 overflow-hidden ${paused ? 'animate-none' : 'animate-scroll'}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {loopedLogos.map((logo, index) => (
        <img key={`${logo._id}-${index}`} src={logo.logoUrl} alt={logo.name} className="h-12 object-contain" />
      ))}
    </div>
  )
}
```

- [ ] **Step 8: Run the ClientLogoStrip test again**

Run: `npm test -- src/components/ClientLogoStrip.test.tsx`
Expected: PASS.

- [ ] **Step 9: Write the failing Clientele section test**

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getClientLogos } from '@/lib/sanity/queries'
import { Clientele } from './Clientele'

vi.mock('@/lib/sanity/queries', () => ({
  getClientLogos: vi.fn(),
}))

const getClientLogosMock = vi.mocked(getClientLogos)

beforeEach(() => {
  getClientLogosMock.mockReset()
})

describe('Clientele', () => {
  it('renders the fetched logos in the strip', async () => {
    getClientLogosMock.mockResolvedValueOnce([{ _id: '1', name: 'Client A', logoUrl: 'a.png' }])
    render(<Clientele />)
    await waitFor(() => expect(screen.getAllByAltText('Client A')).toHaveLength(2))
  })
})
```

- [ ] **Step 10: Run it to verify it fails**

Run: `npm test -- src/components/Clientele.test.tsx`
Expected: FAIL — cannot find module `./Clientele`.

- [ ] **Step 11: Implement `src/components/Clientele.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { getClientLogos } from '@/lib/sanity/queries'
import type { ClientLogo } from '@/lib/sanity/types'
import { ClientLogoStrip } from './ClientLogoStrip'

export function Clientele() {
  const [logos, setLogos] = useState<ClientLogo[]>([])

  useEffect(() => {
    let cancelled = false
    getClientLogos().then((result) => {
      if (!cancelled) setLogos(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="clientele" className="bg-cream dark:bg-charcoal py-16 px-6">
      <h2 className="font-heading text-espresso dark:text-ivory text-2xl font-bold mb-8 text-center">
        Our Clientele
      </h2>
      <ClientLogoStrip logos={logos} />
    </section>
  )
}
```

- [ ] **Step 12: Run the Clientele test again**

Run: `npm test -- src/components/Clientele.test.tsx`
Expected: PASS.

- [ ] **Step 13: Commit**

```bash
git add src/lib/logoStrip.ts src/lib/logoStrip.test.ts src/components/ClientLogoStrip.tsx src/components/ClientLogoStrip.test.tsx src/components/Clientele.tsx src/components/Clientele.test.tsx
git commit -m "feat: add Clientele section with auto-scrolling logo strip"
```

---

## Task 19: Contact section

**Files:**
- Create: `src/components/Contact.tsx`
- Test: `src/components/Contact.test.tsx`

**Interfaces:**
- Consumes: `SiteSettings` type (Task 7), `getSiteSettings` (Task 8), `buildWhatsAppLink` (Task 3).
- Produces: `Contact(): JSX.Element` — consumed by Task 21.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSiteSettings } from '@/lib/sanity/queries'
import { Contact } from './Contact'

vi.mock('@/lib/sanity/queries', () => ({
  getSiteSettings: vi.fn(),
}))

const getSiteSettingsMock = vi.mocked(getSiteSettings)

beforeEach(() => {
  getSiteSettingsMock.mockReset()
})

describe('Contact', () => {
  it('renders contact details, map, and a correct WhatsApp link', async () => {
    getSiteSettingsMock.mockResolvedValueOnce({
      address: '123 Main St',
      phone: '555-1234',
      email: 'hi@meraki.studio',
      whatsappNumber: '+1 555 123 4567',
      mapsEmbedUrl: 'https://maps.example/embed',
      termsText: '',
    })
    render(<Contact />)

    await waitFor(() => expect(screen.getByTestId('contact-address')).toHaveTextContent('123 Main St'))
    expect(screen.getByTestId('contact-phone')).toHaveTextContent('555-1234')
    expect(screen.getByTestId('contact-email')).toHaveTextContent('hi@meraki.studio')
    expect(screen.getByTestId('contact-map')).toHaveAttribute('src', 'https://maps.example/embed')
    expect(screen.getByText('Book Now on WhatsApp')).toHaveAttribute(
      'href',
      "https://wa.me/15551234567?text=Hi%20Meraki%20Studio%2C%20I'd%20like%20to%20book%20a%20session."
    )
  })

  it('omits the map when no embed URL is set', async () => {
    getSiteSettingsMock.mockResolvedValueOnce({
      address: '',
      phone: '',
      email: '',
      whatsappNumber: '',
      mapsEmbedUrl: '',
      termsText: '',
    })
    render(<Contact />)
    await waitFor(() => expect(getSiteSettingsMock).toHaveBeenCalled())
    expect(screen.queryByTestId('contact-map')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/Contact.test.tsx`
Expected: FAIL — cannot find module `./Contact`.

- [ ] **Step 3: Implement `src/components/Contact.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { getSiteSettings } from '@/lib/sanity/queries'
import type { SiteSettings } from '@/lib/sanity/types'
import { buildWhatsAppLink } from '@/lib/whatsapp'

const EMPTY_SETTINGS: SiteSettings = {
  address: '',
  phone: '',
  email: '',
  whatsappNumber: '',
  mapsEmbedUrl: '',
  termsText: '',
}

export function Contact() {
  const [settings, setSettings] = useState<SiteSettings>(EMPTY_SETTINGS)

  useEffect(() => {
    let cancelled = false
    getSiteSettings().then((result) => {
      if (!cancelled) setSettings(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="contact" className="bg-cream-alt dark:bg-charcoal-alt py-16 px-6">
      <h2 className="font-heading text-espresso dark:text-ivory text-2xl font-bold mb-8">Contact Us</h2>
      <p className="text-text-muted-light dark:text-text-muted-dark" data-testid="contact-address">
        {settings.address}
      </p>
      <p className="text-text-muted-light dark:text-text-muted-dark" data-testid="contact-phone">
        {settings.phone}
      </p>
      <p className="text-text-muted-light dark:text-text-muted-dark" data-testid="contact-email">
        {settings.email}
      </p>
      {settings.mapsEmbedUrl && (
        <iframe
          src={settings.mapsEmbedUrl}
          title="Studio location"
          className="w-full h-64 mt-4"
          data-testid="contact-map"
        />
      )}
      <a
        href={buildWhatsAppLink(settings.whatsappNumber, "Hi Meraki Studio, I'd like to book a session.")}
        className="inline-block bg-espresso dark:bg-amber-cta text-cream dark:text-charcoal px-6 py-3 rounded-lg font-semibold mt-6"
        target="_blank"
        rel="noopener noreferrer"
      >
        Book Now on WhatsApp
      </a>
    </section>
  )
}
```

- [ ] **Step 4: Run the tests again**

Run: `npm test -- src/components/Contact.test.tsx`
Expected: PASS, both tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/Contact.tsx src/components/Contact.test.tsx
git commit -m "feat: add Contact section with WhatsApp booking link"
```

---

## Task 20: Footer

**Files:**
- Create: `src/components/Footer.tsx`
- Test: `src/components/Footer.test.tsx`

**Interfaces:**
- Consumes: `LINK_CLASS` (Task 2).
- Produces: `Footer(): JSX.Element` — consumed by Task 21 and Tasks 22–23.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Footer } from './Footer'

describe('Footer', () => {
  it('links to the Terms & Conditions page with visible link styling', () => {
    render(<Footer />)
    const termsLink = screen.getByText('Terms & Conditions')
    expect(termsLink).toHaveAttribute('href', '/terms')
    expect(termsLink.className).toContain('underline')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/Footer.test.tsx`
Expected: FAIL — cannot find module `./Footer`.

- [ ] **Step 3: Implement `src/components/Footer.tsx`**

```tsx
import { LINK_CLASS } from '@/lib/styles'

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <span className="font-heading font-bold">MERAKI STUDIO</span>
      <nav className="flex gap-4 text-sm">
        <a href="#about" className={LINK_CLASS}>
          About
        </a>
        <a href="#services" className={LINK_CLASS}>
          Services
        </a>
        <a href="#contact" className={LINK_CLASS}>
          Contact
        </a>
        <a href="/terms" className={LINK_CLASS}>
          Terms & Conditions
        </a>
      </nav>
    </footer>
  )
}
```

- [ ] **Step 4: Run the test again**

Run: `npm test -- src/components/Footer.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.tsx src/components/Footer.test.tsx
git commit -m "feat: add Footer with Terms & Conditions link"
```

---

## Task 21: Homepage assembly

**Files:**
- Modify: `src/app/page.tsx`
- Test: `src/app/page.test.tsx`

**Interfaces:**
- Consumes: `Nav` (10), `Hero` (11), `About` (12), `Services` (13), `AdSlot` (14), `Studio` (15), `WorksTeaser` (16), `Team` (17), `Clientele` (18), `Contact` (19), `Footer` (20).
- Produces: the assembled homepage at `/`, section order locked by an integration test.

- [ ] **Step 1: Write the failing integration test**

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getStudioPhotos,
  getEquipment,
  getFeaturedWorkSamples,
  getTeamMembers,
  getClientLogos,
  getSiteSettings,
  getActiveAdCampaign,
} from '@/lib/sanity/queries'
import HomePage from './page'

vi.mock('@/lib/sanity/queries', () => ({
  getStudioPhotos: vi.fn(),
  getEquipment: vi.fn(),
  getFeaturedWorkSamples: vi.fn(),
  getTeamMembers: vi.fn(),
  getClientLogos: vi.fn(),
  getSiteSettings: vi.fn(),
  getActiveAdCampaign: vi.fn(),
}))

beforeEach(() => {
  vi.mocked(getStudioPhotos).mockResolvedValue([])
  vi.mocked(getEquipment).mockResolvedValue([])
  vi.mocked(getFeaturedWorkSamples).mockResolvedValue([])
  vi.mocked(getTeamMembers).mockResolvedValue([])
  vi.mocked(getClientLogos).mockResolvedValue([])
  vi.mocked(getSiteSettings).mockResolvedValue({
    address: '',
    phone: '',
    email: '',
    whatsappNumber: '',
    mapsEmbedUrl: '',
    termsText: '',
  })
  vi.mocked(getActiveAdCampaign).mockResolvedValue(null)
  window.localStorage.clear()
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

describe('HomePage', () => {
  it('renders every section in the locked order', async () => {
    render(<HomePage />)

    await waitFor(() => expect(screen.getByTestId('ad-slot-placeholder')).toBeInTheDocument())

    const headingTexts = screen.getAllByRole('heading').map((heading) => heading.textContent)
    expect(headingTexts).toEqual([
      'Where your sound comes to life.',
      'About Meraki Studio',
      'Services',
      'The Studio',
      'Our Works',
      'Meet the Team',
      'Our Clientele',
      'Contact Us',
    ])
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/app/page.test.tsx`
Expected: FAIL — current `page.tsx` only renders `<main>Meraki Studio</main>`.

- [ ] **Step 3: Update `src/app/page.tsx`**

```tsx
import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Services } from '@/components/Services'
import { AdSlot } from '@/components/AdSlot'
import { Studio } from '@/components/Studio'
import { WorksTeaser } from '@/components/WorksTeaser'
import { Team } from '@/components/Team'
import { Clientele } from '@/components/Clientele'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <main>
      <Nav />
      <Hero />
      <About />
      <Services />
      <AdSlot />
      <Studio />
      <WorksTeaser />
      <Team />
      <Clientele />
      <Contact />
      <Footer />
    </main>
  )
}
```

- [ ] **Step 4: Run the test again**

Run: `npm test -- src/app/page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Run the full test suite**

Run: `npm test`
Expected: every test file passes.

- [ ] **Step 6: Verify the static export build**

Run: `npm run build`
Expected: build succeeds; `out/index.html` exists.

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx src/app/page.test.tsx
git commit -m "feat: assemble homepage in locked section order"
```

---

## Task 22: `/our-works` page

**Files:**
- Create: `src/app/our-works/page.tsx`
- Test: `src/app/our-works/page.test.tsx`

**Interfaces:**
- Consumes: `getWorkSamples` (Task 8), `groupWorksByCategory`, `SERVICE_CATEGORIES` (Task 16), `WorkSampleCard` (Task 16), `Nav` (Task 10), `Footer` (Task 20).
- Produces: the `/our-works` route.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, waitFor, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getWorkSamples } from '@/lib/sanity/queries'
import OurWorksPage from './page'

vi.mock('@/lib/sanity/queries', () => ({
  getWorkSamples: vi.fn(),
}))

const getWorkSamplesMock = vi.mocked(getWorkSamples)

beforeEach(() => {
  getWorkSamplesMock.mockReset()
  window.localStorage.clear()
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

describe('OurWorksPage', () => {
  it('groups work samples under their category heading', async () => {
    getWorkSamplesMock.mockResolvedValueOnce([
      { _id: '1', title: 'Podcast Series', category: 'Audiobook Productions', imageUrl: 'p.jpg', description: '', featured: false },
      { _id: '2', title: 'Live Session', category: 'Recording', imageUrl: 'l.jpg', description: '', featured: false },
    ])

    render(<OurWorksPage />)

    await waitFor(() => expect(screen.getByText('Podcast Series')).toBeInTheDocument())

    const audiobookSection = screen.getByText('Audiobook Productions').closest('section')
    expect(audiobookSection).not.toBeNull()
    expect(within(audiobookSection as HTMLElement).getByText('Podcast Series')).toBeInTheDocument()

    const recordingSection = screen.getByText('Recording').closest('section')
    expect(recordingSection).not.toBeNull()
    expect(within(recordingSection as HTMLElement).getByText('Live Session')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/app/our-works/page.test.tsx`
Expected: FAIL — cannot find module `./page`.

- [ ] **Step 3: Implement `src/app/our-works/page.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { getWorkSamples } from '@/lib/sanity/queries'
import type { WorkSample } from '@/lib/sanity/types'
import { groupWorksByCategory, SERVICE_CATEGORIES } from '@/lib/works'
import { WorkSampleCard } from '@/components/WorkSampleCard'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

export default function OurWorksPage() {
  const [works, setWorks] = useState<WorkSample[]>([])

  useEffect(() => {
    let cancelled = false
    getWorkSamples().then((result) => {
      if (!cancelled) setWorks(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const grouped = groupWorksByCategory(works)

  return (
    <main>
      <Nav />
      <div className="py-16 px-6">
        <h1 className="font-heading text-espresso dark:text-ivory text-3xl font-bold mb-8">Our Works</h1>
        {SERVICE_CATEGORIES.map((category) => (
          <section key={category} className="mb-12">
            <h2 className="font-heading text-espresso dark:text-ivory text-xl font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {grouped[category].map((work) => (
                <WorkSampleCard key={work._id} work={work} />
              ))}
            </div>
          </section>
        ))}
      </div>
      <Footer />
    </main>
  )
}
```

- [ ] **Step 4: Run the test again**

Run: `npm test -- src/app/our-works/page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Verify the static export build**

Run: `npm run build`
Expected: build succeeds; `out/our-works/index.html` exists.

- [ ] **Step 6: Commit**

```bash
git add src/app/our-works/
git commit -m "feat: add /our-works page grouped by service category"
```

---

## Task 23: `/terms` page

**Files:**
- Create: `src/app/terms/page.tsx`
- Test: `src/app/terms/page.test.tsx`

**Interfaces:**
- Consumes: `getSiteSettings` (Task 8), `Nav` (Task 10), `Footer` (Task 20).
- Produces: the `/terms` route.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSiteSettings } from '@/lib/sanity/queries'
import TermsPage from './page'

vi.mock('@/lib/sanity/queries', () => ({
  getSiteSettings: vi.fn(),
}))

const getSiteSettingsMock = vi.mocked(getSiteSettings)

beforeEach(() => {
  getSiteSettingsMock.mockReset()
  window.localStorage.clear()
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

describe('TermsPage', () => {
  it('renders the terms text from Sanity when present', async () => {
    getSiteSettingsMock.mockResolvedValueOnce({
      address: '',
      phone: '',
      email: '',
      whatsappNumber: '',
      mapsEmbedUrl: '',
      termsText: 'All bookings are final once confirmed.',
    })
    render(<TermsPage />)
    await waitFor(() =>
      expect(screen.getByTestId('terms-text')).toHaveTextContent('All bookings are final once confirmed.')
    )
  })

  it('shows fallback text when no terms have been set yet', async () => {
    getSiteSettingsMock.mockResolvedValueOnce({
      address: '',
      phone: '',
      email: '',
      whatsappNumber: '',
      mapsEmbedUrl: '',
      termsText: '',
    })
    render(<TermsPage />)
    await waitFor(() =>
      expect(screen.getByTestId('terms-text')).toHaveTextContent('Terms & Conditions content coming soon.')
    )
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/app/terms/page.test.tsx`
Expected: FAIL — cannot find module `./page`.

- [ ] **Step 3: Implement `src/app/terms/page.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { getSiteSettings } from '@/lib/sanity/queries'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

const FALLBACK_TERMS_TEXT = 'Terms & Conditions content coming soon.'

export default function TermsPage() {
  const [termsText, setTermsText] = useState('')

  useEffect(() => {
    let cancelled = false
    getSiteSettings().then((result) => {
      if (!cancelled) setTermsText(result.termsText)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main>
      <Nav />
      <div className="py-16 px-6 max-w-3xl mx-auto">
        <h1 className="font-heading text-espresso dark:text-ivory text-3xl font-bold mb-8">Terms &amp; Conditions</h1>
        <p
          className="text-text-muted-light dark:text-text-muted-dark whitespace-pre-line"
          data-testid="terms-text"
        >
          {termsText || FALLBACK_TERMS_TEXT}
        </p>
      </div>
      <Footer />
    </main>
  )
}
```

- [ ] **Step 4: Run the tests again**

Run: `npm test -- src/app/terms/page.test.tsx`
Expected: PASS, both tests.

- [ ] **Step 5: Verify the static export build**

Run: `npm run build`
Expected: build succeeds; `out/terms/index.html` exists.

- [ ] **Step 6: Commit**

```bash
git add src/app/terms/
git commit -m "feat: add /terms page backed by Sanity site settings"
```

---

## Task 24: Accessibility pass

**Files:**
- Modify: any component flagged by the audit below (files vary; see Step 3)

**Interfaces:**
- Consumes: the full component tree from Tasks 10–23.

This task has no new automated tests — it audits what's already built against the spec's accessibility requirement and fixes what it finds.

- [ ] **Step 1: Install an automated accessibility checker**

Run: `npm install --save-dev @axe-core/cli`
Expected: install completes.

- [ ] **Step 2: Run the dev server and audit the homepage**

Run: `npm run dev` (in one terminal), then in another: `npx @axe-core/cli http://localhost:3000 --exit`
Expected: command completes; note any violations printed (contrast, missing alt text, missing labels).

- [ ] **Step 3: Fix any violations found**

Common fixes for this codebase, applied only if the audit flags them:
- Missing `alt` text: every `<img>` in this plan already receives `alt={name/title/caption}` — if audit flags one, add the missing attribute at that call site.
- Insufficient contrast: adjust the specific Tailwind text/background class pairing flagged, keeping within the locked palette from Task 2 (e.g. swap `text-text-muted-light` for `text-espresso` on a small element if the muted tone fails contrast at that size).
- Missing focus styles: add `focus-visible:outline focus-visible:outline-2 focus-visible:outline-sofa-blue` to interactive elements (buttons, links) missing a visible focus ring — check `Nav.tsx`, `ThemeToggle.tsx`, `StudioGallery.tsx` thumbnail buttons first, since they're the custom interactive controls.

- [ ] **Step 4: Repeat the audit against `/our-works` and `/terms`**

Run: `npx @axe-core/cli http://localhost:3000/our-works --exit` and `npx @axe-core/cli http://localhost:3000/terms --exit`
Expected: no violations.

- [ ] **Step 5: Run the full test suite to confirm no regressions**

Run: `npm test`
Expected: all tests still PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "fix: address accessibility audit findings"
```

---

## Task 25: Responsive verification pass

**Files:** none created — this is a manual verification task against the existing build.

**Interfaces:**
- Consumes: the full component tree from Tasks 10–23.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: server running at `http://localhost:3000`.

- [ ] **Step 2: Check phone width (375px)**

Using the browser devtools responsive mode set to 375×667, load `/`, `/our-works`, and `/terms`. Confirm: Nav shows the hamburger (not the desktop link row), the mobile menu opens/closes correctly, all section grids (Services, Studio, Team, Works) render as a single column, the Clientele strip still scrolls horizontally without overflowing the viewport, and the Contact map/WhatsApp button are fully visible without horizontal scrolling.

- [ ] **Step 3: Check tablet width (768px)**

Repeat at 768×1024. Confirm grids move to their two-column breakpoints (`md:grid-cols-2`/`md:grid-cols-3`/`md:grid-cols-4` as defined per component) and the Nav's desktop link row is now visible (Tailwind's `md:` breakpoint is 768px).

- [ ] **Step 4: Check laptop width (1440px)**

Repeat at 1440×900. Confirm no section stretches edge-to-edge awkwardly (About and Terms bodies are constrained by `max-w-3xl mx-auto`), grids show their full column count, and the sticky Nav does not overlap content when scrolling past each section anchor.

- [ ] **Step 5: Record and fix any breakage found**

If any layout breaks at a checked width, adjust the Tailwind classes on the specific component flagged (e.g. add a missing `md:` or `lg:` variant) and re-check that width.

- [ ] **Step 6: Commit any fixes**

```bash
git add -A
git commit -m "fix: responsive layout issues found in breakpoint audit"
```

(Skip the commit if Step 5 found nothing to fix.)

---

## Task 26: Static export build verification

**Files:** none created — this verifies the cumulative build output.

**Interfaces:**
- Consumes: the entire `src/app` tree from Tasks 1–23.

- [ ] **Step 1: Run a clean build**

Run: `rm -rf .next out && npm run build`
Expected: exit code 0, no server-only API errors.

- [ ] **Step 2: Verify the expected static pages exist**

Run: `ls out/index.html out/our-works/index.html out/terms/index.html`
Expected: all three files listed, no "No such file" errors.

- [ ] **Step 3: Serve the static output locally and spot-check**

Run: `npx serve out` (in one terminal), then open `http://localhost:3000` in a browser.
Expected: homepage loads, theme toggle works, navigating to `/our-works` and `/terms` works via the Nav/Footer links without a server.

- [ ] **Step 4: Commit** (only if Steps 1–3 required code changes; otherwise this task is verification-only)

```bash
git add -A
git commit -m "fix: static export build issues"
```

---

## Task 27: Sanity Studio deploy readiness

**Files:** none created — this verifies the `studio/` project from Task 6 is deployable.

**Interfaces:**
- Consumes: `studio/` from Task 6.

- [ ] **Step 1: Verify the Studio still builds cleanly**

Run: `cd studio && npm run build`
Expected: exit code 0, `studio/dist/` produced.

- [ ] **Step 2: Deploy the Studio (manual, one-time, requires a Sanity account)**

Run: `npx sanity login` (authenticate with a Sanity account), then `npx sanity deploy` from inside `studio/`, choosing a studio hostname when prompted (e.g. `meraki-studio`).
Expected: deploy succeeds and prints the live URL, `https://meraki-studio.sanity.studio` (or the chosen hostname).

This step needs a real Sanity account and cannot be scripted deterministically — it's the one manual action in this plan, matching the spec's requirement that the owner (or whoever sets this up on her behalf) gets a live, hosted admin URL.

- [ ] **Step 3: Confirm the deployed Studio loads and shows all 7 content types**

Open the deployed URL in a browser, log in, and confirm the desk lists Team Member, Client Logo, Work Sample, Studio Photo, Equipment Item, Ad Campaign, and Site Settings.

- [ ] **Step 4: Set the production env vars for the Next.js app**

In whatever hosting the static `out/` folder deploys to, set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` to match the Studio's project (from Task 6, Step 11's note), then rebuild (`npm run build`) so the client-side fetch calls point at the real dataset.

- [ ] **Step 5: End-to-end content check**

Add one test document of each type in the deployed Studio, reload the locally-served static build from Task 26 Step 3, and confirm the new content appears within a few seconds with no rebuild — validating the "owner edits content without touching code" requirement end-to-end.

No commit for this task — it's operational setup, not a code change.

---

## Post-Plan Notes

- Every fetching component (`AdSlot`, `Studio`, `WorksTeaser`, `Team`, `Clientele`, `Contact`, `/our-works`, `/terms`) follows the same pattern: `useState` + `useEffect` with a `cancelled` flag, calling one or more functions from `src/lib/sanity/queries.ts`. This repetition is intentional (YAGNI) — a shared data-fetching hook was considered and rejected because each section's loading/error needs are simple and identical copy-paste is clearer here than an abstraction with only 7 callers.
- Team member count (2), and clientele/works volume are content decisions made entirely in Sanity — no code changes are needed to add more of either later.
- Logo/photo/video assets referenced throughout (e.g. Hero backdrop) are intentionally left as placeholders per the spec's "Out of Scope" section; swapping them is a Sanity Studio content task, not a code task, once Task 27 is complete.
