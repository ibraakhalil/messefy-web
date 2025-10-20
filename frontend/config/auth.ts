import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import axios from 'axios';
import { env } from './env';

const BASE_API_URL = env.API_INTERNAL_URL ?? env.NEXT_PUBLIC_API_URL;

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
          const { data } = await axios.post(`${BASE_API_URL}/auth/signin`, credentials);
          return data?.token ? data : null;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      console.log({ user });
      try {
        if (account?.provider === 'credentials') {
          return true;
        }

        const { data } = await axios.post(`${BASE_API_URL}/auth/sync-user`, user);

        console.log({ data });

        if (data.ok && data.token) {
          user.token = data.token;
          user.id = data.user.id;
          return true;
        }

        return false;
      } catch (e) {
        console.error('Sync failed', e);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.id = token.id as string;
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
    signOut: '/',
  },
  trustHost: true,
});
