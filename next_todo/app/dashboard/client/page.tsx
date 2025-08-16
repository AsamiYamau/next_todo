import { lusitana } from '@/app/ui/fonts';
import { getClient } from '@/app/lib/data';
import ClientList from '@/app/ui/dashboard/client/ClientList';
import Link from 'next/link';
import CreateClientForm from '@/app/ui/dashboard/client/CreateClientForm';
import Arrart from '@/app/ui/dashboard/common/Arrart';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth'; // 認証設定の場所によって調整


export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; // チームIDを取得
  const data = await getClient(userId,teamId);
  const sp = await searchParams;
  return (
    <main>
      {/* 更新バナー */}
      <div className="text-right">
        <Arrart updated={sp.updated} />
      </div>
      <div className="">
        <h1 className="mb-4 text-xl md:text-2xl font-bold">クライアント一覧</h1>
        <div className="border border-2 border-gray-300 p-4 rounded w-[60%] mx-auto mt-8">
          <div className="font-bold text-blue-500">⚫︎新規クライアント追加</div>
          <CreateClientForm />

        </div>
        {/* <div>
          <Link href="/dashboard/project/create" className="text-blue-600 hover:underline">
            新規作成
          </Link>
        </div> */}
      </div>
      <div className="mt-20">
        <ClientList data={data} />
      </div>

    </main>
  );
}