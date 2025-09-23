
import ProjectEditForm from '@/app/ui/dashboard/project/ProjectEditForm';
import { getProjectById } from '@/app/lib/data';
//sessionの取得
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth'; 
import { getClient } from '@/app/lib/data';// クライアントデータ取得関数

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Promise を await する
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; // チームIDを取得
    const project = await getProjectById(id, userId, teamId); // プロジェクトデータを取得
  const clients = await getClient(userId,teamId); // クライアントデータを取得


  return (
    <main className='p-6 md:p-12'>
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-xl md:text-2xl">案件編集</h1>
      </div>
      {/* ここにプロジェクト編集フォームを追加 */}
      <div className="border border-2 border-gray-300 p-4 rounded w-[60%] mx-auto mt-8">
        <ProjectEditForm project={project!} clients={clients} />
      </div>

    </main>
  );
}