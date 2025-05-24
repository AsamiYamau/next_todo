// app/ui/CheckList.tsx
'use client';

export type CheckListItem = {
  id: string;
  title: string;
  status: string;
};

type Props = {
  checkList: CheckListItem[];
  onStatusChange: (id: string, currentStatus: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function CheckList({ checkList, onStatusChange }: Props) {
  return (
    <ul>
      {checkList.map((item) => (
        <li
          className="flex items-center justify-between bg-blue-100 p-4 mt-4"
          key={item.id}
        >
          <div className="">
          <h2 className="font-bold">{item.title}</h2>
          <span>追加者：山内 2025/05/20</span>
          <span>確認者：山内 2025/05/21</span>
          </div>
          <div>
            <input
              type="checkbox"
              checked={item.status === 'OK'}
              onChange={() => onStatusChange(item.id, item.status)}
            />
            <label>{item.status}</label>
            <ul className="edit-list flex">
              {/* <li onClick={() => onEdit(item.id)} className="cursor-pointer text-blue-600">編集</li>
              <li onClick={() => onDelete(item.id)} className="cursor-pointer text-red-600">削除</li> */}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}
