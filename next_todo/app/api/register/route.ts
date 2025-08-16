import { NextResponse } from 'next/server';
import { createUser, getUserByEmail, getInviteByToken,markInviteAccepted } from '@/app/lib/user';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { name, email, password,token } = await req.json();
  const existing = await getUserByEmail(email);
  if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 400 });

  // 招待トークンがあれば検証しteamId取得
  let teamId = null;
  let role = 1; // デフォルトは管理者ユーザー
  if (token) {
    const invite = await getInviteByToken(token);
    if (!invite) {
      return NextResponse.json({ error: "無効な招待リンクです" }, { status: 400 });
    }
    if (invite.accepted) {
      return NextResponse.json({ error: "招待リンクはすでに使用されています" }, { status: 400 });
    }
    if (new Date(invite.expires_at) < new Date()) {
      return NextResponse.json({ error: "招待リンクの有効期限が切れています" }, { status: 400 });
    }
    teamId = invite.team_id;
    role = 2; // 招待ユーザーは通常ユーザー
  }

  const hashed = await bcrypt.hash(password, 10);
  const plan = 3;
  await createUser(name, email, hashed, role, plan, teamId); 

  // 招待から登録したらinvitesテーブルのaccepted更新
  if (token) {
    await markInviteAccepted(token);
  }

  return NextResponse.json({ success: true });
}
