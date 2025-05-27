# Development Guidelines for Since Last Accident React Router Project

This document provides essential information for developers working on this project. It covers build/configuration instructions, testing setup, and additional development details.

## Build/Configuration Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm (v8+ recommended)

### Installation
```bash
npm install
```

### Development
Start the development server with hot module replacement:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Production Build
Create a production build:
```bash
npm run build
```
This generates optimized assets in the `build` directory.

### Starting the Production Server
Run the production server:
```bash
npm start
```
The application will be available at `http://localhost:3000`.

### Type Checking
Run TypeScript type checking:
```bash
npm run typecheck
```

## Testing Information

### Testing Setup
This project uses Vitest for testing with React Testing Library for component testing.

### Running Tests
- Run tests once:
  ```bash
  npm test
  ```
- Run tests in watch mode (for development):
  ```bash
  npm run test:watch
  ```
- Run tests with coverage report:
  ```bash
  npm run test:coverage
  ```

### Writing Tests
Tests should be co-located with the files they test. This means test files should be placed in the same directory as the file they are testing.

#### Test File Naming Convention
- Use `.test.tsx` or `.test.ts` extension for test files
- Name test files after the module they test (e.g., if you have `root.tsx`, the test file should be `root.test.tsx` in the same directory)

#### Example Test
Here's a simple example of a component test:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { YourComponent } from './your-component';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Mocking Dependencies
Use Vitest's mocking capabilities to mock dependencies:

```tsx
import { vi } from 'vitest';

// Mock a module
vi.mock('module-name', () => ({
  functionName: vi.fn(() => 'mocked result'),
}));
```

## Project Structure

```
since-last-accident-rr/
├── app/                  # Application code
│   ├── routes/           # Route components
│   │   ├── some-route.tsx       # Route component
│   │   └── some-route.test.tsx  # Test for route component
│   ├── welcome/          # Welcome page components
│   │   ├── welcome.tsx          # Welcome component
│   │   └── welcome.test.tsx     # Test for welcome component
│   ├── app.css           # Global styles
│   ├── root.tsx          # Root component
│   ├── root.test.tsx     # Test for root component
│   └── routes.ts         # Route definitions
├── public/               # Static assets
├── .junie/               # Project documentation
├── Dockerfile            # Docker configuration
├── vite.config.ts        # Vite configuration
├── vitest.config.ts      # Vitest configuration
├── vitest.setup.ts       # Vitest setup file
└── react-router.config.ts # React Router configuration
```

## Code Style and Development Guidelines

### TypeScript
- Use TypeScript for all new code
- Ensure proper typing for components, functions, and variables
- Run `npm run typecheck` before committing to ensure type correctness

### Component Structure
- Use functional components with hooks
- Keep components focused on a single responsibility
- Extract reusable logic into custom hooks

### UI Components and Styling
- This project uses shadcn UI library with TailwindCSS for styling
- Prioritize using shadcn UI components over building components with plain Tailwind
- shadcn UI components can be found in the `components/ui` directory
- For custom styling needs, use Tailwind utility classes directly in components
- For complex custom components, consider using Tailwind's @apply directive in CSS files
- When adding new shadcn UI components, use the shadcn CLI

### Routing
- This project uses React Router v7
- Route components are located in the `app/routes` directory
- Route definitions are in `app/routes.ts`

### Server-Side Rendering
- This project uses server-side rendering by default
- SSR can be disabled by setting `ssr: false` in `react-router.config.ts`

## Docker Deployment

Build and run using Docker:
```bash
docker build -t my-app .
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker.
