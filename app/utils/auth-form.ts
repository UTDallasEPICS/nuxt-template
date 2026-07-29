import { z } from 'zod'

const email = z.string().email('Invalid email')

export function createAuthFormSchema(isEmailSent: boolean) {
  if (!isEmailSent) {
    return z.object({ email })
  }

  return z.object({
    email,
    otp: z.array(z.string()).length(6, 'Must be 6 digits'),
  })
}
