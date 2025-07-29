'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { defaultCreateProject } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';

export default function defaultCreateProjectForm({  }: {  }) {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id; // ユーザーIDを取得

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await defaultCreateProject(title, userId);
      // 登録完了後にリダイレクト
      router.push('/dashboard/default?updated=1');
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
        </div>
        <div className="flex justify-center mt-4">
          <button type="submit" className="bg-blue-400 p-2 px-4 rounded font-bold text-white">追加</button>
        </div>
      </form>
    </div>
  )
}