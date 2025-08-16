export const dynamicParams = true;

import { lusitana } from '@/app/ui/fonts';
import ClientCheckList from '@/app/ui/dashboard/default/ClientCheckList';
import CheckListForm from '@/app/ui/dashboard/default/CheckListForm';
import { getDefaultById, getProjectById, getDefaultCheckListCategory } from '@/app/lib/data';
import Category from '@/app/ui/dashboard/default/Category'; // カテゴリーコンポーネントをインポート
import { choiceDefaultCategory } from '@/app/lib/data';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';


export default async function ProjectDetailPage({ params }: { params: Promise<{ defaultId: string; id: string; }>; }) {
  // paramsからdefaultIdとcategoryIdを取得
  const { defaultId: defaultId, id:id  } = await params;
  // console.log( 'defaultId:', defaultId, 'categoryId:', id);
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; // チームIDを取得

  const project = await getDefaultById(defaultId,userId, teamId); // デフォルトチェックリストのプロジェクト情報を取得

  const categories = await getDefaultCheckListCategory(defaultId, userId, teamId); // デフォルトチェックリストのカテゴリーを取得

  const data = await choiceDefaultCategory(id);

  // const data = (await choiceCategory(categoryId)).map(item => ({
  //   ...item,
  //   created_user: '',
  //   created_user_name: '',
  //   checked_user_name: '',
  //   created_at: '',
  // }));

// console.log('ProjectCategoryPage data:', data);

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          提出前チェックリスト
        </h1>
      </div>

      <div className="flex items-center justify-between p-4 mt-4">
        <div>
          <div>案件名：{project?.title ?? 'タイトル未設定'}</div>
        </div>
      </div>


      {/* 新規追加フォーム（クライアント側で動く） */}
      <CheckListForm
        defaultCategories={categories}
        defaultId={defaultId}
        userId={userId}
      />

      {/* カテゴリー選択 */}
      <div className="">
        <div className="">
          <Category defaultId={defaultId} defaultCategories={categories} id={id} />
        </div>
      </div>

      {/* チェックリストの表示（クライアントコンポーネント） */}
      <ClientCheckList data={data} defaultId={defaultId} />
    </main>
  );
}
