export const dynamicParams = true;

import { lusitana } from '@/app/ui/fonts';
import ClientCheckList from '@/app/ui/dashboard/check-list/ClientCheckList';
import CheckListForm from '@/app/ui/dashboard/check-list/CheckListForm';
import AddDefault from '@/app/ui/dashboard/project/AddDefault';
import { getCheckListByProjectId, getProjectById, getCategoriesByProjectId,getDefaultTemplate } from '@/app/lib/data';
import Arrart from '@/app/ui/dashboard/common/Arrart';
import Category from '@/app/ui/dashboard/project/Category'; // カテゴリーコンポーネントをインポート
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth'; 


export default async function ProjectDetailPage({
  params, searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; // チームIDを取得

  const data = await getCheckListByProjectId(id, userId, teamId); // プロジェクトIDに紐づくチェックリストを取得


  const project = await getProjectById(id, userId, teamId); // プロジェクトデータを取得

  const categories = await getCategoriesByProjectId(id, userId, teamId); // プロジェクトに紐づくカテゴリーを取得

  const defaultTemplate = await getDefaultTemplate(userId, teamId); // デフォルトテンプレートを取得
  



  return (
    <main className='p-6 md:p-12'>
      {/* 更新バナー */}
      <div className="text-right">
        <Arrart updated={sp.updated} />
      </div>
      <div className="md:flex items-center justify-between">
        <div>
          <div className='font-bold text-xl'>案件名：{project?.title ?? 'タイトル未設定'}</div>
          <div className='font-bold text-xl mt-2'>クライアント:{project?.client_name ?? 'クライアント未設定'}</div>
        </div>
        <AddDefault projectId={id} defaultTemplate={defaultTemplate} />
      </div>


      {/* 新規追加フォーム（クライアント側で動く） */}
      <CheckListForm projectId={id} projectCategories={categories} />

      {/* カテゴリー選択 */}
      <div className="">
        <div className="">
          <Category projectId={id} projectCategories={categories} />
        </div>
      </div>

      {/* チェックリストの表示（クライアントコンポーネント） */}
      <ClientCheckList data={data} projectId={id} />
    </main>
  );
}
