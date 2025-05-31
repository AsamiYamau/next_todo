
'use client';

import { getCategoriesByProjectId } from '@/app/lib/data'; // カテゴリー取得関数をインポート

type Category = {
  id: string;
  title: string;
};

export default  function Category({ projectCategories, }: { projectCategories: Category[];}) {

  const categories = projectCategories || [];

  return (
    <div className="">
      <div className="font-bold text-blue-500">カテゴリーで絞り込む （projectに紐づいたカテゴリー一覧）</div>
      <ul className="mt-4 flex gap-4 flex-wrap">
        {categories.map((category) => (
          <li key={category.id} className="mb-2 p-2 bg-gray-100 rounded hover:bg-gray-200">
            {category.title}
          </li>
        ))}
      </ul>
    </div>
  );
}