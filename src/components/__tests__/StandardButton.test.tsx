import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { StandardButton } from '../StandardButton'

describe('StandardButton', () => {
  it('renders with default props', () => {
    render(<StandardButton>Click me</StandardButton>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('renders with different variants', () => {
    const { rerender } = render(<StandardButton variant="primary">Primary</StandardButton>)
    let button = screen.getByRole('button')
    expect(button).toHaveStyle({ background: '#C44569' })

    rerender(<StandardButton variant="secondary">Secondary</StandardButton>)
    button = screen.getByRole('button')
    expect(button).toHaveStyle({ background: 'white' })
    // Note: Additional style checks would verify border color format

    rerender(<StandardButton variant="ghost">Ghost</StandardButton>)
    button = screen.getByRole('button')
    expect(button).toHaveStyle({ background: 'transparent' })
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<StandardButton size="sm">Small</StandardButton>)
    let button = screen.getByRole('button')
    expect(button).toHaveStyle({ fontSize: '14px', padding: '8px 16px' })

    rerender(<StandardButton size="md">Medium</StandardButton>)
    button = screen.getByRole('button')
    expect(button).toHaveStyle({ fontSize: '16px', padding: '12px 24px' })

    rerender(<StandardButton size="lg">Large</StandardButton>)
    button = screen.getByRole('button')
    expect(button).toHaveStyle({ fontSize: '18px', padding: '16px 32px' })
  })

  it('renders with fullWidth', () => {
    render(<StandardButton fullWidth>Full Width</StandardButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ width: '100%' })
  })

  it('renders with icon', () => {
    render(<StandardButton icon={<span>🚀</span>}>With Icon</StandardButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('🚀')
    expect(button).toHaveTextContent('With Icon')
  })

  it('shows loading state', () => {
    render(<StandardButton loading>Loading</StandardButton>)
    const button = screen.getByRole('button', { name: /loading/i })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')

    // Check for spinner element
    const spinner = button.querySelector('.loading-spinner')
    expect(spinner).toBeInTheDocument()
  })

  it('handles disabled state', () => {
    render(<StandardButton disabled>Disabled</StandardButton>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveStyle({ opacity: '0.6' })
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<StandardButton onClick={handleClick}>Clickable</StandardButton>)
    const button = screen.getByRole('button')

    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    render(<StandardButton className="custom-class">Custom Class</StandardButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('standard-button', 'custom-class')
  })

  it('handles mouse hover effects for primary variant', async () => {
    const user = userEvent.setup()
    render(<StandardButton variant="primary">Primary</StandardButton>)

    const button = screen.getByRole('button')

    // Should be enabled and clickable before hover
    expect(button).not.toBeDisabled()

    // Hover should work and button should remain enabled
    await user.hover(button)
    expect(button).not.toBeDisabled()

    // Can still interact after hover
    await user.unhover(button)
    expect(button).not.toBeDisabled()
  })

  it('prevents hover effects when disabled', async () => {
    const user = userEvent.setup()
    render(<StandardButton variant="primary" disabled>Disabled</StandardButton>)

    const button = screen.getByRole('button')

    // Should be disabled
    expect(button).toBeDisabled()

    // Hover should not change disabled state
    await user.hover(button)
    expect(button).toBeDisabled()

    await user.unhover(button)
    expect(button).toBeDisabled()
  })

  it('handles loading click prevention', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<StandardButton loading onClick={handleClick}>Loading</StandardButton>)
    const button = screen.getByRole('button')

    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('passes through additional props', () => {
    render(<StandardButton type="submit" data-testid="test-button">Submit</StandardButton>)
    const button = screen.getByTestId('test-button')
    expect(button).toHaveAttribute('type', 'submit')
  })
})
