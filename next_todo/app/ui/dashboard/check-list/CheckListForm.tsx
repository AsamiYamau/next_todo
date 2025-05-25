'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCheckList, createCheckListCategory} from '@/app/lib/actions';

export default function CheckListForm({ projectId }: { projectId: string }) {
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategories((prev) =>
      e.target.checked
        ? [...prev, value]
        : prev.filter((cat) => cat !== value)
    );
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCheckList(title, projectId, categories);
    setTitle('');
    setCategories([]);
    router.refresh(); // 一覧を更新！
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCheckListCategory(title, projectId);
    setTitle(''); // 入力フィールドをクリア
    router.refresh(); // 一覧を更新！
  }

  return (
    <div className="">
      <div className="p-4 rounded mb-4 grid grid-cols-2 gap-8">
        {/* チェックリスト新規追加 */}
        <div className="border border-2 border-gray-300 p-4 rounded">
          <div className="font-bold text-blue-500">⚫︎新規リスト追加 （リスト個々にカテゴリーを紐付け）</div>
          <form onSubmit={handleSubmit} className='mt-4'>
            <table className='w-full'>
              <tbody>
                <tr>
                  <th className='text-left'>項目名</th>
                  <th className='text-left pl-4'>カテゴリー</th>
                </tr>
                <tr className='mt-4'>
                  <td className=''>
                    <input
                      type="text"
                      placeholder="新しい項目"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="border border-gray-300 p-2 rounded mb-2 w-full"
                    />
                  </td>
                  <td className='pl-4'>
                    <div className="flex gap-2 mb-2">
                      <label>
                        <input
                          type="checkbox"
                          name="category"
                          value="wp"
                          checked={categories.includes('wp')}
                          onChange={handleCategoryChange}
                        />
                        wp
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="category"
                          value="ios"
                          checked={categories.includes('ios')}
                          onChange={handleCategoryChange}
                        />
                        ios
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="category"
                          value="android"
                          checked={categories.includes('android')}
                          onChange={handleCategoryChange}
                        />
                        android
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <button type="submit" className="bg-blue-400 p-2 px-4 rounded">追加</button>
            </div>
          </form>
        </div>
        {/* カテゴリー追加 */}
        <div className="border border-2 border-gray-300 p-4 rounded">
          <div className="font-bold text-blue-500">⚫︎新規カテゴリー追加 （projectにカテゴリーを紐付け）</div>
          <form onSubmit={handleCategorySubmit} className='mt-4'>
            <table className='w-full'>
              <tbody>
                <tr>
                  <th className='text-left'>カテゴリー名</th>
                </tr>
                <tr className='mt-4'>
                  <td className=''>
                    <input
                      type="text"
                      placeholder="新しいカテゴリー"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="border border-gray-300 p-2 rounded mb-2 w-full"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <button type="submit" className="bg-blue-400 p-2 px-4 rounded">追加</button>
            </div>
          </form>
        </div>
      </div>
      {/* カテゴリー一覧・編集・削除 */}
      <div className="">
        <div className="">
          <div className="">カテゴリーで絞り込む （projectに紐づいたカテゴリー一覧）</div>
          <div className="flex gap-2">
            <span className="bg-green-200 px-2 py-1 rounded">wp</span>
            <span className="bg-green-200 px-2 py-1 rounded">ios</span>
            <span className="bg-green-200 px-2 py-1 rounded">android</span>
          </div>
        </div>
        <div className="text-right">
          カテゴリー編集・削除
        </div>
      </div>
    </div>
  );
}
