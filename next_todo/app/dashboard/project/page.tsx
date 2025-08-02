import { lusitana } from "@/app/ui/fonts";
import { getProject } from "@/app/lib/data";
import ProjectList from "@/app/ui/dashboard/project/ProjectList";
import Link from "next/link";
import CreateProjectForm from "@/app/ui/dashboard/project/CreateProjectForm";
import Client from "@/app/ui/dashboard/project/Client";
import Arrart from "@/app/ui/dashboard/common/Arrart";
import { getClient } from "@/app/lib/data"; // クライアントデータ取得関数

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth"; // 認証設定の場所によって調整

export default async function Page({
  searchParams,params
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id; // ユーザーIDを取得

  const { id } = await params;
  

  const data = await getProject(userId);
  const sp = await searchParams;
  const clients = await getClient(userId); // クライアントデータを取得
  return (
    <main>
      {/* 更新バナー */}
      <div className="text-right">
        <Arrart updated={sp.updated} />
      </div>
      <div className="">
        <h1 className="mb-4 text-xl md:text-2xl font-bold">案件一覧</h1>
        <div className="border border-2 border-gray-300 p-4 rounded w-[60%] mx-auto mt-8">
          <div className="font-bold text-blue-500">⚫︎新規案件追加</div>
          <CreateProjectForm clients={clients} />
        </div>
      </div>
        {/* クライアント選択 */}
        <div className="mt-20">
          <div className="">
            <Client clients={clients} />
          </div>
        </div>
      <div className="mt-10">
        <ProjectList data={data} />
      </div>
    </main>
  );
}
