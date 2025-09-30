import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Mock the services
vi.mock('../services/api', () => ({
  reminderAPI: {
    getReminders: vi.fn(() => Promise.resolve([])),
    createReminder: vi.fn(),
    updateReminder: vi.fn(),
    deleteReminder: vi.fn(),
    toggleReminder: vi.fn()
  }
}));

vi.mock('../services/auth', () => ({
  authAPI: {
    register: vi.fn(),
    login: vi.fn()
  },
  tokenManager: {
    getToken: vi.fn(() => null),
    setToken: vi.fn(),
    removeToken: vi.fn(),
    isAuthenticated: vi.fn(() => false)
  }
}));

// Test wrapper component
const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders habit tracker title', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Habit Tracker')).toBeInTheDocument();
    });
  });

  it('shows login form when not authenticated', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });
  });
});