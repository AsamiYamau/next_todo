'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { defaultUpdateProject } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';

type Project = {
  id: string;
  title: string;
  client: string;
};

export default function ProjectEditForm({ project}: { project: Project; }) {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const router = useRouter();
  const id = project.id; // プロジェクトIDを受け取る
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  // 初期値をセット
  useEffect(() => {
    setTitle(project.title);
    setClient(project.client);
  }, [project]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await defaultUpdateProject(id, title, userId);
      // 登録完了後にリダイレクト
      router.push('/dashboard/default?updated=2');
    } catch (error) {
      alert('追加に失敗しました');
    }
  }
  // ここにプロジェクト編集フォームの実装を追加
  // 例えば、プロジェクトの詳細を取得してフォームに表示するなど
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
      </div>
      <div className="flex justify-center mt-4">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">追加</button>
      </div>
    </form>
  );
}