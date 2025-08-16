import type { SessionStrategy } from "next-auth";
import type { NextAuthOptions, User, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByEmail } from './user';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await getUserByEmail(credentials?.email ?? '');
        if (!user) return null;

        const valid = await bcrypt.compare(credentials!.password, user.password);
        if (!valid) return null;


        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.plan, 
          team_id: user.team_id, // チームIDを追加
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt" as SessionStrategy, 
  },
callbacks: {
  async jwt({ token, user }: { token: JWT; user?: User }) {
    if (user) {
      token.id = user.id;
      token.role = (user as any).role; // User型にroleが含まれていないため
      token.plan = (user as any).plan; 
      token.team_id = (user as any).team_id; // チームIDを追加
    }
    return token;
  },
async session({ session, token }: { session: Session; token: JWT }) {
  if (session.user) {
  (session.user as any).id = (token as any).id;
  (session.user as any).role = (token as any).role;
  (session.user as any).plan = (token as any).plan; 
  (session.user as any).team_id = (token as any).team_id; // チームIDを追加
  }
  return session;
}
},

  secret: process.env.AUTH_SECRET,
};