import { NextResponse } from 'next/server';
import { defaultDeleteCheckList } from '@/app/lib/actions';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await defaultDeleteCheckList(params.id);
  return NextResponse.json({ ok: true });
}