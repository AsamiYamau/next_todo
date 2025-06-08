import CheckListEditForm from '@/app/ui/dashboard/default/CheckListEditForm';
import { getDefaultCheckListById, getDefaultCheckListCategory } from '@/app/lib/data';

export default async function CheckListEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: checkListId } = await params;
  const checkListData = await getDefaultCheckListById(checkListId);
  const categories = await getDefaultCheckListCategory();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">チェックリスト編集ページ</h1>
      <p className="text-gray-600">ここではチェックリストの編集ができます。</p>
      <div className="border border-2 border-gray-300 p-4 rounded w-[60%] mx-auto mt-8">
        <CheckListEditForm checkListData={checkListData!} Category={categories!}/>
      </div>
    </div>
  );
}