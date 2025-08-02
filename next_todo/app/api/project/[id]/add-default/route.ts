import { NextResponse } from 'next/server';
import { createCheckListCategory, createCheckList } from '@/app/lib/actions';
import { getDefaultCheckListCategory, getDefaultCheckList,getCategoriesByProjectId } from '@/app/lib/data';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';


export async function POST(
  req: Request,
  { params }: 
  { params: Promise<{ id: string }> }
) {

   // リクエストボディを取得
  const body = await req.json();
  const { defaultProjectId } = body;

  //ログインユーザー
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  const userId = (session?.user as any)?.id;  // ← ログイン中ユーザーのIDを取得

  // projectIdを取得
  const { id: projectId } = await params;

  // デフォルトカテゴリーの取得
  const categories = await getDefaultCheckListCategory(defaultProjectId, userId);

  // デフォルトチェックリストの取得
  const defaultCheckList = await getDefaultCheckList(defaultProjectId, userId);
  console.log('defaultCheckList', defaultCheckList);

  // カテゴリーの配列からidを除いた配列を作成
  const categoryTitles = categories.map(item => ({ title: item.title }));

  // 1. カテゴリー追加と title → id の Map を構築
  const categoryMap = new Map<string, string>();
  // まずはカテゴリーを追加
  for (const item of categoryTitles) {
    const category = await createCheckListCategory(item.title, projectId, userId);
    // カテゴリーを追加した後、idを取得してMapに保存
    categoryMap.set(item.title, category.id); // ←戻り値に id が必要！
  }


  // デフォルトチェックリストの配列からidを除いた配列を作成
  const checkLists = defaultCheckList.map(item => ({
    title: item.title,
    status: item.status,
    categories: item.categories.map(cat => cat.title), // string[]
    createdUser: userId, // 作成者の情報を追加
  }));
  console.log('api:checkLists', checkLists);




  // 次にチェックリストを追加
  for (const item of checkLists) {
    const categoryIds: string[] = item.categories
    .map(title => categoryMap.get(title))
    .filter((id): id is string => typeof id === 'string');
    
    await createCheckList(item.title, projectId, categoryIds,item.createdUser ?? '',userId);
  }

  return NextResponse.json({ ok: true });
}
