

import { NextResponse } from 'next/server';
import { deleteCheckList } from '@/app/lib/actions';

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  await deleteCheckList(id);
  return NextResponse.json({ ok: true });
}
