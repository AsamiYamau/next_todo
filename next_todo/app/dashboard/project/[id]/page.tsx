export const dynamicParams = true;

import { lusitana } from '@/app/ui/fonts';
import ClientCheckList from '@/app/ui/dashboard/check-list/ClientCheckList';
import CheckListForm from '@/app/ui/dashboard/check-list/CheckListForm';
import AddDefault from '@/app/ui/dashboard/project/AddDefault';
import { getCheckListByProjectId,getProjectById ,getCategoriesByProjectId} from '@/app/lib/data';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
   const { id } = await params;
  const data = await getCheckListByProjectId(id);

  const project = await getProjectById(id);

  const categories = await getCategoriesByProjectId(id);

  console.log('ProjectDetailPage data:', data);


 
  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl font-bold`}> 
          提出前チェックリスト
        </h1>
      <AddDefault projectId={id}/>
      </div>

      <div className="flex items-center justify-between p-4 mt-4">
        <div>
          <div className='font-bold text-xl'>案件名：{project?.title ?? 'タイトル未設定'}</div>
          <div className='font-bold text-xl mt-2'>クライアント:{project?.client ?? 'クライアント未設定'}</div>
        </div>
        <div>
          <div>チェック進捗</div>
          <div>
            <span className="text-xl font-bold">10</span>/<span>20</span>件中
          </div>
        </div>
      </div>


      {/* 新規追加フォーム（クライアント側で動く） */}
      <CheckListForm projectId={id}  projectCategories={categories}/>

      {/* チェックリストの表示（クライアントコンポーネント） */}
      <ClientCheckList data={data} projectId={id}/>
    </main>
  );
}
  