import { NextResponse } from 'next/server';
import { defaultDeleteCheckList } from '@/app/lib/actions';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; userId:string }> }
) {
  const { id,userId } = await params;
  await defaultDeleteCheckList(id,userId);
  return NextResponse.json({ ok: true });
}
