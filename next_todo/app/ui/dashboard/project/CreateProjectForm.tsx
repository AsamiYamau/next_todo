'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/app/lib/actions';

export default function CreateProjectForm() {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createProject(title, client);
      // 登録完了後にリダイレクト
      router.push('/dashboard/project');
      alert('プロジェクトを追加しました');
    } catch (error) {
      alert('追加に失敗しました');
    }
  }

  return (
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
          <input
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="クライアント名"
            required
            className='mb-4 p-2 border border-gray-300 rounded w-full'
          />
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <button type="submit" className="bg-blue-400 p-2 px-4 rounded font-bold text-white">追加</button>
      </div>
    </form>
  )
}