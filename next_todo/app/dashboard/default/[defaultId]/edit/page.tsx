
import TemplateEditForm from '@/app/ui/dashboard/default/TemplateEditForm';
import { getDefaultById } from '@/app/lib/data';
//sessionの取得
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth'; 
import { getClient } from '@/app/lib/data';// クライアントデータ取得関数

export default async function Page({ params }: { params: Promise<{ defaultId: string }> }) {
  const { defaultId } = await params; // Promise を await する
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; // チームIDを取得
    const project = await getDefaultById(defaultId, userId, teamId); // デフォルトチェックリストのプロジェクト情報を取得


  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-xl md:text-2xl">案件編集</h1>
      </div>
      {/* ここにプロジェクト編集フォームを追加 */}
      <div className="border border-2 border-gray-300 p-4 rounded w-[60%] mx-auto mt-8">
        <TemplateEditForm project={project!}/>
      </div>

    </main>
  );
}