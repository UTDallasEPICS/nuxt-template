import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'
import { emailOTP } from 'better-auth/plugins/email-otp'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'OTP for nuxt-template',
          html: `Your OTP is: ${otp}`,
        })
      },
    }),
  ],
})
