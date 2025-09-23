'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProject } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';

type Project = {
  id: string;
  title: string;
  client: string;
};

export default function ProjectEditForm({ project, clients }: { project: Project; clients: any[] }) {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const router = useRouter();
  const id = project.id; // プロジェクトIDを受け取る
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; // チームIDを取得
  // 初期値をセット
  useEffect(() => {
    setTitle(project.title);
    setClient(project.client);
  }, [project]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateProject(id, title, client, userId, teamId);
      // 登録完了後にリダイレクト
      router.push('/dashboard/project?updated=2');
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
          <div className="font-bold text-sky-900">案件名</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="プロジェクト名"
            required
            className='mb-4 p-2 border border-gray-300 rounded w-full'
          />
        </div>
        <div className="w-[45%]">
          <div className="font-bold text-sky-900">クライアント名</div>
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
        <button type="submit" className="bg-sky-900 text-white px-4 py-2 rounded hover:bg-sky-900 transition">追加</button>
      </div>
    </form>
  );
}