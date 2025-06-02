import { NextResponse } from 'next/server';
import { deleteCategory } from '@/app/lib/actions';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await deleteCategory(params.id);
  return NextResponse.json({ ok: true });
}