# Since Last Accident

A comprehensive knowledge management system for tracking development team incidents, their solutions, and providing metrics on incident-free periods. The application combines issue tracking, knowledge management, and team dashboard functionality with AI integration capabilities.

## 🚀 Features

### Core Functionality
- **Issue & Solution Database**: Comprehensive tracking of development team incidents and their solutions
- **Category Management**: Organized categorization of issues with detailed statistics and navigation
- **Authentication System**: Secure user authentication with role-based access control
- **Dashboard Analytics**: Real-time metrics and "Days Since Last Accident" counters
- **Search & Discovery**: Advanced search capabilities across issues and solutions with category filtering
- **Knowledge Base**: Searchable reference for future similar issues

### Technical Highlights
- **Modern Stack**: Built with React Router v7, TypeScript, and Tailwind CSS
- **Database**: SQLite with Drizzle ORM for lightweight, zero-maintenance data storage
- **Authentication**: Session-based authentication with bcrypt password hashing
- **UI Components**: Professional interface using shadcn/ui components
- **Full-Text Search**: SQLite FTS5 for fast content search
- **MCP Integration**: Model Context Protocol server for AI access (planned)

## 🛠️ Technology Stack

### Frontend
- **React Router v7** - Modern React framework with SSR
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - High-quality component library

### Backend & Data
- **SQLite** - Lightweight, serverless database
- **Drizzle ORM** - Type-safe database operations
- **bcryptjs** - Secure password hashing
- **Session-based Auth** - Cookie-based session management

### Development & Quality
- **Vitest** - Fast unit testing framework
- **oxlint** - Fast JavaScript/TypeScript linter
- **React Testing Library** - Component testing utilities

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd since-last-accident-rr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup the database**
   ```bash
   # Run database migrations
   npm run db:migrate
   
   # Seed the database with sample data
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser to `http://localhost:5173`
   - Use the test credentials below to log in

## 🎯 Application Features

### Dashboard Overview
- **Days Since Last Accident**: Real-time counter showing incident-free periods
- **Quick Statistics**: Total issues, resolved issues, and team performance metrics
- **Quick Actions**: Direct access to report issues, search, and browse categories

### Issue Management
- **Create Issues**: Report new incidents with detailed descriptions, severity levels, and category assignment
- **Browse & Search**: Advanced filtering by status, severity, category, and full-text search
- **Track Progress**: Monitor issue resolution with status updates and progress tracking
- **Tag System**: Organize issues with custom tags for better categorization

### Category System
- **Six Pre-defined Categories**: Build Issues, Deployment, Environment, Code Quality, Performance, Security
- **Category Statistics**: Track issues per category with resolution rates and safety periods
- **Category Navigation**: Browse issues by category with dedicated filtering
- **Visual Indicators**: Color-coded categories for quick visual identification

### User Roles & Security
- **Admin Users**: Full access including user management and system configuration
- **Standard Users**: Issue reporting, browsing, and basic operations
- **Session Security**: Secure authentication with automatic session management

## 🔐 Test Credentials

The seeded database includes the following test accounts:

### Administrator Account
- **Username**: `admin`
- **Password**: `admin123`
- **Permissions**: Full access, can create new users

### Standard User Account
- **Username**: `john.doe`
- **Password**: `user123`
- **Permissions**: Standard user access

> **Note**: These are development credentials only. Change or remove these accounts before deploying to production.

## 📋 Available Scripts

### Development
- `npm run dev` - Start development server with HMR at http://localhost:5173
- `npm run build` - Create production build
- `npm run start` - Start production server from build

### Database Operations
- `npm run db:generate` - Generate database migration files
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio for database management
- `npm run db:seed` - Seed database with sample data

### Code Quality & Testing
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run oxlint for code quality
- `npm run lint:fix` - Run oxlint with automatic fixes

## 🏗️ Project Structure

```
app/
├── components/ui/          # Reusable UI components (shadcn/ui)
├── lib/
│   ├── db/                # Database configuration and schema
│   ├── models/            # Database models and operations
│   ├── services/          # Business logic layer
│   └── utils.ts           # Utility functions
├── routes/                # Application routes
│   ├── categories.*.tsx   # Category management pages
│   ├── issues.*.tsx       # Issue management pages
│   ├── home.tsx          # Protected dashboard
│   ├── login.tsx         # Authentication
│   ├── logout.tsx        # Session termination
│   └── register.tsx      # Admin-only user creation
├── services/              # Authentication services
└── welcome/              # Landing page assets
```

## 🔒 Security Features

- **Password Security**: All passwords are hashed using bcrypt with salt rounds
- **Session Management**: Secure cookie-based sessions with configurable expiration
- **Role-Based Access**: Admin and user roles with appropriate permissions
- **Input Validation**: Comprehensive form validation and sanitization
- **CSRF Protection**: Built-in protection against cross-site request forgery

## 📊 Current Implementation Status

### ✅ Phase 1: Foundation & Authentication (Completed)
- [x] Database setup with SQLite and Drizzle ORM
- [x] Authentication system with session management
- [x] User registration (admin-only)
- [x] Protected routes and role-based access control
- [x] Basic dashboard layout

### ✅ Phase 2: Issues CRUD Operations (Completed)
- [x] Complete issue management system with listing, creation, viewing, and editing
- [x] Issue status management (Open, In Progress, Resolved, Archived)
- [x] Severity levels (Low, Medium, High, Critical)
- [x] Category assignment and tag support
- [x] Advanced search and filtering capabilities
- [x] Enhanced dashboard with real-time statistics

### ✅ Phase 3: Category Management (Completed)
- [x] Category listing with comprehensive statistics dashboard
- [x] Individual category detail pages with recent issues
- [x] Pre-defined categories (Build Issues, Deployment, Environment, Code Quality, Performance, Security)
- [x] Category-based issue filtering and navigation
- [x] Days since last accident tracking per category
- [x] Integration with existing issue management system

### 🚧 Next Phases (Planned)
- **Phase 4**: Solutions Management
- **Phase 5**: Advanced Search & File Attachments
- **Phase 6**: MCP Server Integration
- **Phase 7**: AI-Enhanced Features
- **Phase 8**: Production Deployment

## 🤝 Contributing

This project follows the implementation timeline defined in `docs/implementation-timeline.md`. Please refer to `CLAUDE.md` for development guidelines and coding standards.

### Development Workflow
1. Check current todos and implementation status
2. Follow the established code patterns and conventions
3. Run type checking and linting before committing
4. Ensure all tests pass

## 📄 License

This project is part of a proof-of-concept development and is intended for internal use.

## 📞 Support

For development guidance and architectural decisions, refer to:
- `CLAUDE.md` - Development guidelines and commands
- `docs/functional-requirements.md` - Detailed feature specifications
- `docs/implementation-timeline.md` - Project roadmap and milestones

---

**Built with ❤️ using React Router v7 and modern web technologies**
