import { lusitana } from '@/app/ui/fonts';

export default async function Page() {

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        提出前チェックリスト 新規追加
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        aaaa
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        bbbb
      </div>

      <div className="">
        <form action="">
          <table>
            <tbody>
              <tr>
                <th>項目名</th>
                <td>
                  <input
                    type="text"
                    name="name"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="チェックリストタイトル"
                  />
                </td>
              </tr>
              <tr>
                <th>カテゴリー</th>
                <td>
                  <select
                    name="category"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    <option value="全体">全体</option>
                    <option value="SP実機">SP実機</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          {/* 追加するボタン */}
          <div className="mt-4 flex items-center justify-between">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              追加
            </button>
            <button
              type="button"
              className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}