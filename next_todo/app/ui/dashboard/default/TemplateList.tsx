'use client';

import Link from 'next/link';
import { defaultDeleteProject } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import EditIcon from '@/public/ico/edit.svg'; 
import DeleteIcon from '@/public/ico/trash.svg';

import { useSession } from 'next-auth/react';

export type Template = {
  id: string;
  title: string;
  client: string;
  client_id?: string; // クライアントIDをオプションとして追加
  client_name?: string; // クライアント名をオプションとして追加
};



export default function TemplateList({ data }: { data: Template[] }) {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; // チームIDを取得
  const router = useRouter();
  const handleDelete = async (id: string, userId: string) => {
    if (confirm('本当に削除しますか？')) {
      await defaultDeleteProject(id, userId, teamId); // プロジェクトを削除
      router.refresh(); // 一覧を更新
    }
  };

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((template) => (
        <li
          className="flex items-start justify-between bg-sky-100 p-4 mt-4 border-2 border-sky-900 rounded"
          key={template.id}
        >
          <div className="w-3/4">
            <h2 className="font-bold">
              <Link href={`/dashboard/default/${template.id}`} className="text-sky-900 underline hover:opacity-80">
                {template.title}
              </Link>
            </h2>
          </div>
          <div className='w-1/4 mt-auto'>
            <ul className="edit-list flex justify-end">
              <li className='mr-2'>
                <Link
                  href={`/dashboard/default/${template.id}/edit`}
                  className="hover:opacity-80"
                >
                  <Image src={EditIcon} alt="Edit" width={20} height={20} className="inline-block" />
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleDelete(template.id, userId)}
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