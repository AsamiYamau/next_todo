
'use client';
import { useState } from 'react';
import { getCategoriesByProjectId } from '@/app/lib/data'; // カテゴリー取得関数をインポート

type Category = {
  id: string;
  title: string;
};

export default  function Category({ projectCategories,projectId,categoryId }: { projectCategories: Category[]; projectId: string; categoryId?: string }) {

  const categories = projectCategories || [];

const handleClick = async (categoryId: string) => {
  // カテゴリーIDが'all'の場合は全てのチェックリストに遷移
  if (categoryId === 'all') {
    window.location.href = `/dashboard/project/${projectId}`;
    return;
  }
  
   window.location.href = `/dashboard/project/${projectId}/category/${categoryId}`;
};

  return (
    <div className="">
      <div className="font-bold text-blue-500">カテゴリーで絞り込む （projectに紐づいたカテゴリー一覧）</div>
      <ul className="mt-4 flex gap-4 flex-wrap">
        <li
          className={`mb-2 p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer ${categoryId === undefined  ? 'bg-orange-400 font-bold text-white' : ''}`} // 選択中のカテゴリーは色を変える
          onClick={() => handleClick('all')} // クリックで全てのチェックリストに遷移する処理を追加
        >すべて</li>
        {categories.map((category) => (
          <li key={category.id} 
          className={`mb-2 p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer ${category.id === categoryId ? 'bg-orange-400 font-bold text-white' : ''}`} // 選択中のカテゴリーは色を変える
          onClick={() => handleClick(category.id)} // クリックでカテゴリーページに遷移する処理を追加
          >
            {category.title}
          </li>
        ))}
      </ul>
    </div>
  );
}