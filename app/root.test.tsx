import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from './root';

// Mock the react-router imports
vi.mock('react-router', () => ({
  isRouteErrorResponse: vi.fn((error) => error && error.status !== undefined),
}));

describe('ErrorBoundary', () => {
  it('renders a generic error message for non-route errors', () => {
    const error = new Error('Test error');
    render(<ErrorBoundary error={error} params={{}} />);
    
    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('renders a 404 message for 404 errors', () => {
    const error = { status: 404 };
    render(<ErrorBoundary error={error} params={{}} />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('The requested page could not be found.')).toBeInTheDocument();
  });
});