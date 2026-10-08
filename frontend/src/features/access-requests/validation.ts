import { z } from 'zod'

export const REQUEST_DURATIONS = ['15', '30', '60'] as const

export const accessRequestSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(20, 'Reason must be at least 20 characters.')
    .max(500, 'Reason must be 500 characters or fewer.'),
  duration: z.enum([...REQUEST_DURATIONS, 'demo60'], {
    required_error: 'Select a requested duration.',
    invalid_type_error: 'Select a requested duration.',
  }),
  acknowledged: z.boolean().refine((value) => value, {
    message: 'You must acknowledge the two-person approval and temporary access requirements.',
  }),
})

export type AccessRequestFormValues = z.infer<typeof accessRequestSchema>
