import { NextResponse } from 'next/server';
import { createCheckListCategory, createCheckList } from '@/app/lib/actions';
import { getDefaultCheckListCategory, getDefaultCheckList,getCategoriesByProjectId } from '@/app/lib/data';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // projectIdを取得
  const { id: projectId } = await params;

  // デフォルトカテゴリーの取得
  const categories = await getDefaultCheckListCategory();

  // デフォルトチェックリストの取得
  const defaultCheckList = await getDefaultCheckList();
  console.log('defaultCheckList', defaultCheckList);

  // カテゴリーの配列からidを除いた配列を作成
  const categoryTitles = categories.map(item => ({ title: item.title }));

  // 1. カテゴリー追加と title → id の Map を構築
  const categoryMap = new Map<string, string>();
  // まずはカテゴリーを追加
  for (const item of categoryTitles) {
    const category = await createCheckListCategory(item.title, projectId);
    // カテゴリーを追加した後、idを取得してMapに保存
    categoryMap.set(item.title, category.id); // ←戻り値に id が必要！
  }


  // デフォルトチェックリストの配列からidを除いた配列を作成
  const checkLists = defaultCheckList.map(item => ({
    title: item.title,
    status: item.status,
    categories: item.categories.map(cat => cat.title) // string[]
  }));
  console.log('api:checkLists', checkLists);




  // 次にチェックリストを追加
  for (const item of checkLists) {
    const categoryIds: string[] = item.categories
    .map(title => categoryMap.get(title))
    .filter((id): id is string => typeof id === 'string');
    
    await createCheckList(item.title, projectId, categoryIds);
  }

  return NextResponse.json({ ok: true });
}
