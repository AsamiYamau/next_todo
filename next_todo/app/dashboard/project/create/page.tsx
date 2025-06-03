'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/app/lib/actions';

export default function CreateProjectPage() {
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
    <main>
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-xl md:text-2xl">案件新規作成</h1>
      </div>
      <div className="w-[70%] mx-auto mt-8">
        <form onSubmit={handleSubmit}>
          <div className="font-bold text-blue-500">⚫︎案件名</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="プロジェクト名"
            required
            className='mb-4 p-2 border border-gray-300 rounded w-full mt-2'
          />
          <div className="font-bold text-blue-500">⚫︎クライアント名</div>
          <input
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="クライアント名"
            required
            className='mb-4 p-2 border border-gray-300 rounded w-full mt-2'
          />
          <div className="flex justify-center">
            <button type="submit" className="bg-blue-400 p-2 px-4 rounded font-bold text-white">追加</button>
          </div>
        </form>
      </div>
    </main>
  );
}