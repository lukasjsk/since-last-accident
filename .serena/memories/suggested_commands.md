# Suggested Commands

## Development Commands
- `npm run dev` - Start development server with HMR at http://localhost:5173
- `npm run build` - Create production build
- `npm run start` - Start production server from build

## Database Operations
- `npm run db:generate` - Generate database migration files from schema changes
- `npm run db:migrate` - Run database migrations to update schema
- `npm run db:studio` - Open Drizzle Studio for database management GUI
- `npm run db:seed` - Seed database with sample data (test accounts)

## Code Quality & Testing
- `npm run typecheck` - Run React Router type generation and TypeScript type checking
- `npm run test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run oxlint for code linting
- `npm run lint:fix` - Run oxlint with automatic fixes

## System Commands (Linux Environment)
- `git status` - Check git repository status
- `git diff` - View changes in working directory
- `ls -la` - List files with details
- `find . -name "*.ts" -type f` - Find TypeScript files
- `grep -r "pattern" app/` - Search for patterns in app directory

## Test Credentials (Development Only)
**Admin Account**: username: `admin`, password: `admin123`
**Standard User**: username: `john.doe`, password: `user123`