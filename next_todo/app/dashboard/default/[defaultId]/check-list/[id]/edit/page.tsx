import CheckListEditForm from '@/app/ui/dashboard/default/CheckListEditForm';
import { getDefaultCheckListById, getDefaultCheckListCategory, getDefaultIdByCheckListId} from '@/app/lib/data';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

export default async function CheckListEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: checkListId } = await params;
  
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id; 

  const checkListData = await getDefaultCheckListById(checkListId, userId);
  const defaultId = await getDefaultIdByCheckListId(checkListId, userId);
  console.log('defaultId:', defaultId);
  const categories = await getDefaultCheckListCategory(defaultId!, userId);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">チェックリスト編集ページ</h1>
      <p className="text-gray-600">ここではチェックリストの編集ができます。</p>
      <div className="border border-2 border-gray-300 p-4 rounded w-[60%] mx-auto mt-8">
        <CheckListEditForm checkListData={checkListData!} Category={categories!} defaultId={defaultId!}/>
      </div>
    </div>
  );
}