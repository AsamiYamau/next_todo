//ユーザーの権限変更
import { NextResponse } from 'next/server';
import { updateUserRole } from '@/app/lib/actions';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function PUT(req: Request) {
  const { userId, roleValue, teamId } = await req.json();

  
  try {
    await updateUserRole(userId, roleValue);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('権限変更エラー:', error);
    return NextResponse.json({ success: false, error: '権限の変更に失敗しました。' }, { status: 500 });
  }
}