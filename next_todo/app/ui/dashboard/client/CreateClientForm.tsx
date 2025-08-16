'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/lib/actions';
//sessionの取得
import { useSession } from 'next-auth/react';

export default function createClientForm() {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; // チームIDを取得

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createClient(client, userId,teamId); // ユーザーIDを渡す
      // 登録完了後にリダイレクト
      router.push('/dashboard/client?updated=1');
    } catch (error) {
      alert('追加に失敗しました');
    }
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="flex mt-8 justify-between">
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
    </div>
  )
}