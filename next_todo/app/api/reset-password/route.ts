import { NextResponse } from 'next/server';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(req: Request) {
  const { token, password } = await req.json();
  if (!token || !password) {
    return NextResponse.json({ success: false, error: '不正なリクエストです' }, { status: 400 });
  }

  // 1. トークンの検証
  const resetRows = await sql`
    SELECT * FROM password_resets WHERE token = ${token} AND accepted = false AND expires_at > NOW()
  `;
  const reset = resetRows[0];
  if (!reset) {
    return NextResponse.json({ success: false, error: 'トークンが無効または期限切れです' }, { status: 400 });
  }

  // 2. ユーザーの存在確認
  const userRows = await sql`
    SELECT * FROM users WHERE id = ${reset.user_id}
  `;
  const user = userRows[0];
  if (!user) {
    return NextResponse.json({ success: false, error: 'ユーザーが見つかりません' }, { status: 404 });
  }

  // 3. パスワード更新
  const hashed = await bcrypt.hash(password, 10);
  await sql`
    UPDATE users SET password = ${hashed} WHERE id = ${reset.user_id}
  `;

  // 4. トークンを使用済みに
  await sql`
    UPDATE password_resets SET accepted = true WHERE id = ${reset.id}
  `;

  return NextResponse.json({ success: true });
}
