import { z } from 'zod'

export const activationCodeSchema = z.object({
  activationCode: z.string().min(1, 'Activation code is required').max(128, 'Activation code is too long'),
})

export type ActivationCodeInput = z.infer<typeof activationCodeSchema>