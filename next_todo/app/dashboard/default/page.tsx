export const dynamicParams = true;

import { lusitana } from '@/app/ui/fonts';
import ClientCheckList from '@/app/ui/dashboard/default/ClientCheckList';
import CheckListForm from '@/app/ui/dashboard/default/CheckListForm';
import { getDefaultCheckList,getDefaultCheckListCategory} from '@/app/lib/data';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const  id  =  params.id;
  // const data = await getCheckListByProjectId(id);

  // const project = await getProjectById(id);

  // const categories = await getCategoriesByProjectId(id);

  const data = await getDefaultCheckList();// デフォルトチェックリストを取得
  const categories = await getDefaultCheckListCategory(); // デフォルトチェックリストのカテゴリーを取得


 
  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl font-bold`}> 
          デフォルトチェックリスト設定
        </h1>
      </div>



      {/* 新規追加フォーム（クライアント側で動く） */}
      <CheckListForm defaultCategories={categories}/>

      {/* チェックリストの表示（クライアントコンポーネント） */}
      <ClientCheckList data={data}/>
    </main>
  );
}
  