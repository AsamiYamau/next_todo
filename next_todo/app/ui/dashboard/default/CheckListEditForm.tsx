'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { defaultUpdateCheckList } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';



type checkListData = {
  id: string;
  title: string;
  categories: { id: string; title: string }[];
};

type Category = {
  id: string;
  title: string;
};

type ProjectID = string;

export default function CheckListEditForm({ checkListData,Category,defaultId }: { checkListData: checkListData; Category: Category[]; defaultId: string }) {
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState<{ id: string; title: string }[]>([]);
  const router = useRouter();
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; // チームIDを取得



  // 初期値をセット
  useEffect(() => {
    setTitle(checkListData.title);
    setCategories(checkListData.categories);
  }, [checkListData]);

  console.log('categories',categories);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await defaultUpdateCheckList(checkListData.id, title, categories.map(cat => cat.id), userId, teamId); // チェックリストを更新
      alert('チェックリストを更新しました');
      router.push(`/dashboard/default/${defaultId}`); // ← ここで遷移
    } catch (error) {
      alert('更新に失敗しました');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex mt-8 justify-between">
        <div className="w-[45%]">
          <div className="font-bold text-sky-900">項目名</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className='mb-4 p-2 border border-gray-300 rounded w-full'
          />
        </div>
        <div className="w-[45%]">
          <div className="font-bold text-sky-900">カテゴリー</div>
          <div className="flex flex-col">
            {Category.map((category) => (
              <label key={category.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={category.id}
                  checked={categories.some(cat => cat.id === category.id)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCategories((prev) =>
                      e.target.checked
                        ? [...prev, { id: value, title: category.title }]
                        : prev.filter((cat) => cat.id !== value)
                    );
                  }}
                  className="mr-2"
                />
                {category.title}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <button type="submit" className="bg-sky-900 text-white px-4 py-2 rounded hover:bg-sky-900 transition">追加</button>
      </div>
    </form>
  );


}