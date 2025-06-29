import { lusitana } from '@/app/ui/fonts';
import { getProject } from '@/app/lib/data';
import ProjectList from '@/app/ui/dashboard/project/ProjectList';
import Link from 'next/link';
import CreateProjectForm from '@/app/ui/dashboard/project/CreateProjectForm';
import Arrart from '@/app/ui/dashboard/common/Arrart';


export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const data = await getProject();
  const sp = await searchParams;
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
          <CreateProjectForm />

        </div>
        {/* <div>
          <Link href="/dashboard/project/create" className="text-blue-600 hover:underline">
            新規作成
          </Link>
        </div> */}
      </div>
      <div className="mt-20">
        <ProjectList data={data} />
      </div>

    </main>
  );
}