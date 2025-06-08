// ✅ app/api/category/[id]/delete/route.ts

import { NextResponse } from 'next/server';
import { deleteCategory } from '@/app/lib/actions';

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  await deleteCategory(id);
  return NextResponse.json({ ok: true });
}
