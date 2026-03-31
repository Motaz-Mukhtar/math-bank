import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumPad } from './NumPad';

describe('NumPad Component', () => {
  it('should render with initial value of ٠', () => {
    const mockOnConfirm = vi.fn();
    const { container } = render(<NumPad onConfirm={mockOnConfirm} />);
    
    // Query the display div specifically (first child of the main container)
    const display = container.querySelector('div > div:first-child');
    expect(display).toHaveTextContent('٠');
  });

  it('should append Arabic-Indic digits when digit buttons are pressed', () => {
    const mockOnConfirm = vi.fn();
    const { container } = render(<NumPad onConfirm={mockOnConfirm} />);
    
    const digitButton = screen.getByRole('button', { name: '١' });
    fireEvent.click(digitButton);
    
    const display = container.querySelector('div > div:first-child');
    expect(display).toHaveTextContent('١');
  });

  it('should remove last character when delete button is pressed', () => {
    const mockOnConfirm = vi.fn();
    const { container } = render(<NumPad onConfirm={mockOnConfirm} />);
    
    const digit1 = screen.getByRole('button', { name: '١' });
    const digit2 = screen.getByRole('button', { name: '٢' });
    const deleteButton = screen.getByRole('button', { name: 'حذف' });
    
    fireEvent.click(digit1);
    fireEvent.click(digit2);
    fireEvent.click(deleteButton);
    
    const display = container.querySelector('div > div:first-child');
    expect(display).toHaveTextContent('١');
  });

  it('should call onConfirm with current value when confirm button is pressed', () => {
    const mockOnConfirm = vi.fn();
    render(<NumPad onConfirm={mockOnConfirm} />);
    
    const digit1 = screen.getByRole('button', { name: '١' });
    const digit2 = screen.getByRole('button', { name: '٢' });
    const confirmButton = screen.getByRole('button', { name: 'تأكيد' });
    
    fireEvent.click(digit1);
    fireEvent.click(digit2);
    fireEvent.click(confirmButton);
    
    expect(mockOnConfirm).toHaveBeenCalledWith('١٢');
  });
});
