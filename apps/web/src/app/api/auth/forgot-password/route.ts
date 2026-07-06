import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      const token = crypto.randomUUID()
      const expires = new Date(Date.now() + 3600000)

      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      })
    }

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent' })
  } catch {
    return NextResponse.json({ message: 'If an account exists, a reset link has been sent' })
  }
}
