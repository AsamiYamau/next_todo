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
        <h1 className="mb-4 text-xl md:text-2xl">プロジェクト新規作成</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="プロジェクト名"
          required
        />
        <input
          value={client}
          onChange={(e) => setClient(e.target.value)}
          placeholder="クライアント名"
          required
        />
        <button type="submit">追加</button>
      </form>
    </main>
  );
}