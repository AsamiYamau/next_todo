export const dynamicParams = true;

import { lusitana } from "@/app/ui/fonts";
import ClientCheckList from "@/app/ui/dashboard/default/ClientCheckList";
import CheckListForm from "@/app/ui/dashboard/default/CheckListForm";
import {
  getDefaultCheckList,
  getDefaultCheckListCategory,
  getDefaultById
} from "@/app/lib/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

import Category from "@/app/ui/dashboard/default/Category"; // カテゴリーコンポーネントをインポート

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ defaultId: string }>;
}) {
  const { defaultId } = await params;
  //idのタイトルを取得
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const project = await getDefaultById(defaultId,userId); // デフォルトチェックリストのプロジェクト情報を取得
  const data = await getDefaultCheckList(defaultId, userId); // デフォルトチェックリストを取得
  const categories = await getDefaultCheckListCategory(defaultId, userId); // デフォルトチェックリストのカテゴリーを取得
  console.log("ProjectDetailPage data:", data);

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1
          className={`${lusitana.className} mb-4 text-xl md:text-2xl font-bold`}
        >
          デフォルトチェックリスト設定
        </h1>
      </div>
      <div className="flex items-center justify-between p-4 mt-4">
        <div>
          <div className="font-bold text-xl">
            テンプレート名：{project?.title ?? "タイトル未設定"}
          </div>
        </div>
      </div>

      {/* 新規追加フォーム（クライアント側で動く） */}
      <CheckListForm
        defaultCategories={categories}
        defaultId={defaultId}
        userId={userId}
      />

      {/* カテゴリー選択 */}
      <div className="">
        <div className="">
          <Category defaultId={defaultId} defaultCategories={categories} />
        </div>
      </div>

      {/* チェックリストの表示（クライアントコンポーネント） */}
      <ClientCheckList data={data} defaultId={defaultId} />
    </main>
  );
}
