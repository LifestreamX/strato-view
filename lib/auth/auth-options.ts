import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/db/prisma'
import { logger } from '@/lib/utils/logger'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
    async signIn({ user, account, profile }) {
      logger.authEvent('sign_in', user.id)
      return true
    },
  },
  events: {
    async signIn({ user }) {
      logger.authEvent('user_signed_in', user.id)
    },
    async signOut({ session }) {
      logger.authEvent('user_signed_out')
    },
    async createUser({ user }) {
      logger.authEvent('user_created', user.id)

      // Create default user preferences
      await prisma.userPreferences.create({
        data: {
          userId: user.id,
        },
      })
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
  },
}
