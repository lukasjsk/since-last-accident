# Project Structure

## Main Application Structure
```
app/
├── components/ui/          # Reusable UI components (shadcn/ui)
│   ├── button.tsx         # Button component with variants
│   ├── card.tsx           # Card components (Card, CardHeader, etc.)
│   ├── input.tsx          # Input component
│   └── label.tsx          # Label component
├── lib/
│   ├── db/                # Database configuration and schema
│   │   ├── index.ts       # Database connection and setup
│   │   ├── schema.ts      # Drizzle ORM schema definitions
│   │   └── seed.ts        # Database seeding script
│   └── utils.ts           # Utility functions (cn helper)
├── routes/                # Application routes (React Router v7)
│   ├── home.tsx          # Protected dashboard
│   ├── login.tsx         # Authentication login
│   ├── logout.tsx        # Session termination
│   └── register.tsx      # Admin-only user creation
├── services/              # Business logic and authentication
│   ├── auth.server.ts    # Server-side authentication functions
│   ├── auth.ts           # Client-side authentication utilities
│   └── session.server.ts # Session management
├── welcome/              # Landing page assets
├── root.tsx              # Root layout component
└── routes.ts             # Route configuration
```

## Database Schema
- **users**: Authentication and user management
- **categories**: Issue categorization system
- **issues**: Main issue tracking with status, severity
- **solutions**: Solutions linked to issues
- **accidents**: Accident tracking for metrics

## Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration with path aliases
- `react-router.config.ts` - React Router v7 configuration
- `vite.config.ts` - Build tool configuration
- `oxlint.json` - Linting rules and configuration
- `components.json` - shadcn/ui configuration