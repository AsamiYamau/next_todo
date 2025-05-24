import { lusitana } from '@/app/ui/fonts';
import { getProject } from '@/app/lib/data';
import ProjectList from '@/app/ui/dashboard/project/ProjectList';
import Link from 'next/link';

export default async function Page() {
   const data = await getProject();
  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-xl md:text-2xl">プロジェクト</h1>
        <div>
          <Link href="/dashboard/project/create" className="text-blue-600 hover:underline">
            新規作成
          </Link>
        </div>
      </div>
      <ProjectList data={data} />
    </main>
  );
}