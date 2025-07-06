export const dynamicParams = true;

import { lusitana } from '@/app/ui/fonts';
import ClientCheckList from '@/app/ui/dashboard/check-list/ClientCheckList';
import CheckListForm from '@/app/ui/dashboard/check-list/CheckListForm';
import AddDefault from '@/app/ui/dashboard/project/AddDefault';
import { getCheckListByProjectId, getProjectById, getCategoriesByProjectId } from '@/app/lib/data';
import Arrart from '@/app/ui/dashboard/common/Arrart';


export default async function ProjectDetailPage({
  params, searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const data = await getCheckListByProjectId(id);


  const project = await getProjectById(id);

  const categories = await getCategoriesByProjectId(id);

  console.log('ProjectDetailPage data:', data);



  return (
    <main>
      {/* 更新バナー */}
      <div className="text-right">
        <Arrart updated={sp.updated} />
      </div>
      <div className="flex items-center justify-between">
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl font-bold`}>
          提出前チェックリスト
        </h1>
        <AddDefault projectId={id} />
      </div>

      <div className="flex items-center justify-between p-4 mt-4">
        <div>
          <div className='font-bold text-xl'>案件名：{project?.title ?? 'タイトル未設定'}</div>
          <div className='font-bold text-xl mt-2'>クライアント:{project?.client ?? 'クライアント未設定'}</div>
        </div>

      </div>


      {/* 新規追加フォーム（クライアント側で動く） */}
      <CheckListForm projectId={id} projectCategories={categories} />

      {/* チェックリストの表示（クライアントコンポーネント） */}
      <ClientCheckList data={data} projectId={id} />
    </main>
  );
}
