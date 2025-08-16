import { getDefaultCategoryById } from '@/app/lib/data';
import CategoryEditForm from '@/app/ui/dashboard/default/CategoryEditForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth'; 


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: categoryId } = await params;
  const { id: defaultId } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id; // ユーザー
  const teamId = (session?.user as any)?.team_id; // チームIDを取得
  
  const category = await getDefaultCategoryById(categoryId,userId, teamId); // カテゴリー情報を取得
  

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">カテゴリー編集</h1>
      <div className="border border-2 border-gray-300 p-4 rounded w-[60%] mx-auto">
        <CategoryEditForm category={category!} userId={userId} defaultId={defaultId} teamId={teamId} />
      </div>
    </div>
  );
}