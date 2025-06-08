import { NextResponse } from 'next/server';
import { deleteCategory } from '@/app/lib/actions';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;  // Promise を await する
  await deleteCategory(id);
  return NextResponse.json({ ok: true });
}
