import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/app/lib/user';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  const existing = await getUserByEmail(email);
  if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  await createUser(name, email, hashed, 'free'); // 'free'はプラン名として仮に設定

  return NextResponse.json({ success: true });
}
