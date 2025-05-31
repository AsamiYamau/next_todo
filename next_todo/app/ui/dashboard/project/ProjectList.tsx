'use client';

import Link from 'next/link';
import { deleteProject } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';

export type Project = {
  id: string;
  title: string;
  client: string;
};



export default function ProjectList({ data }: { data: Project[] }) {
    const router = useRouter();
    const handleDelete = async (id: string) => {
    if (confirm('本当に削除しますか？')) {
      await deleteProject(id);
      router.refresh(); // 一覧を更新
    }
  };

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((project) => (
        <li
          className="flex items-center justify-between bg-blue-100 p-4 mt-4"
          key={project.id}
        >
          <div className="">
            <h2 className="font-bold">
              <Link href={`/dashboard/project/${project.id}`} className="text-blue-600 hover:underline">
                {project.title}
              </Link>
            </h2>
            <span>クライアント：{project.client}</span>
          </div>
          <div>
            <ul className="edit-list flex">
              <Link
                href={`/dashboard/project/${project.id}/edit`}
                className="text-blue-500 hover:underline"
              >
                編集
              </Link>
              <li>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-red-500 hover:underline ml-4"
                >
                  削除
                </button>
              </li>
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}