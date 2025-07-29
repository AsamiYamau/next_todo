import { NextResponse } from 'next/server';
import { deleteCheckList } from '@/app/lib/actions';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string, userId: string }> }
) {
  const { id, userId } = await params;
  await deleteCheckList(id, userId);
  return NextResponse.json({ ok: true });
}
