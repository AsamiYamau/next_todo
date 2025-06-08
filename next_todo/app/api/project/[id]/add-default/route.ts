import { NextResponse } from 'next/server';
import { createCheckListCategory, createCheckList } from '@/app/lib/actions';
import { getDefaultCheckListCategory, getDefaultCheckList } from '@/app/lib/data';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // projectIdを取得
  const { id: projectId } = await params;

  // デフォルトカテゴリーの取得
  const categories = await getDefaultCheckListCategory();
  console.log('api', categories);

  // デフォルトチェックリストの取得
  const defaultCheckList = await getDefaultCheckList();
  console.log('defaultCheckList', defaultCheckList);

  // カテゴリーの配列からidを除いた配列を作成
  const categoryTitles = categories.map(item => ({ title: item.title }));

  // デフォルトチェックリストの配列からidを除いた配列を作成
  const checkLists = defaultCheckList.map(item => ({
    title: item.title,
    status: item.status,
    categories: item.categories.map(cat => cat.title) // string[]
  }));
  console.log('checkLists', checkLists);

  // まずはカテゴリーを追加
  for (const item of categoryTitles) {
    await createCheckListCategory(item.title, projectId);
  }

  // 次にチェックリストを追加
  for (const item of checkLists) {
    await createCheckList(item.title, projectId, item.categories);
  }

  return NextResponse.json({ ok: true });
}
