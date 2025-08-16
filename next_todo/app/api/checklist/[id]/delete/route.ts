import { NextResponse } from 'next/server';
import { deleteCheckList } from '@/app/lib/actions';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; userId: string; teamId: string }> }
) {
  const { userId, teamId } = await req.json();
  const { id } = await params;
  await deleteCheckList(id, userId, teamId);
  return NextResponse.json({ ok: true });
}