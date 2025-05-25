import { lusitana } from '@/app/ui/fonts';
import ClientCheckList from '@/app/ui/dashboard/check-list/ClientCheckList';
import CheckListForm from '@/app/ui/dashboard/check-list/CheckListForm';
import { getCheckListByProjectId,getProjectById} from '@/app/lib/data';

export default async function ProjectDetailPage(props: { params: { id: string } }) {
  const  id  = props.params.id;
  const data = await getCheckListByProjectId(id);

  const project = await getProjectById(id);


  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          提出前チェックリスト
        </h1>
      </div>

      <div className="flex items-center justify-between p-4 mt-4">
        <div>
          <div>案件名：{project?.title ?? 'タイトル未設定'}</div>
          <div>クライアント:{project?.client ?? 'クライアント未設定'}</div>
        </div>
        <div>
          <div>チェック進捗</div>
          <div>
            <span className="text-xl font-bold">10</span>/<span>20</span>件中
          </div>
        </div>
      </div>


      {/* 新規追加フォーム（クライアント側で動く） */}
      <CheckListForm projectId={id} />

      {/* チェックリストの表示（クライアントコンポーネント） */}
      <ClientCheckList data={data} />
    </main>
  );
}
