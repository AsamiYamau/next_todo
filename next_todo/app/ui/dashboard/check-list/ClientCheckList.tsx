'use client';

import { useCheckList, CheckListItem } from '@/app/lib/useCheckList';
import CheckList from './CheckList';

export default function ClientCheckList({ data }: { data: CheckListItem[] }) {
  const { checkList, handleStatusChange } = useCheckList(data);

  // return <CheckList checkList={checkList} onStatusChange={handleStatusChange} />;
}
