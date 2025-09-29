import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import axios from 'axios';
import { env } from './env';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID!,
      clientSecret: env.AUTH_GOOGLE_SECRET!,
    }),

    Credentials({
      name: 'Credentials',
      async authorize(credentials) {
        try {
          const { data } = await axios.post(`${env.NEXT_PUBLIC_API_URL}/auth/login`, credentials);
          return data?.id ? data : null;
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === 'credentials') return true;
        const { data } = await axios.post(`${env.NEXT_PUBLIC_API_URL}/auth/sync-user`, user);
        return data.ok === true;
      } catch (e) {
        console.error('Sync failed', e);
        return false;
      }
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
    signOut: '/',
  },
});
