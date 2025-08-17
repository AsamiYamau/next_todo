//ユーザーの権限変更
import { NextResponse } from 'next/server';
import { updateUserRole } from '@/app/lib/actions';

export async function PUT(req: Request) {
  const { userId, roleValue } = await req.json();
  console.log('ユーザーID:', userId, '権限値:', roleValue);

  await updateUserRole(userId, roleValue);

  try {
    return NextResponse.json({ success: true, });
  } catch (error) {
    console.error('チーム作成エラー:', error);
    return NextResponse.json({ success: false, error: '権限の変更に失敗しました。' }, { status: 500 });
  }
}