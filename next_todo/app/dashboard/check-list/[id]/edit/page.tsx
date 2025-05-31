import CheckListEditForm from '@/app/ui/dashboard/check-list/CheckListEditForm';
import { getCheckListById,getProjectIdByCheckListId,getCategoriesByProjectId } from '@/app/lib/data';

export default async function CheckListEditPage({ params }: { params: { id: string } }) {
  const checkListId = params.id;

  const checkListData = await getCheckListById(checkListId);
  // project_idを取得
  const projectId = await getProjectIdByCheckListId(checkListId);
  // プロジェクトのカテゴリーを取得
  const projectCategories = await getCategoriesByProjectId(projectId!);


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">チェックリスト編集ページ</h1>
      <p className="text-gray-600">ここではチェックリストの編集ができます。</p>
      {/* ここに編集フォームやコンポーネントを追加 */}
      <div className="border border-2 border-gray-300 p-4 rounded w-[60%] mx-auto mt-8">
        <CheckListEditForm checkListData={checkListData!} Category={projectCategories} ProjectId={projectId!} />
      </div>
    </div>
  );

}