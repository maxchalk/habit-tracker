import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReminderForm from '../components/ReminderForm';

describe('ReminderForm', () => {
  const mockProps = {
    title: '',
    setTitle: vi.fn(),
    priority: 'low',
    setPriority: vi.fn(),
    dueDate: '',
    setDueDate: vi.fn(),
    dueTime: '',
    setDueTime: vi.fn(),
    repeat: 'none',
    setRepeat: vi.fn(),
    onAdd: vi.fn(),
    isDarkMode: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form inputs', () => {
    render(<ReminderForm {...mockProps} />);
    
    expect(screen.getByPlaceholderText('Add a new reminder...')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Low Priority')).toBeInTheDocument();
    expect(screen.getByDisplayValue('No Repeat')).toBeInTheDocument();
    expect(screen.getByText('Add Reminder')).toBeInTheDocument();
  });

  it('calls onAdd when form is submitted', async () => {
    const mockOnAdd = vi.fn((e) => e.preventDefault());
    render(<ReminderForm {...mockProps} onAdd={mockOnAdd} />);
    
    const form = screen.getByText('Add Reminder').closest('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalled();
    });
  });

  it('updates title when input changes', () => {
    const mockSetTitle = vi.fn();
    render(<ReminderForm {...mockProps} setTitle={mockSetTitle} />);
    
    const titleInput = screen.getByPlaceholderText('Add a new reminder...');
    fireEvent.change(titleInput, { target: { value: 'Test reminder' } });
    
    expect(mockSetTitle).toHaveBeenCalledWith('Test reminder');
  });
});