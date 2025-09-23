'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';

export default function CreateProjectForm({ clients }: { clients: { id: string; name: string }[] }) {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; // チームIDを取得

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createProject(title, client, userId, teamId);
      // 登録完了後にリダイレクト
      router.push('/dashboard/project?updated=1');
    } catch (error) {
      alert('追加に失敗しました');
    }
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="flex mt-8 gap-4 flex-col md:flex-row">
          <div className="flex-1">
            <div className="font-bold text-sky-900">案件名</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="プロジェクト名"
              required
              className='p-2 border border-gray-300 rounded w-full'
            />
          </div>
          <div className="flex-1">
            <div className="font-bold text-sky-900">クライアント名</div>
            <select
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className='p-2 border border-gray-300 rounded w-full h-[42px]'
            >
              <option value="">クライアントを選択</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button type="submit" className="bg-sky-900 p-2 px-4 rounded font-bold text-white">追加</button>
        </div>
      </form>
    </div>
  )
}