// app/ui/CheckList.tsx
'use client';

import { spawn } from "child_process";
import Link from 'next/link';


export type CheckListItem = {
  id: string;
  title: string;
  status: boolean;
  categories?: { id: string; title: string }[];
};

type Props = {
  checkList: CheckListItem[];
  onStatusChange: (id: string, currentStatus: boolean) => void;
  projectId?: string; // プロジェクトIDはオプション
};


export default function CheckList({ checkList, onStatusChange,projectId }: Props) {
  // 削除ハンドラ
  const handleDelete = async (id: string) => {
    if (confirm('本当に削除しますか？')) {
      await fetch(`/api/checklist/${id}/delete`, { method: 'DELETE' });
      window.location.reload();
    }
  };

  return (
    <ul>
      {checkList.map((item) => (
        <li
          className="flex items-center justify-between bg-sky-100 p-4 mt-4 border-2 border-blue-200 rounded"
          key={item.id}
        >
          <div className="">
            <h2 className="font-bold">
              {item.title}
              {item.categories && item.categories.length > 0 && (

                item.categories.map((category) => (
                  <span
                    key={category.id}
                    className="ml-2 bg-green-200 px-2 py-1 rounded"
                  >
                    {category.title}
                  </span>
                ))

              )}
            </h2>
            <span>追加者：山内 2025/05/20</span>
            <span>確認者：山内 2025/05/21</span>
          </div>
          <div>
            <input
              type="checkbox"
              checked={item.status === true}
              onChange={() => onStatusChange(item.id, item.status)}
            />
            <label>{item.status}</label>
            <div className="edit-list flex">
              <Link
                href={`/dashboard/project/${projectId}/check-list/${item.id}/edit`}
                className="text-blue-500 hover:underline"
              >
                編集
              </Link>
              <button
                type="button"
                className="ml-4 text-red-500 hover:underline"
                onClick={() => handleDelete(item.id)}
              >
                削除
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
