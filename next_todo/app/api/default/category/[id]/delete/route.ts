import { NextResponse } from 'next/server';
import { defaultDeleteCategory } from '@/app/lib/actions';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await defaultDeleteCategory(params.id);
  return NextResponse.json({ ok: true });
}