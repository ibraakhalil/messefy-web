import { DrizzleAdapter } from '@auth/drizzle-adapter';
import GoogleProvider from '@auth/core/providers/google';
import CredentialsProvider from '@auth/core/providers/credentials';
import type { AuthConfig } from '@auth/core';
import { db } from '../db';

export const authConfig: AuthConfig = {
  adapter: DrizzleAdapter(db),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Add your authentication logic here
        // This is a simple example - use proper password hashing in production
        if (credentials?.email === 'user@example.com' && credentials?.password === 'password') {
          return {
            id: '1',
            email: 'user@example.com',
            name: 'Test User',
          };
        }
        return null;
      },
    }),
  ],

  secret: process.env.AUTH_SECRET!,
  trustHost: true,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: `${process.env.FRONTEND_URL}/auth/signin`,
    error: `${process.env.FRONTEND_URL}/auth/error`,
  },
};
