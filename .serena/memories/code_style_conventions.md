# Code Style & Conventions

## TypeScript Configuration
- **Strict Mode**: Enabled with comprehensive type checking
- **ES2022 Target**: Modern JavaScript features
- **Path Aliases**: `~/*` maps to `./app/*` for clean imports
- **Module Resolution**: Bundler strategy for modern tooling

## Linting Rules (oxlint)
- **Error Level**: no-console, no-debugger, react/jsx-key, react-hooks/rules-of-hooks  
- **Warning Level**: no-shadow, no-empty, no-unused-vars, react-hooks/exhaustive-deps
- **React Rules**: jsx-no-duplicate-props, jsx-no-undef, no-children-prop
- **Extends**: plugin:react/recommended, plugin:react-hooks/recommended

## Component Patterns
- **shadcn/ui Components**: Follow "new-york" style patterns
- **Utility Function**: Use `cn()` helper from `~/lib/utils` for class merging
- **TypeScript Types**: Comprehensive typing with Drizzle-generated types
- **File Organization**: Components in `~/components/ui/`, business logic in `~/services/`

## Database Patterns
- **Drizzle ORM**: Type-safe database operations with SQLite
- **Schema Definition**: Centralized in `app/lib/db/schema.ts`
- **Migrations**: Use `npm run db:generate` and `npm run db:migrate`
- **Authentication**: Session-based with bcrypt password hashing

## Naming Conventions
- **Files**: kebab-case for file names (e.g., `auth.server.ts`)
- **Components**: PascalCase for React components
- **Functions**: camelCase for functions and variables
- **Constants**: UPPER_SNAKE_CASE for constants (e.g., `USER_SESSION_KEY`)
- **Database**: snake_case for database columns