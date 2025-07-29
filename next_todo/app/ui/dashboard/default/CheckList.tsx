// app/ui/CheckList.tsx
'use client';

import { spawn } from "child_process";
import Link from 'next/link';
import { useSession } from "next-auth/react";



export type CheckListItem = {
  id: string;
  title: string;
  status: boolean;
  categories?: { id: string; title: string }[];
    created_user?: string; // 追加者のID
  created_user_name: string; // ← ユーザー名
  checked_user_name?: string | null; // チェックしたユーザー名
  created_at?: string; // 作成日時
  checked_at?: string; // チェック日時
};

type Props = {
  checkList: CheckListItem[];
  onStatusChange: (id: string, currentStatus: boolean) => void;
  defaultId?: string; // デフォルトプロジェクトIDはオプション
};


export default function CheckList({ checkList, onStatusChange,defaultId}: Props) {
  const { data: session } = useSession();
  const LoguinUser = (session?.user as any)?.id; // セッションからユーザーIDを取得
  const LoguinUserName = (session?.user as any)?.name; // セッションからユーザー名を取得
  const userId = (session?.user as any)?.id; // ユーザーIDを取得

  console.log('checkList:', checkList);
  
  // 削除ハンドラ
  const handleDelete = async (id: string,userId:string) => {
    if (confirm('本当に削除しますか？')) {
      await fetch(`/api/default/checklist/${id}/delete`, { method: 'DELETE' });
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
            <span>追加者：{item.created_user_name}</span> {item.created_at}
          </div>
          <div>
            <div className="edit-list flex">
              <Link
                href={`/dashboard/default/${defaultId}/check-list/${item.id}/edit`}
                className="text-blue-500 hover:underline"
              >
                編集
              </Link>
              <button
                type="button"
                className="ml-4 text-red-500 hover:underline"
                onClick={() => handleDelete(item.id, userId)}
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
