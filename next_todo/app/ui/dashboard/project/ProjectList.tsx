'use client';

import Link from 'next/link';

export type Project = {
  id: string;
  title: string;
  client: string;
};



export default function ProjectList({ data }: { data: Project[] }) {
  console.log('ProjectList', data);
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
              {/* Placeholder for edit/delete actions */}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}