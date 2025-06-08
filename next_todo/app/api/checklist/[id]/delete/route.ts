import { NextResponse } from 'next/server';
import { deleteCheckList } from '@/app/lib/actions';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteCheckList(id);
  return NextResponse.json({ ok: true });
}
