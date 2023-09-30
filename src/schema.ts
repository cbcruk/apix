import { z } from 'zod'

export const querySchema = z.object({
  name: z.enum(['dashboard', 'app', 'server']),
  lang: z.enum(['ko', 'ja']),
  format: z.enum(['json', 'po']).optional(),
})

export type QuerySchema = z.infer<typeof querySchema>
