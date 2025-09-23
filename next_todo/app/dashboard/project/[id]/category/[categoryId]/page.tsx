export const dynamicParams = true;

import { lusitana } from '@/app/ui/fonts';
import ClientCheckList from '@/app/ui/dashboard/check-list/ClientCheckList';
import CheckListForm from '@/app/ui/dashboard/check-list/CheckListForm';
import { getCheckListByProjectId, getProjectById, getCategoriesByProjectId } from '@/app/lib/data';
import Category from '@/app/ui/dashboard/project/Category'; // カテゴリーコンポーネントをインポート
import { choiceCategory } from '@/app/lib/data';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';


export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string; categoryId: string; }>; }) {

  const { id: projectId, categoryId } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; // チームIDを取得

  const project = await getProjectById(projectId, userId, teamId); // プロジェクトデータを取得

  const categories = await getCategoriesByProjectId(projectId, userId, teamId); // プロジェクトに紐づくカテゴリーを取得

  const data = await choiceCategory(categoryId);

  // const data = (await choiceCategory(categoryId)).map(item => ({
  //   ...item,
  //   created_user: '',
  //   created_user_name: '',
  //   checked_user_name: '',
  //   created_at: '',
  // }));

console.log('ProjectCategoryPage data:', data);

  return (
    <main className='p-6 md:p-12'>
      <div className="flex items-center justify-between">
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          提出前チェックリスト
        </h1>
      </div>

      <div className="flex items-center justify-between p-4 mt-4">
        <div>
          <div>案件名：{project?.title ?? 'タイトル未設定'}</div>
          <div>クライアント:{project?.client ?? 'クライアント未設定'}</div>
        </div>
        <div>
          <div>チェック進捗</div>
          <div>
            <span className="text-xl font-bold">10</span>/<span>20</span>件中
          </div>
        </div>
      </div>


      {/* 新規追加フォーム（クライアント側で動く） */}
      <CheckListForm projectId={projectId} projectCategories={categories} categoryId={categoryId} />

      {/* カテゴリー選択 */}
      <div className="">
        <div className="">
          <Category projectId={projectId} projectCategories={categories} categoryId={categoryId} />
        </div>
      </div>

      {/* チェックリストの表示（クライアントコンポーネント） */}
      <ClientCheckList data={data} projectId={projectId} />
    </main>
  );
}
