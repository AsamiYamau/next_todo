import { NextResponse } from 'next/server';
import { defaultDeleteCategory } from '@/app/lib/actions';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string,userId:string, teamId:string }> }
) {
  const { id } = await params;
  const { userId, teamId } = await req.json(); // ユーザーIDとチームIDをリクエストボディから取得
  await defaultDeleteCategory(id,userId, teamId);
  return NextResponse.json({ ok: true });
}
