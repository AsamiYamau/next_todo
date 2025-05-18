import { lusitana } from '@/app/ui/fonts';
import { getCheckList } from '@/app/lib/data';

export default async function Page() {
  const data = await getCheckList();
  console.log(data);
  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          提出前チェックリスト 一覧
        </h1>
        <div className="">
          <a href="">新規作成</a>
        </div>
      </div>
      <div className="w-50">
        <ul className='flex items-center justify-between p-4 mt-4'>
          <li>すべて</li>
          <li>全体</li>
          <li>SP実機</li>
        </ul>
      </div>
      <div className="w-full">
        <ul>
          {data.map((item) => (

            <li className='flex items-center justify-between bg-blue-100 p-4 mt-4' key={item.id}>
              <h2 className='font-bold'>{item.title}</h2>
              <div className="">
                <input type="checkbox" name='aaa' checked={item.status === 'OK'} readOnly />
                <label htmlFor="checkbox">{item.status}</label>
                <ul className="edit-list flex ">
                  <li>編集</li>
                  <li>削除</li>
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}