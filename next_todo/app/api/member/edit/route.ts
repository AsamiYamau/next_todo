//ユーザーの権限変更
import { NextResponse } from 'next/server';
import { updateUserRole } from '@/app/lib/actions';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function PUT(req: Request) {
  const { userId, roleValue, teamId } = await req.json();
  console.log('ユーザーID:', userId, '権限値:', roleValue, 'チームID:', teamId);

  // 管理者を編集者に変更しようとしている場合、管理者が1人しかいないかチェック
  if (roleValue !== 1) {
    // チーム内の管理者の人数を取得
    const admins = await sql`
      SELECT COUNT(*) FROM users WHERE team_id = ${teamId} AND role = 1
    `;
    const adminCount = Number(admins[0].count || admins[0].count_0);
    // 管理者が1人しかいない場合は変更不可
    if (adminCount <= 1) {
      return NextResponse.json({ success: false, error: 'チームには最低1人の管理者が必要です。' }, { status: 400 });
    }
  }

  
  try {
    await updateUserRole(userId, roleValue);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('権限変更エラー:', error);
    return NextResponse.json({ success: false, error: '権限の変更に失敗しました。' }, { status: 500 });
  }
}