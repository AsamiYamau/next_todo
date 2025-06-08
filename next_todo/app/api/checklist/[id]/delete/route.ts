import { NextResponse } from 'next/server';
import { deleteCheckList } from '@/app/lib/actions';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await deleteCheckList(params.id);
  return NextResponse.json({ ok: true });
}