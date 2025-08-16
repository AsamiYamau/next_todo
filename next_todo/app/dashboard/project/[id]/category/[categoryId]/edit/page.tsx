import { getCategoryById } from '@/app/lib/data';
import CategoryEditForm from '@/app/ui/dashboard/project/CategoryEditForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth'; 

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; categoryId: string }>;
}) {
  const { id: projectId, categoryId } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; // チームIDを取得
  const category = await getCategoryById(categoryId,userId, teamId); // カテゴリー情報を取得

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">カテゴリー編集</h1>
      <div className="border border-2 border-gray-300 p-4 rounded w-[60%] mx-auto">
        <CategoryEditForm category={category!} projectId={projectId!} />
      </div>
    </div>
  );
}