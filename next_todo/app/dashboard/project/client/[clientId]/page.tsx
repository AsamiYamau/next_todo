
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { getProjectByClientId, getClient } from "@/app/lib/data"; // プロジェクトとクライアントデータ取得関数
import { lusitana } from "@/app/ui/fonts";
import ProjectList from "@/app/ui/dashboard/project/ProjectList";
import CreateProjectForm from "@/app/ui/dashboard/project/CreateProjectForm";
import Client from "@/app/ui/dashboard/project/Client";
import Arrart from "@/app/ui/dashboard/common/Arrart";


export default async function Page({
  searchParams,
  params
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ clientId: string }>;
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; // チームIDを取得

  const { clientId } = await params;

  const data = await getProjectByClientId(clientId,userId, teamId); // クライアントIDに紐づくプロジェクトを取得
  const sp = await searchParams;
  const clients = await getClient(userId, teamId); // クライアントデータを取得
  console.log(clientId, 'params in project page');

  return (
    <main className='p-6 md:p-12'>
      {/* 更新バナー */}
      <div className="text-right">
        <Arrart updated={sp.updated} />
      </div>
      <div className="">
        <h1 className="mb-4 text-xl md:text-2xl font-bold">案件一覧</h1>
        <div className="border border-2 border-gray-300 p-4 rounded mx-auto mt-8">
          <div className="font-bold text-sky-900">⚫︎新規案件追加</div>
          <CreateProjectForm clients={clients} />
        </div>
      </div>
      {/* クライアント選択 */}
      <div className="mt-20">
        <div className="">
          <Client clients={clients} clientId={clientId}/>
        </div>
      </div>
      <div className="mt-10">
        <ProjectList data={data} />
      </div>
    </main>
  );
}
