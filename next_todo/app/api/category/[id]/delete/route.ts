import { NextResponse } from 'next/server';
import { deleteCategory } from '@/app/lib/actions';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string, userId: string, teamId:string }> }
): Promise<Response> {
  const { id } = await params;  // Promise を await する
  const { userId, teamId } = await req.json(); // リクエストボディから userId と teamId を取得
  await deleteCategory(id, userId,teamId);
  return NextResponse.json({ ok: true });
}
