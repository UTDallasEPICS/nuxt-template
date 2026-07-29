import { describe, expect, it } from 'vitest'
import { createAuthFormSchema } from '../../app/utils/auth-form'

describe('auth form schema', () => {
  it('accepts a valid generated address before OTP is requested', () => {
    const result = createAuthFormSchema(false).safeParse({
      email: 'member@example.test',
    })

    expect(result.success).toBe(true)
  })

  it('rejects a malformed address with the screen validation message', () => {
    const result = createAuthFormSchema(false).safeParse({
      email: 'not-an-email',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Invalid email')
  })

  it('requires all six OTP positions after the email step', () => {
    const result = createAuthFormSchema(true).safeParse({
      email: 'member@example.test',
      otp: ['1', '2', '3', '4', '5'],
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Must be 6 digits')
  })

  it('accepts a complete six-position OTP for a valid address', () => {
    const result = createAuthFormSchema(true).safeParse({
      email: 'member@example.test',
      otp: ['1', '2', '3', '4', '5', '6'],
    })

    expect(result.success).toBe(true)
  })
})
