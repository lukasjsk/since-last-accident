# Functional Requirements

This document outlines the functional requirements for the "Since Last Accident" application - a knowledge management system for development team issues and solutions.

## Application Overview

The application serves as a centralized knowledge base for tracking development team incidents, their solutions, and providing metrics on incident-free periods. It combines issue tracking, knowledge management, and team dashboard functionality with AI integration capabilities.

## Core Functional Requirements

### 1. Issue & Solution Database
- **Primary Function**: Serve as a comprehensive database of all issues faced by the development team and their corresponding solutions
- **Knowledge Base**: Act as a searchable reference for future similar issues
- **Data Persistence**: Store issues, solutions, metadata, and timestamps permanently

#### Features:
- Create, read, update, delete (CRUD) operations for issues
- Rich text support for issue descriptions and solutions
- Attachment support for screenshots, logs, and documentation
- Full-text search across all content
- Tagging and categorization system
- Issue severity levels (Low, Medium, High, Critical)
- Issue status tracking (Open, In Progress, Resolved, Archived)

### 2. User Interface
- **Design**: Simple, clean, and appealing UI following modern design principles
- **Efficiency**: Optimized for quick issue entry and solution documentation
- **Responsiveness**: Mobile-friendly responsive design
- **Accessibility**: WCAG 2.1 AA compliant

#### Key UI Components:
- Issue creation/editing forms with rich text editor
- Advanced search and filtering interface
- Category management interface
- Dashboard with metrics and visualizations
- User authentication screens

### 3. Dashboard & Analytics
- **Time Tracking**: Display time elapsed since last accident (overall and per category)
- **Metrics**: Show incident frequency, resolution times, and trends
- **Visual Elements**: Charts and graphs for data visualization
- **Real-time Updates**: Live dashboard updates when new incidents are logged

#### Dashboard Features:
- "Days Since Last Accident" counter (overall)
- Per-category accident counters
- Recent incidents timeline
- Most common issue categories
- Resolution time statistics
- Team performance metrics

### 4. MCP Server Integration
- **AI Integration**: Provide MCP (Model Context Protocol) server for LLM access
- **Knowledge Base Access**: Allow AI models to query the incident database
- **Structured Data**: Export data in formats suitable for AI consumption
- **API Endpoints**: RESTful API for external integrations

## Technology Stack & Architecture

### Frontend
- **Framework**: React Router v7 (already established)
- **UI Components**: shadcn/ui with Tailwind CSS v4
- **State Management**: React Router's built-in data loading and mutations
- **Type Safety**: TypeScript with strict mode

### Backend & Data Storage
- **Database**: SQLite (lightweight, zero-config, perfect for team-size applications), Drizzle ORM
  - **Rationale**: 
    - Zero maintenance overhead
    - Built-in full-text search capabilities
    - Excellent performance for read-heavy workloads
    - Easy backup and deployment
    - Supports concurrent reads (adequate for team usage)
    - No cloud dependencies or costs

### Authentication
- **Framework**: remix-auth with simple username/password strategy
- **Session Management**: Cookie-based sessions
- **Security**: bcrypt for password hashing, CSRF protection
- **Rationale**: 
  - Minimal setup for POC
  - No external dependencies
  - Easy to extend later with OAuth providers

### MCP Server
- **Implementation**: Node.js MCP server with SQLite integration
- **Protocol**: JSON-RPC over stdio/HTTP
- **Data Access**: Read-only access to formatted incident data
- **Rationale**:
  - Direct database access for optimal performance
  - Standardized protocol for AI integration
  - Lightweight implementation

### Deployment Strategy
- **Platform**: Fly.io
- **Database**: SQLite file stored with application (no separate DB service needed)
- **Static Assets**: Served directly from the application

## Enhanced Feature Requirements

### Issue Management
1. **Issue Creation**
   - Title, description, category, severity, and tags
   - Optional attachments (images, logs, code snippets)
   - Auto-timestamp creation
   - User assignment

2. **Solution Documentation**
   - Step-by-step solution guides
   - Links to external resources
   - Code examples with syntax highlighting
   - Validation of solution effectiveness

3. **Categorization System**
   - Predefined categories (e.g., "Build Issues", "Deployment", "Environment", "Code Quality")
   - Custom category creation
   - Category-specific templates
   - Category-based permissions

### Search & Discovery
1. **Advanced Search**
   - Full-text search across titles, descriptions, and solutions
   - Filter by category, severity, date range, status
   - Tag-based filtering
   - Search result ranking by relevance and recency

2. **Related Issues**
   - Automatic suggestion of similar issues
   - "Users who viewed this also viewed" functionality
   - Tag-based recommendations

### Dashboard Features
1. **Accident Counters**
   - Global "days since last accident" counter
   - Per-category counters with visual indicators
   - Historical trend charts
   - Longest accident-free periods (records)

2. **Analytics**
   - Issue frequency by category and time period
   - Average resolution times
   - Most active contributors
   - Knowledge base growth metrics

## Data Model

### Core Entities
```
Issues:
- id, title, description, category_id, severity, status
- created_at, updated_at, resolved_at, created_by
- tags, attachments

Solutions:
- id, issue_id, description, steps, created_at, created_by
- effectiveness_rating, verified

Categories:
- id, name, description, color, created_at
- accident_reset_trigger (boolean)

Users:
- id, username, email, password_hash, role
- created_at, last_login_at

Accidents:
- id, category_id, issue_id, occurred_at
- reset_counter (boolean)
```

## Questions & Decisions Required

### 1. Authentication Scope
- **Question**: Should the POC support multiple users or single-user mode?
- **Options**: 
  - Single admin user (simpler)
  - Multi-user with basic roles (more realistic)
- **Recommendation**: Multi-user with admin/user roles for realistic testing

### 2. MCP Server Deployment
- **Question**: Should the MCP server be embedded in the main application or deployed separately?
- **Options**:
  - Embedded (simpler deployment)
  - Separate service (better separation of concerns)
- **Recommendation**: Embedded for POC, easily extractable later

### 3. File Storage
- **Question**: How should attachments be stored?
- **Options**:
  - Local filesystem (simple, no external deps)
  - Cloud storage (S3-compatible, but adds complexity)
- **Recommendation**: Local filesystem with configurable path

### 4. Real-time Updates
- **Question**: Should the dashboard update in real-time?
- **Options**:
  - Polling-based updates (simpler)
  - WebSocket connections (more responsive)
- **Recommendation**: Polling for POC (every 30 seconds)

### 5. Data Migration Strategy
- **Question**: How should the system handle data model changes?
- **Options**:
  - Manual SQL migrations
  - Automated migration system
- **Recommendation**: Simple SQL migration files in version control

## Success Criteria

### Technical
- [ ] Application loads and runs without errors
- [ ] All CRUD operations work correctly
- [ ] Dashboard displays accurate metrics
- [ ] MCP server responds to AI queries
- [ ] Search functionality returns relevant results
- [ ] Authentication protects sensitive operations

### User Experience
- [ ] Issue creation takes less than 2 minutes
- [ ] Search results appear within 2 seconds
- [ ] Dashboard loads within 3 seconds
- [ ] Mobile interface is fully functional
- [ ] Offline capability for reading (optional)

### Business
- [ ] Reduces time to find solutions for recurring issues
- [ ] Increases team awareness of incident patterns
- [ ] Provides measurable incident-free periods
- [ ] Enables AI-assisted troubleshooting via MCP integration

## Implementation Phases

### Phase 1: Core MVP
- Basic CRUD for issues and solutions
- Simple authentication
- Basic dashboard with counters
- SQLite database setup

### Phase 2: Enhanced Features
- Advanced search and filtering
- Rich text editing
- File attachments
- Category management

### Phase 3: AI Integration
- MCP server implementation
- API endpoints for external access
- Enhanced search with AI assistance

### Phase 4: Polish & Production
- Performance optimization
- Enhanced UI/UX
- Comprehensive testing
- Deployment automation