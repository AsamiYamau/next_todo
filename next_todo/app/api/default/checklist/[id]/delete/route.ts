import { NextResponse } from 'next/server';
import { defaultDeleteCheckList } from '@/app/lib/actions';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await defaultDeleteCheckList(id);
  return NextResponse.json({ ok: true });
}
