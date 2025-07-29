'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { defaultUpdateCategory } from '@/app/lib/actions';

type category = { id: string; title: string };

export default function CategoryEditForm(
  {category,userId,defaultId}:
   { 
    category: { id: string; title: string }; 
    userId: string;
    defaultId: string; // デフォルトIDを受け取る
  }) {
  const [title, setTitle] = useState(category.title);
  const router = useRouter();


  useEffect(() => {
    setTitle(category.title);
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await defaultUpdateCategory(category.id, title,userId);
      alert('カテゴリーを更新しました');
      router.push(`/dashboard/default/${defaultId}`); // 更新後に一覧ページへリダイレクト
      router.refresh(); // 一覧を更新！
    } catch (error) {
      alert('更新に失敗しました');
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="categoryTitle" className="block text-sm font-medium text-gray-700">カテゴリー名</label>
          <input
            type="text"
            id="categoryTitle"
            name="categoryTitle"
            className="mb-4 p-2 border border-gray-300 rounded w-full mt-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex justify-center mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          更新
        </button>
        </div>
      </form>
    </div>
  );
}