import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import AppleProvider from 'next-auth/providers/apple'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      username: string
      displayName: string
      avatarUrl?: string | null
      isVerifiedBadge: boolean
      role: string
      wallet?: {
        coinBalance: number
        diamondBalance: number
      }
    }
  }
  interface User {
    username: string
    displayName: string
    avatarUrl?: string | null
    isVerifiedBadge: boolean
    role: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username: string
    displayName: string
    avatarUrl?: string | null
    isVerifiedBadge: boolean
    role: string
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/feed',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { wallet: true },
        })

        if (!user || !user.passwordHash) {
          throw new Error('Invalid email or password')
        }

        const isValid = await compare(credentials.password, user.passwordHash)

        if (!isValid) {
          throw new Error('Invalid email or password')
        }

        if (user.status !== 'ACTIVE') {
          throw new Error('Account is not active')
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date(), isOnline: true },
        })

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          isVerifiedBadge: user.isVerifiedBadge,
          role: user.role,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { scope: 'openid email profile', prompt: 'consent', access_type: 'offline' },
      },
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id
        token.username = (user as { username: string }).username
        token.displayName = (user as { displayName: string }).displayName
        token.avatarUrl = (user as { avatarUrl?: string | null }).avatarUrl
        token.isVerifiedBadge = (user as { isVerifiedBadge: boolean }).isVerifiedBadge
        token.role = (user as { role: string }).role
      }
      if (account?.provider === 'google' && profile) {
        const pic = (profile as { picture?: string }).picture
        if (pic) token.avatarUrl = pic
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.username = token.username
        session.user.displayName = token.displayName
        session.user.avatarUrl = token.avatarUrl
        session.user.isVerifiedBadge = token.isVerifiedBadge
        session.user.role = token.role
      }
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'apple') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (!existingUser) {
          const baseUsername = user.email!.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '')
          let username = baseUsername
          let counter = 1
          while (await prisma.user.findUnique({ where: { username } })) {
            username = `${baseUsername}${counter}`
            counter++
          }

          await prisma.user.create({
            data: {
              email: user.email!,
              username,
              displayName: user.name || username,
              avatarUrl: user.image,
              passwordHash: '',
              isVerifiedBadge: true,
              role: 'USER',
            },
          })
        }
      }
      return true
    },
  },
  events: {
    async createUser({ user }) {
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
        data: {
          userId: user.id,
        },
      })
      await prisma.profile.create({
        data: {
          userId: user.id,
          displayName: user.name || user.email?.split('@')[0] || 'User',
        },
      })
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
