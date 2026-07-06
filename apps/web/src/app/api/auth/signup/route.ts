import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { username, email, password, displayName } = await req.json()

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Username, email, and password are required' },
        { status: 400 }
      )
    }

    if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { message: 'Username must be at least 3 characters and can only contain letters, numbers, and underscores' },
        { status: 400 }
      )
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } })
    if (existingUsername) {
      return NextResponse.json(
        { message: 'This username is already taken' },
        { status: 409 }
      )
    }

    const passwordHash = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        displayName: displayName || username,
        passwordHash,
        isVerifiedBadge: false,
        role: 'USER',
      },
    })

    await prisma.wallet.create({
      data: {
        userId: user.id,
        coinBalance: 0,
        diamondBalance: 0,
        bonusBalance: 0,
        totalEarned: 0,
        totalSpent: 0,
      },
    })

    await prisma.userSettings.create({
      data: { userId: user.id },
    })

    await prisma.profile.create({
      data: {
        userId: user.id,
        displayName: displayName || username,
      },
    })

    return NextResponse.json(
      { message: 'Account created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}
