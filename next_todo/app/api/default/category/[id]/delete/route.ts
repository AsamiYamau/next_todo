import { NextResponse } from 'next/server';
import { defaultDeleteCategory } from '@/app/lib/actions';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await defaultDeleteCategory(id);
  return NextResponse.json({ ok: true });
}
