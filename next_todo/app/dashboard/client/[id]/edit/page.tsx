import ClientEditForm from '@/app/ui/dashboard/client/ClientEditForm';
import { getClientById} from '@/app/lib/data';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

export default async function ClientEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Promise を await する
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; // チームIDを取得

  const client = await getClientById(id, userId, teamId); // クライアントデータを取得
  return (
    <main className='p-6 md:p-12'>
      {/* 編集フォームや内容 */}
      <h1 className="mb-4 text-xl md:text-2xl">メモ編集</h1>

      <div className="border border-2 border-gray-300 p-4 rounded w-[60%] mx-auto mt-8">
        <ClientEditForm client={{ ...client!, memo: client!.memo ?? '' }} />
      </div>
    </main>
  );
} 
