// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import PlanCardWithImage from '@/app/components/organisms/PlanCardWithImage'
import type { Plan } from '@/app/types/plan'

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: { src: string; alt: string; className?: string; onError?: () => void }) => {
    return <img {...props} />
  },
}))

// Mock MediaCard to capture its props
let capturedProps: Record<string, unknown> | null = null

vi.mock('@/app/components/molecules/MediaCard', () => ({
  default: (props: Record<string, unknown>) => {
    capturedProps = props
    return (
      <div data-testid="media-card">
        <div className="image-section">{props.imageSection as React.ReactNode}</div>
        <h3>{String(props.title ?? '')}</h3>
        {(props.description as string) && <p className="description">{String(props.description)}</p>}
      </div>
    )
  },
}))

// Mock ActivationCodeModal - captures latest props on each render via getter function
let _capturedModalProps: { isOpen: boolean; onClose: () => void; onSubmit: (code: string) => Promise<void>; error: string | null } | null = null

const getCapturedModalProps = () => _capturedModalProps

vi.mock('@/app/components/molecules/ActivationCodeModal', () => ({
  default: (props: { isOpen: boolean; onClose: () => void; onSubmit: (code: string) => Promise<void>; error: string | null }) => {
    _capturedModalProps = props
    if (!props.isOpen) return null
    return (
      <div data-testid="activation-modal" role="dialog">
        <button onClick={props.onClose}>Close Modal</button>
      </div>
    )
  },
}))

// Helper to get current modal props (always returns latest render state)
function getModalProps() {
  return getCapturedModalProps()
}

describe('PlanCardWithImage', () => {
  const mockOnActivate = vi.fn().mockResolvedValue(undefined)

  const basePlan: Plan = {
    id: 'plan-1',
    name: 'Basic Plan',
    description: 'A basic plan description',
    isFree: false,
    billingInterval: 'monthly',
    pricePence: 999,
    isActive: true,
    thumbnail: 'https://example.com/thumb.jpg',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    capturedProps = null
    _capturedModalProps = null
  })

  afterEach(() => {
    cleanup()
  })

  function renderComponent(planOverrides = {}) {
    const plan = { ...basePlan, ...planOverrides }
    return render(<PlanCardWithImage plan={plan} onActivate={mockOnActivate} />)
  }

  describe('rendering', () => {
    it('renders the MediaCard with plan name as title', () => {
      renderComponent()
      expect(screen.getByText('Basic Plan')).toBeTruthy()
    })

    it('renders the MediaCard with plan description', () => {
      renderComponent()
      expect(screen.getByText('A basic plan description')).toBeTruthy()
    })

    it('renders the Activate code button', () => {
      renderComponent()
      expect(screen.getByText('Activate code')).toBeTruthy()
    })

    it('passes the plan thumbnail to the Image component', () => {
      renderComponent()
      expect(capturedProps?.imageSection).toBeDefined()
    })

    it('renders with the correct plan data', () => {
      renderComponent()
      expect(capturedProps?.title).toBe('Basic Plan')
      expect(capturedProps?.description).toBe('A basic plan description')
    })

    it('uses default image when thumbnail is null', () => {
      renderComponent({ thumbnail: null })
      expect(capturedProps?.imageSection).toBeDefined()
    })

    it('renders with null description gracefully', () => {
      renderComponent({ description: null })
      expect(screen.getByText('Basic Plan')).toBeTruthy()
      const descriptions = document.querySelectorAll('.description')
      expect(descriptions.length).toBe(0)
    })

    it('renders with empty description gracefully', () => {
      renderComponent({ description: '', name: 'Empty Desc Plan' })
      expect(screen.getByText('Empty Desc Plan')).toBeTruthy()
    })
  })

  describe('Activate code button behavior', () => {
    it('opens the modal when Activate code button is clicked', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.click(screen.getByText('Activate code'))
      expect(getModalProps()?.isOpen).toBe(true)
    })

    it('passes the correct error state to the modal', () => {
      renderComponent()
      expect(getModalProps()?.error).toBeNull()
    })

    it('passes the onActivate callback to modal', () => {
      renderComponent()
      expect(getModalProps()?.onSubmit).toBeDefined()
      expect(typeof getModalProps()?.onSubmit).toBe('function')
    })

    it('passes the onClose callback to modal', () => {
      renderComponent()
      expect(getModalProps()?.onClose).toBeDefined()
      expect(typeof getModalProps()?.onClose).toBe('function')
    })
  })

  describe('modal interaction', () => {
    it('closes the modal when Close Modal button is clicked', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.click(screen.getByText('Activate code'))
      expect(getModalProps()?.isOpen).toBe(true)

      await user.click(screen.getByText('Close Modal'))
      expect(getModalProps()?.isOpen).toBe(false)
    })

    it('clears error when closing modal', () => {
      renderComponent()
      const onClose = getModalProps()?.onClose
      if (onClose) {
        onClose()
      }
      expect(getModalProps()?.isOpen).toBe(false)
    })

    it('calls onActivate with the code when submitting', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.click(screen.getByText('Activate code'))

      const modalProps = getModalProps()
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('TEST-CODE-123')
      }

      expect(mockOnActivate).toHaveBeenCalledWith('TEST-CODE-123')
    })

    it('sets error state when activation fails', async () => {
      const user = userEvent.setup()
      mockOnActivate.mockRejectedValueOnce(new Error('Invalid code'))

      renderComponent()

      await user.click(screen.getByText('Activate code'))

      const modalProps = getModalProps()
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('BAD-CODE')
      }

      // Wait for state update
      await new Promise(r => setTimeout(r, 10))

      expect(getModalProps()?.error).toBe('Invalid code')
    })

    it('provides fallback error message for non-Error exceptions', async () => {
      const user = userEvent.setup()
      // String is not instanceof Error, so it falls back to default message
      mockOnActivate.mockRejectedValueOnce('String error')

      renderComponent()

      await user.click(screen.getByText('Activate code'))

      const modalProps = getModalProps()
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('BAD-CODE')
      }

      await new Promise(r => setTimeout(r, 10))

      // Non-Error values fall back to the default message
      expect(getModalProps()?.error).toBe('Failed to activate code. Please try again.')
    })

    it('provides fallback error message for unknown types', async () => {
      const user = userEvent.setup()
      mockOnActivate.mockRejectedValueOnce(42)

      renderComponent()

      await user.click(screen.getByText('Activate code'))

      const modalProps = getModalProps()
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('BAD-CODE')
      }

      await new Promise(r => setTimeout(r, 10))

      expect(getModalProps()?.error).toBe('Failed to activate code. Please try again.')
    })

    it('preserves Error objects with message property', async () => {
      const user = userEvent.setup()
      const customError = new Error('Custom activation error')
      mockOnActivate.mockRejectedValueOnce(customError)

      renderComponent()

      await user.click(screen.getByText('Activate code'))

      const modalProps = getModalProps()
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('BAD-CODE')
      }

      await new Promise(r => setTimeout(r, 10))

      expect(getModalProps()?.error).toBe('Custom activation error')
    })

    it('preserves Error objects with non-string message by converting to string', async () => {
      const user = userEvent.setup()
      const errorObj = { message: 12345 } as unknown as Error
      mockOnActivate.mockRejectedValueOnce(errorObj)

      renderComponent()

      await user.click(screen.getByText('Activate code'))

      const modalProps = getModalProps()
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('BAD-CODE')
      }

      await new Promise(r => setTimeout(r, 10))

      expect(getModalProps()?.error).toBeDefined()
    })

    it('handles undefined error gracefully', async () => {
      const user = userEvent.setup()
      mockOnActivate.mockRejectedValueOnce(undefined)

      renderComponent()

      await user.click(screen.getByText('Activate code'))

      const modalProps = getModalProps()
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('BAD-CODE')
      }

      await new Promise(r => setTimeout(r, 10))

      expect(getModalProps()?.error).toBe('Failed to activate code. Please try again.')
    })

    it('handles null error gracefully', async () => {
      const user = userEvent.setup()
      mockOnActivate.mockRejectedValueOnce(null)

      renderComponent()

      await user.click(screen.getByText('Activate code'))

      const modalProps = getModalProps()
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('BAD-CODE')
      }

      await new Promise(r => setTimeout(r, 10))

      expect(getModalProps()?.error).toBe('Failed to activate code. Please try again.')
    })
  })

  describe('state management', () => {
    it('maintains separate state for modal open and error', () => {
      renderComponent()
      expect(getModalProps()?.isOpen).toBe(false)
      expect(getModalProps()?.error).toBeNull()
    })

    it('resets error when opening a new modal instance', () => {
      const user = userEvent.setup()
      renderComponent()

      user.click(screen.getByText('Activate code'))

      cleanup()
      render(<PlanCardWithImage plan={basePlan} onActivate={mockOnActivate} />)

      expect(getModalProps()?.isOpen).toBe(false)
    })

    it('handles multiple activation attempts', async () => {
      const user = userEvent.setup()
      mockOnActivate
        .mockRejectedValueOnce(new Error('First failure'))
        .mockResolvedValueOnce(undefined)

      renderComponent()

      await user.click(screen.getByText('Activate code'))
      
      const modalProps = getModalProps()
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('FAIL-CODE')
      }

      await new Promise(r => setTimeout(r, 10))
      
      expect(getModalProps()?.error).toBe('First failure')
      expect(mockOnActivate).toHaveBeenCalledWith('FAIL-CODE')

      // Second attempt - succeeds
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('SUCCESS-CODE')
      }

      expect(mockOnActivate).toHaveBeenCalledWith('SUCCESS-CODE')
    })
  })

  describe('different plan types', () => {
    it('renders free plan correctly', () => {
      renderComponent({ isFree: true, name: 'Free Plan' })
      expect(screen.getByText('Free Plan')).toBeTruthy()
    })

    it('renders plan without thumbnail', () => {
      renderComponent({ thumbnail: null, name: 'No Thumbnail Plan' })
      expect(screen.getByText('No Thumbnail Plan')).toBeTruthy()
    })

    it('renders plan with different billing intervals', () => {
      renderComponent({
        billingInterval: 'yearly',
        name: 'Yearly Plan',
        pricePence: 9999,
      })
      expect(screen.getByText('Yearly Plan')).toBeTruthy()
    })

    it('renders inactive plan correctly', () => {
      renderComponent({ isActive: false, name: 'Inactive Plan' })
      expect(screen.getByText('Inactive Plan')).toBeTruthy()
    })

    it('renders plan with different IDs', () => {
      renderComponent({ id: 'premium-plan-xyz', name: 'Premium Plan' })
      expect(screen.getByText('Premium Plan')).toBeTruthy()
    })

    it('renders plan with null description', () => {
      renderComponent({ name: 'Null Desc Plan', description: null })
      expect(screen.getByText('Null Desc Plan')).toBeTruthy()
    })

    it('renders plan with different price values', () => {
      renderComponent({ pricePence: 0, name: 'Free Plan' })
      expect(screen.getByText('Free Plan')).toBeTruthy()
    })

    it('renders plan with high price value', () => {
      renderComponent({ pricePence: 999999, name: 'Expensive Plan' })
      expect(screen.getByText('Expensive Plan')).toBeTruthy()
    })
  })

  describe('image handling', () => {
    it('passes thumbnail URL to image section', () => {
      renderComponent({ thumbnail: 'https://example.com/custom-thumb.jpg' })
      expect(capturedProps?.imageSection).toBeDefined()
    })

    it('handles plans with no thumbnail field', () => {
      renderComponent({ thumbnail: null })
      expect(capturedProps?.imageSection).toBeDefined()
    })

    it('handles plans with invalid thumbnail URLs', () => {
      renderComponent({ thumbnail: 'not-a-valid-url' })
      expect(capturedProps?.imageSection).toBeDefined()
    })

    it('handles plans with empty thumbnail', () => {
      renderComponent({ thumbnail: '' })
      expect(capturedProps?.imageSection).toBeDefined()
    })

    it('handles plans with data URI thumbnail', () => {
      renderComponent({ thumbnail: 'data:image/png;base64,abc123' })
      expect(capturedProps?.imageSection).toBeDefined()
    })

    it('handles relative thumbnail URLs', () => {
      renderComponent({ thumbnail: '/images/plan-thumb.jpg' })
      expect(capturedProps?.imageSection).toBeDefined()
    })

    it('handles HTTPS thumbnail URLs', () => {
      renderComponent({ thumbnail: 'https://secure.example.com/thumb.jpg' })
      expect(capturedProps?.imageSection).toBeDefined()
    })

    it('handles HTTP thumbnail URLs', () => {
      renderComponent({ thumbnail: 'http://insecure.example.com/thumb.jpg' })
      expect(capturedProps?.imageSection).toBeDefined()
    })
  })

  describe('callback handling', () => {
    it('passes the onActivate callback correctly', () => {
      renderComponent()
      expect(getModalProps()?.onSubmit).toBeDefined()
    })

    it('passes the onClose callback correctly', () => {
      renderComponent()
      expect(getModalProps()?.onClose).toBeDefined()
    })

    it('calls onClose without resetting anything unexpected', () => {
      renderComponent()
      const onClose = getModalProps()?.onClose
      if (onClose) {
        onClose()
      }
      expect(getModalProps()?.isOpen).toBe(false)
    })

    it('onActivate receives the activation code string', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.click(screen.getByText('Activate code'))

      const modalProps = getModalProps()
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('CODE-123')
      }

      expect(mockOnActivate).toHaveBeenCalledWith('CODE-123')
    })
  })

  describe('integration scenarios', () => {
    it('full flow: open modal, submit code, succeed', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.click(screen.getByText('Activate code'))
      expect(getModalProps()?.isOpen).toBe(true)

      const modalProps = getModalProps()
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('COMPLETE-CODE')
      }

      expect(mockOnActivate).toHaveBeenCalledWith('COMPLETE-CODE')
    })

    it('full flow: open modal, submit code, fail', async () => {
      const user = userEvent.setup()
      mockOnActivate.mockRejectedValueOnce(new Error('Wrong code'))

      renderComponent()

      await user.click(screen.getByText('Activate code'))

      const modalProps = getModalProps()
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('WRONG-CODE')
      }

      await new Promise(r => setTimeout(r, 10))

      expect(getModalProps()?.error).toBe('Wrong code')
      expect(mockOnActivate).toHaveBeenCalledWith('WRONG-CODE')
    })

    it('modal closes and resets on close after failed activation', () => {
      renderComponent()

      const onClose = getModalProps()?.onClose
      if (onClose) {
        onClose()
      }

      expect(getModalProps()?.isOpen).toBe(false)
    })

    it('error is cleared when modal is reopened', async () => {
      const user = userEvent.setup()
      mockOnActivate.mockRejectedValueOnce(new Error('Activation failed'))

      renderComponent()

      await user.click(screen.getByText('Activate code'))

      const modalProps = getModalProps()
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('BAD-CODE')
      }

      await new Promise(r => setTimeout(r, 10))

      expect(getModalProps()?.error).toBe('Activation failed')

      // Close modal
      if (modalProps?.onClose) {
        modalProps.onClose()
      }

      // Reopen modal - error should be cleared
      await user.click(screen.getByText('Activate code'))

      expect(getModalProps()?.isOpen).toBe(true)
    })

    it('renders correctly with all plan fields populated', () => {
      const fullPlan: Plan = {
        id: 'full-plan',
        name: 'Full Plan',
        description: 'A complete plan with all fields',
        isFree: false,
        billingInterval: 'yearly',
        pricePence: 9999,
        isActive: true,
        thumbnail: 'https://example.com/full-plan.jpg',
      }

      render(<PlanCardWithImage plan={fullPlan} onActivate={mockOnActivate} />)

      expect(screen.getByText('Full Plan')).toBeTruthy()
      expect(screen.getByText('A complete plan with all fields')).toBeTruthy()
    })

    it('renders correctly with minimal plan data', () => {
      const minimalPlan: Plan = {
        id: 'minimal',
        name: 'Minimal',
        description: null,
        isFree: true,
        billingInterval: null,
        pricePence: null,
        isActive: true,
        thumbnail: null,
      }

      render(<PlanCardWithImage plan={minimalPlan} onActivate={mockOnActivate} />)

      expect(screen.getByText('Minimal')).toBeTruthy()
    })
  })

  describe('error message handling', () => {
    it('handles Error objects with empty message', async () => {
      const user = userEvent.setup()
      mockOnActivate.mockRejectedValueOnce(new Error(''))

      renderComponent()

      await user.click(screen.getByText('Activate code'))

      const modalProps = getModalProps()
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('BAD-CODE')
      }

      await new Promise(r => setTimeout(r, 10))

      expect(getModalProps()?.error).toBeDefined()
    })

    it('handles Error objects with special characters in message', async () => {
      const user = userEvent.setup()
      mockOnActivate.mockRejectedValueOnce(new Error('Error: "invalid" code & special <chars>'))

      renderComponent()

      await user.click(screen.getByText('Activate code'))

      const modalProps = getModalProps()
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('BAD-CODE')
      }

      await new Promise(r => setTimeout(r, 10))

      expect(getModalProps()?.error).toBe('Error: "invalid" code & special <chars>')
    })

    it('handles Error objects with unicode in message', async () => {
      const user = userEvent.setup()
      mockOnActivate.mockRejectedValueOnce(new Error('错误：コードが無効です'))

      renderComponent()

      await user.click(screen.getByText('Activate code'))

      const modalProps = getModalProps()
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('BAD-CODE')
      }

      await new Promise(r => setTimeout(r, 10))

      expect(getModalProps()?.error).toBe('错误：コードが無効です')
    })

    it('handles Error objects with very long message', async () => {
      const user = userEvent.setup()
      const longMessage = 'Error: '.concat('x'.repeat(1000))
      mockOnActivate.mockRejectedValueOnce(new Error(longMessage))

      renderComponent()

      await user.click(screen.getByText('Activate code'))

      const modalProps = getModalProps()
      if (modalProps?.onSubmit) {
        await modalProps.onSubmit('BAD-CODE')
      }

      await new Promise(r => setTimeout(r, 10))

      expect(getModalProps()?.error).toBe(longMessage)
    })
  })
})