import  NextAuth  from 'next-auth';
import { authOptions } from '@/app/lib/auth'; // ← 自分の定義場所に合わせて変更

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
