'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCheckList } from '@/app/lib/actions';
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

export default function CheckListEditForm({ checkListData,Category,ProjectId }: { checkListData: checkListData; Category: Category[]; ProjectId: ProjectID }) {
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
      await updateCheckList(checkListData.id, title, categories.map(cat => cat.id), userId, teamId); // チェックリストを更新
      router.push(`/dashboard/project/${ProjectId}?updated=3`); // ← ここで遷移
    } catch (error) {
      alert('更新に失敗しました');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex mt-8 justify-between">
        <div className="w-[45%]">
          <div className="font-bold text-blue-500">項目名</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className='mb-4 p-2 border border-gray-300 rounded w-full'
          />
        </div>
        <div className="w-[45%]">
          <div className="font-bold text-blue-500">カテゴリー</div>
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">更新</button>
      </div>
    </form>
  );


}