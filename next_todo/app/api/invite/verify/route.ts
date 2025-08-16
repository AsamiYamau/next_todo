import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

import { NextResponse } from "next/server";
// 簡単なUUIDチェック用正規表現
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ success: false, error: "トークンがありません" });
  }
  // UUID形式チェック
  if (!UUID_REGEX.test(token)) {
    return NextResponse.json({ success: false, error: "無効なトークンです" });
  }

  const invite = await sql`
    SELECT email, team_id, expires_at, accepted FROM invites WHERE token = ${token}
  `;

  if (invite.length === 0) {
    return NextResponse.json({ success: false, error: "無効なトークンです" });
  }

  const row = invite[0];

  if (row.accepted) {
    return NextResponse.json({ success: false, error: "すでに使用された招待リンクです" });
  }

  if (new Date(row.expires_at) < new Date()) {
    return NextResponse.json({ success: false, error: "招待リンクの有効期限が切れています" });
  }

  return NextResponse.json({ success: true, email: row.email, teamId: row.team_id });
}
