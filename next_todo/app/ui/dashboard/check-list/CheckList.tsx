// app/ui/CheckList.tsx
'use client';

import { spawn } from "child_process";

export type CheckListItem = {
  id: string;
  title: string;
  status: boolean;
  categories?: { id: string; title: string }[];
};

type Props = {
  checkList: CheckListItem[];
  onStatusChange: (id: string, currentStatus: boolean) => void;
  // onEdit: (id: string) => void;
  // onDelete: (id: string) => void;
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
            <h2 className="font-bold">
              {item.title}
              {item.categories && item.categories.length > 0 && (
                
                  item.categories.map((category) => (
                    <span
                      key={category.id}
                      className="ml-2 bg-green-200 px-2 py-1 rounded"
                    >
                      {category.title}
                    </span>
                  ))
                
              )}
            </h2>
            <span>追加者：山内 2025/05/20</span>
            <span>確認者：山内 2025/05/21</span>
          </div>
          <div>
            <input
              type="checkbox"
              checked={item.status === true}
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
