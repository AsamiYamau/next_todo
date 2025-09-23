
'use client';
import { useState } from 'react';
import { getCategoriesByProjectId } from '@/app/lib/data'; // カテゴリー取得関数をインポート

type Client = {
  id: string;
  name: string;
};

export default  function Category({ clients,clientId }: { clients: Client[]; clientId?: string }) {

  const handleClick = async (clientId: string) => {
  console.log('clients', clientId);
  // カテゴリーIDが'all'の場合は全てのチェックリストに遷移
  if (clientId === 'all') {
    window.location.href = `/dashboard/project/`;
    return;
  }
  
   window.location.href = `/dashboard/project/client/${clientId}`;
};

  return (
    <div className="">
      <div className="font-bold text-sky-900">クライアントで絞り込む</div>
      <ul className="mt-4 flex gap-4 flex-wrap">
        <li
          className={`mb-2 p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer ${clientId === undefined  ? 'bg-orange-700 font-bold text-white' : ''}`} // 選択中のカテゴリーは色を変える
          onClick={() => handleClick('all')} // クリックで全てのチェックリストに遷移する処理を追加
        >すべて</li>
        {clients.map((client) => (
          <li key={client.id} 
          className={`mb-2 p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer ${client.id === clientId ? 'bg-orange-700 font-bold text-white' : ''}`} // 選択中のカテゴリーは色を変える
          onClick={() => handleClick(client.id)} // クリックでカテゴリーページに遷移する処理を追加
          >
            {client.name}
          </li>
        ))}
      </ul>
    </div>
  );
}