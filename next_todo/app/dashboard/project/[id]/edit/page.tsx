
import ProjectEditForm from '@/app/ui/dashboard/project/ProjectEditForm';
import { getProjectById } from '@/app/lib/data';

export default async function Page({ params }: { params: { id: string } }) {
    const project = await getProjectById(params.id);


  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-xl md:text-2xl">案件編集</h1>
      </div>
      {/* ここにプロジェクト編集フォームを追加 */}
      <div className="border border-2 border-gray-300 p-4 rounded w-[60%] mx-auto mt-8">
        <ProjectEditForm project={project!} />
      </div>

    </main>
  );
}