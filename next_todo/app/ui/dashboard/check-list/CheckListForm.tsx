'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createCheckList, createCheckListCategory } from '@/app/lib/actions';
import Category from '@/app/ui/dashboard/project/Category'; // カテゴリーコンポーネントをインポート
import { getCategoriesByProjectId } from '@/app/lib/data'; // カテゴリー取得関数をインポート
import Link from 'next/link';

import Image from 'next/image';
import EditIcon from '@/public/ico/edit.svg';
import DeleteIcon from '@/public/ico/trash.svg';



export default function CheckListForm(
  { projectId, projectCategories, categoryId }:
    {
      projectId: string;
      projectCategories: { id: string; title: string }[];
      categoryId?: string; // オプションでカテゴリーIDを受け取る
    }) {
  const [title, setTitle] = useState('');
  const [catTitle, catSetTitle] = useState('');
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
    await createCheckListCategory(catTitle, projectId);
    catSetTitle(''); // 入力フィールドをクリア
    router.refresh(); // 一覧を更新！
  }

  const handleDelete = async (id: string) => {
    if (confirm('本当に削除しますか？')) {
      try {
        await fetch(`/api/category/${id}/delete`, {
          method: 'DELETE',
        });
        alert('削除しました');
        router.refresh(); // 一覧を更新！
      } catch (error) {
        alert('削除に失敗しました');
      }
    }
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
                  <td className='flex'>
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
                    <div className="">
                      {projectCategories.map((cat) => (
                        <label key={cat.id} className='flex items-center mb-2 justify-between flex-wrap'>
                          <span>
                            <input
                              type="checkbox"
                              name="category"
                              value={cat.id}
                              checked={categories.includes(cat.id)}
                              onChange={handleCategoryChange}
                              className="mr-2"
                            />
                            <span className='font-bold mr-4'>{cat.title}</span>
                          </span>
                          <span>
                            <Link
                              href={`/dashboard/project/${projectId}/category/${cat.id}/edit`}
                              className="hover:opacity-80 mr-2"
                            >
                              <Image src={EditIcon} alt="Edit" width={20} height={20} className="inline-block" />
                            </Link>
                            <button
                              type="button"
                              className="hover:opacity-80 cursor-pointer"
                              onClick={() => handleDelete(cat.id)}
                            >
                              <Image src={DeleteIcon} alt="Delete" width={20} height={20} className="inline-block" />
                            </button>
                          </span>
                        </label>

                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <button type="submit" className="bg-blue-400 p-2 px-4 rounded font-bold text-white">追加</button>
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
                      value={catTitle}
                      onChange={(e) => catSetTitle(e.target.value)}
                      required
                      className="border border-gray-300 p-2 rounded mb-2 w-full"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <button type="submit" className="bg-blue-400 p-2 px-4 rounded font-bold text-white">追加</button>
            </div>
          </form>
        </div>
      </div>
      {/* カテゴリー絞り込み*/}
      <div className="">
        <div className="">
          <Category projectCategories={projectCategories} projectId={projectId} categoryId={categoryId} />
        </div>
      </div>
    </div>
  );
}
