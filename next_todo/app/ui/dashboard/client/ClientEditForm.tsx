'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateClient } from '@/app/lib/actions';
//sessionの取得
import { useSession } from 'next-auth/react';


export default function ClientEditForm(
  { client }: 
  { client: { id: string; name: string; memo: string } }) {

  const [clientName, setClient] = useState('');
  const [memo, setMemo] = useState('');

  const { data: session } = useSession();
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; //

  const router = useRouter();

  useEffect(() => {
    setClient(client.name);
    setMemo(client.memo);
  }, [client]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // ここでクライアント情報の更新処理を実装
      await updateClient(client.id, clientName, memo, userId, teamId);
      // 更新完了後にリダイレクト
      router.push('/dashboard/client?updated=2');
      
    } catch (error) {
      alert('更新に失敗しました');
    }
  }

     return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="flex mt-8 justify-between">
          <div className="w-[45%]">
            <div className="font-bold text-blue-500">クライアント名</div>
            <input
              value={clientName}
              onChange={(e) => setClient(e.target.value)}
              placeholder="クライアント名"
              required
              className='mb-4 p-2 border border-gray-300 rounded w-full'
            />
          </div>
          <div className="w-[45%]">
            <div className="font-bold text-blue-500">メモ</div>
            <textarea
              value={memo ?? ''}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="メモ"
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