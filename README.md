# Since Last Accident

A comprehensive knowledge management system for tracking development team incidents, their solutions, and providing metrics on incident-free periods. The application combines issue tracking, knowledge management, and team dashboard functionality with AI integration capabilities.

## 🚀 Features

### Core Functionality
- **Issue & Solution Database**: Comprehensive tracking of development team incidents and their solutions
- **Authentication System**: Secure user authentication with role-based access control
- **Dashboard Analytics**: Real-time metrics and "Days Since Last Accident" counters
- **Search & Discovery**: Advanced search capabilities across issues and solutions
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
│   └── utils.ts           # Utility functions
├── routes/                # Application routes
│   ├── home.tsx          # Protected dashboard
│   ├── login.tsx         # Authentication
│   ├── logout.tsx        # Session termination
│   └── register.tsx      # Admin-only user creation
├── services/              # Business logic and authentication
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

### 🚧 Next Phases (Planned)
- **Phase 2**: Issues CRUD Operations
- **Phase 3**: Solutions Management
- **Phase 4**: Advanced Search & Categories
- **Phase 5**: MCP Server Integration
- **Phase 6**: Analytics & Reporting

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
