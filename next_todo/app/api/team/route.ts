import { NextResponse } from 'next/server';
import { createTeam } from '@/app/lib/actions';
//ログインユーザー
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth'; // 認証設定の場所によって調整


export async function POST(req: Request) {
  const { name } = await req.json();
  console.log('チーム名:', name);
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  const userId = (session?.user as any)?.id; // ログイン中ユーザーのIDを取得
  try {
    const team = await createTeam(name, userId);
    return NextResponse.json({ success: true, team });
  } catch (error) {
    console.error('チーム作成エラー:', error);
    return NextResponse.json({ success: false, error: 'チームの作成に失敗しました。' }, { status: 500 });
  }
}