import Image from 'next/image'
import type { Plan } from '@/app/types/plan'
import MediaCard from '@/app/components/molecules/MediaCard'
import ActivationCodeModal from '@/app/components/molecules/ActivationCodeModal'
import Button from '@/app/components/atoms/Button'
import { useState } from 'react'

const EXAMPLE_IMAGE_URL = 'https://i.ytimg.com/vi/BMkwmQmUa_g/hqdefault.jpg';

export default function PlanCardWithImage({ plan, onActivate }: { plan: Plan; onActivate: (code: string) => Promise<void> }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleActivate(code: string) {
    try {
      setError(null)
      await onActivate(code)
      setIsModalOpen(false)
    } catch (err: unknown) {
      const message = err instanceof Error && err.message ? err.message : 'Failed to activate code. Please try again.'
      setError(message)
    }
  }

    return (
        <>
            <MediaCard
                imageSection={
                    <>
                        <Image
                            src={EXAMPLE_IMAGE_URL}
                            alt={plan.name}
                            fill
                            className="object-cover"
                        />

                        {/* Activate code button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
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
                onClose={() => {
                    setIsModalOpen(false)
                    setError(null)
                }}
                onSubmit={handleActivate}
                error={error}
            />
        </>
    )
}