'use client';

import Link from 'next/link';
import { deleteProject } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import EditIcon from '@/public/ico/edit.svg'; 
import DeleteIcon from '@/public/ico/trash.svg';

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
          className="flex items-center justify-between bg-sky-100 p-4 mt-4 border-2 border-blue-200 rounded"
          key={project.id}
        >
          <div className="">
            <h2 className="font-bold">
              <Link href={`/dashboard/project/${project.id}`} className="text-blue-600 underline hover:opacity-80">
                {project.title}
              </Link>
            </h2>
            <span className='text-sm'>クライアント：{project.client}</span>
          </div>
          <div>
            <ul className="edit-list flex">
              <li className='mr-2'>
                <Link
                  href={`/dashboard/project/${project.id}/edit`}
                  className="hover:opacity-80"
                >
                  <Image src={EditIcon} alt="Edit" width={20} height={20} className="inline-block" />
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="hover:opacity-80 cursor-pointer"
                >
                  <Image src={DeleteIcon} alt="Delete" width={20} height={20} className="inline-block" />

                </button>
              </li>
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}