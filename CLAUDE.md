# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Available MCP tools
Always prioritize use of MCP tools for tasks. 
- Implementation should be done using Serena MCP.
- For information about APIs and libraries, use Context7 MCP.

## Development Commands

- `npm run dev` - Start development server with HMR at http://localhost:5173
- `npm run build` - Create production build
- `npm run start` - Start production server from build
- `npm run typecheck` - Run React Router type generation and TypeScript type checking
- `npm run test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run oxlint for code linting
- `npm run lint:fix` - Run oxlint with automatic fixes

## Architecture

This is a React Router v7 application with the following key architectural patterns:

### Framework & Routing
- **React Router v7** with SSR enabled by default (configured in `react-router.config.ts`)
- File-based routing defined in `app/routes.ts` 
- Routes are located in `app/routes/` directory
- Uses React Router's type-safe route configuration

### UI & Styling
- **shadcn/ui** components configured in `components.json` with "new-york" style
- **Tailwind CSS v4** for styling
- UI components follow shadcn patterns and are located in `app/components/ui/`
- Path aliases configured: `~/*` maps to `./app/*`

### Testing
- **Vitest** for testing with jsdom environment
- **React Testing Library** for component testing
- Test setup in `vitest.setup.ts` includes jest-dom matchers
- Run single test: `npm run test -- <test-file-pattern>`

### Code Quality
- **oxlint** for fast linting (configured in `oxlint.json`)
- **TypeScript** with strict mode enabled
- React and React Hooks linting rules enforced

### Project Structure
- `app/` - Main application code
- `app/routes/` - Route components
- `app/components/ui/` - Reusable UI components  
- `app/lib/utils.ts` - Utility functions (includes `cn` helper for class merging)
- `app/welcome/` - Welcome page assets and components
- `public/` - Static assets

### Development Notes
- Uses React 19 and modern React patterns
- Import paths use `~/*` alias for app directory
- Components should follow existing shadcn/ui patterns
- Always run `npm run typecheck` and `npm run lint` before committing changes

## Functional Requirements

See `@docs/functional-requirements.md` for detailed application requirements.

