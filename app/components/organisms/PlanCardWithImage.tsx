import Image from 'next/image'
import type { Plan } from '@/app/types/plan'
import MediaCard from '@/app/components/molecules/MediaCard'
import ActivationCodeModal from '@/app/components/molecules/ActivationCodeModal'
import Button from '@/app/components/atoms/Button'
import { useState } from 'react'

const EXAMPLE_IMAGE_URL = 'https://i.ytimg.com/vi/bjgqwBQ8-7g/hqdefault.jpg';

export default function PlanCardWithImage({ plan, onActivate, error: propError, isOpen: propIsOpen, onModalClose, onOpen }: { plan: Plan; onActivate: (code: string) => Promise<void>; error?: string | null; isOpen?: boolean; onModalClose?: () => void; onOpen?: () => void }) {
    const [localIsOpen, setLocalIsOpen] = useState(false)
    const [localError, setLocalError] = useState<string | null>(null)

    // Prefer prop values over local state
    const isModalOpen = propIsOpen ?? localIsOpen
    // Prefer prop error over local error
    const error = propError ?? localError

  function openModal() {
    if (propIsOpen !== undefined) {
      // Notify parent to open the modal
      onOpen?.()
      return
    }
    setLocalIsOpen(true)
  }

    function closeModal() {
        if (propIsOpen !== undefined) {
            // Notify parent to close the modal
            onModalClose?.()
            return
        }
        setLocalIsOpen(false)
    }

    async function handleActivate(code: string) {
        try {
            setLocalError(null)
            await onActivate(code)
            if (propIsOpen === undefined) {
                setLocalIsOpen(false)
            }
        } catch (err: unknown) {
            const message = err instanceof Error && err.message ? err.message : 'Failed to activate code. Please try again.'
            setLocalError(message)
        }
    }

    return (
        <>
            <MediaCard
                imageSection={
                    <>
                        <Image
                            src={plan.thumbnail ?? EXAMPLE_IMAGE_URL}
                            alt={plan.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                                if (plan.thumbnail) {
                                    (e.target as HTMLImageElement).src = EXAMPLE_IMAGE_URL
                                }
                            }}
                        />

                        {/* Activate code button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Button variant="primary" size="md" onClick={openModal}>
                                Activate code
                            </Button>
                        </div>
                    </>
                }
                title={plan.name}
                description={plan.description ?? undefined}
            />

            <ActivationCodeModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleActivate}
                error={error}
            />
        </>
    )
}
