# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow Requirements

- **Always create a Linear ticket** for all work before starting
- **Always create a new PR** for all changes - do not commit directly to main

## Project Overview

@seamapi/react is a React component library for Seam smart device management. It provides white-labeled UI components for device management, access codes, and thermostat controls. Components are available as React components and as native Web Components.

## Tech Stack

- **React 18+** with TypeScript
- **Vite** for building elements bundle
- **tsc/tsc-alias** for TypeScript compilation
- **Vitest** with happy-dom for testing
- **Storybook 7** for component development
- **SCSS** for styling (compiled with Sass)
- **@tanstack/react-query** for data fetching
- **@seamapi/http** for Seam API communication
- **@seamapi/react-query** for query hooks

## Essential Commands

```bash
npm start          # Start Storybook development (runs examples + storybook)
npm run build      # Build the library (JS + CSS + elements)
npm test           # Run tests with Vitest
npm run test:watch # Run tests in watch mode
npm run lint       # Run ESLint + Prettier + Stylelint
npm run format     # Auto-fix linting issues
npm run typecheck  # Run TypeScript type checking
npm run storybook  # Run Storybook only
npm run examples   # Run example apps
npm run generate   # Generate icon components from SVGs in assets/icons
```

## Project Structure

```
src/
├── index.ts              # Main export entry point
├── hooks.ts              # Hooks-only entry point
├── elements.ts           # Web Components entry point
├── index.scss            # Main stylesheet
└── lib/
    ├── seam/
    │   ├── SeamProvider.tsx              # Main context provider
    │   ├── components/                   # UI components
    │   │   ├── AccessCodeDetails/
    │   │   ├── AccessCodeTable/
    │   │   ├── ConnectAccountButton/
    │   │   ├── CreateAccessCodeForm/
    │   │   ├── DeviceDetails/
    │   │   ├── DeviceTable/
    │   │   ├── EditAccessCodeForm/
    │   │   └── SupportedDeviceTable/
    │   ├── access-codes/                 # Access code hooks
    │   ├── client-sessions/              # Session hooks
    │   ├── connected-accounts/           # Account hooks
    │   ├── devices/                      # Device hooks
    │   └── thermostats/                  # Thermostat hooks
    └── icons/                            # Generated SVG icon components
```

## Key Architecture Patterns

### Component Structure

Each component typically has:

- `ComponentName.tsx` - Main component implementation
- `ComponentName.element.ts` - Web Component wrapper
- `ComponentName.stories.tsx` - Storybook stories
- `ComponentName.test.tsx` - Component tests (optional)

### Entry Points

- `@seamapi/react` - Full library (components + hooks)
- `@seamapi/react/hooks` - Hooks only (lighter bundle)
- `@seamapi/react/elements` - Web Components bundle

### Path Aliases

- `lib/*` → `./src/lib/*`
- `fixtures/*` → `./test/fixtures/*`
- `@seamapi/react` → `./src/index.ts`

## Code Style

- ESLint with standard-with-typescript config
- Prettier for formatting
- Stylelint for SCSS
- Import sorting via eslint-plugin-simple-import-sort
- Require `.js` extensions in imports (ES modules)
- Use inline type imports: `import { type Foo } from 'bar.js'`
- All CSS classes are prefixed with `seam-`

## Testing

Tests use Vitest with happy-dom environment. Test fixtures are in `test/fixtures/`.

```bash
npm test              # Run all tests
npm run test:update   # Update snapshots
npm run test:ui       # Open Vitest UI
```

## Fake Seam Connect

The project uses @seamapi/fake-seam-connect for deterministic testing and Storybook development. Seed data is in `.storybook/seed-fake.js`.

## Publishing

- Automatic releases via semantic-release based on Angular commit message conventions
- Manual releases via GitHub Actions workflow dispatch
