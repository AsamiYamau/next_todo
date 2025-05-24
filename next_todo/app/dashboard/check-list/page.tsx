
// app/page.tsx
import { lusitana } from '@/app/ui/fonts';
import CheckList, { CheckListItem } from '@/app/ui/dashboard/check-list/CheckList';
import { useCheckList } from '@/app/lib/useCheckList';
import ClientCheckList from '@/app/ui/dashboard/check-list/ClientCheckList';
import { getCheckList } from '@/app/lib/data';


export default async function Page() {
  const data = await getCheckList();

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          提出前チェックリスト
        </h1>
        <div>
          <a href="">新規作成</a>
        </div>
      </div>
      <div className="flex items-center justify-between p-4 mt-4">
        <div className="">
          <div className="">案件名：ああああああ</div>
          <div className="">クライアント：いいいい</div>
        </div>
        <div className="">
          <div className="">チェック進捗</div>
          <div className="">
            <span className='text-xl font-bold'>10</span>/<span>20</span>件中
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between p-4 mt-4">
        <ul className="flex items-center justify-between p-4 mt-4 gap-2">
          <li className='bg-green-300 px-2'>すべて</li>
          <li className='bg-green-300 px-2'>wp</li>
          <li className='bg-green-300 px-2'>ios</li>
        </ul>
        <div>
          <a href="">カテゴリー新規追加</a>
        </div>
      </div>
      {/* ここはクライアントコンポーネント */}
      <ClientCheckList data={data} />
    </main>
  );
}

