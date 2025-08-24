import { getClientById } from '@/app/lib/data';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';


export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Promise を await する
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; // チームIDを取得
  const client = await getClientById(id,userId, teamId); //
  console.log("client", client);
  return (
    <div>
      {/* クライアント詳細や内容 */}
      <h2>クライアント名：<span>{client?.name}</span></h2>

      <h3 className='mt-4'>メモ</h3>
      <p className='p-2  border-2 border-blue-200 rounded whitespace-pre-wrap'>{client?.memo}</p>
    </div>
  );
}