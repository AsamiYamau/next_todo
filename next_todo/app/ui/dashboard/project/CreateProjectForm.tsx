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
        <div className="flex mt-8 justify-between">
          <div className="w-[45%]">
            <div className="font-bold text-blue-500">案件名</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="プロジェクト名"
              required
              className='mb-4 p-2 border border-gray-300 rounded w-full'
            />
          </div>
          <div className="w-[45%]">
            <div className="font-bold text-blue-500">クライアント名</div>
            <select
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className='mb-4 p-2 border border-gray-300 rounded w-full'
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
          <button type="submit" className="bg-blue-400 p-2 px-4 rounded font-bold text-white">追加</button>
        </div>
      </form>
    </div>
  )
}