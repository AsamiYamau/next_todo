'use client';

import Link from 'next/link';
import { deleteClient } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import EditIcon from '@/public/ico/edit.svg';
import DeleteIcon from '@/public/ico/trash.svg';

export type Client = {
  id: string;
  name: string;
};



export default function ClientList({ data }: { data: Client[] }) {
  const router = useRouter();
  const handleDelete = async (id: string) => {
    if (confirm('本当に削除しますか？')) {
      await deleteClient(id);
      router.refresh(); // 一覧を更新
    }
  };

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((client) => (
        <li
          className="flex items-start justify-between bg-sky-100 p-4 mt-4 border-2 border-blue-200 rounded"
          key={client.id}
        >
          <div className="w-3/4">
            <h2 className="font-bold">
              <Link 
                href={`/dashboard/client/${client.id}`}
                className="text-blue-600 hover:underline">
              {client.name}
              </Link>
            </h2>
          </div>
          <div className='w-1/4 mt-auto'>
            <ul className="edit-list flex justify-end">
              <li className='mr-2'>
                <Link
                  href={`/dashboard/client/${client.id}/edit`}
                  className="hover:opacity-80"
                >
                  <Image src={EditIcon} alt="Edit" width={20} height={20} className="inline-block" />
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleDelete(client.id)}
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