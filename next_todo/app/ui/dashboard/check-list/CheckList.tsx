// app/ui/CheckList.tsx
'use client';

import { spawn } from "child_process";
import Link from 'next/link';
import Image from 'next/image';
import EditIcon from '@/public/ico/edit.svg';
import DeleteIcon from '@/public/ico/trash.svg';

import { useSession } from 'next-auth/react';





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
  user_id?: string; // ユーザーID
  team_id?: string; // チームID
};

type Props = {
  checkList: CheckListItem[];
  onStatusChange: (id: string, currentStatus: boolean,LoguinUser:string,LoguinUserName:string) => void;
  projectId?: string; // プロジェクトIDはオプション
};


export default function CheckList({ checkList, onStatusChange, projectId }: Props) {


  // 削除ハンドラ
  const handleDelete = async (id: string, userId: string, teamId:string) => {
    if (confirm('本当に削除しますか？')) {
      await fetch(`/api/checklist/${id}/delete`, { method: 'DELETE' });
      window.location.reload();
    }
  };
  // 完了数
  const doneCount = checkList.filter(item => item.status).length;
  // 全件数
  const totalCount = checkList.length;



  const { data: session } = useSession();
  const LoguinUser = (session?.user as any)?.id; // セッションからユーザーIDを取得
  const LoguinUserName = (session?.user as any)?.name; // セッションからユーザー名を取得
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; // チームIDを取得




  return (
    <div className="">
      <div className="text-right">
        <div>チェック進捗</div>
        <div>
          <span className="text-xl font-bold text-orange-500 px-2">{doneCount}</span>/
          <span className="px-2 font-bold">{totalCount}</span>件中
        </div>
      </div>
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
                      className="ml-2 bg-orange-400 text-white px-2 py-1 rounded"
                    >
                      {category.title}
                    </span>
                  ))

                )}
              </h2>
              <span className="text-sm mr-10">追加者：
                <span className="font-bold">{item.created_user_name}</span> {item.created_at}
              </span>
              <span className="text-sm">確認者：
                <span className="font-bold">{item.checked_user_name}</span> {item.checked_at}
              </span>
            </div>
            <div>
              <input
                type="checkbox"
                checked={item.status === true}
                onChange={() => onStatusChange(item.id, item.status,LoguinUser, LoguinUserName)}
              />
              <label>{item.status}</label>
              <div className="edit-list flex">
                <Link
                  href={`/dashboard/project/${projectId}/check-list/${item.id}/edit`}
                  className="text-blue-500 hover:underline"
                >
                  <Image src={EditIcon} alt="Edit" width={20} height={20} className="inline-block" />
                </Link>
                <button
                  type="button"
                  className="ml-4 text-red-500 hover:underline"
                  onClick={() => handleDelete(item.id, userId, teamId)}
                >
                  <Image src={DeleteIcon} alt="Delete" width={20} height={20} className="inline-block" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
