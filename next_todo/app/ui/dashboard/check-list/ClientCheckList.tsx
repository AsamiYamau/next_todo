'use client';

import { useCheckList } from '@/app/lib/useCheckList';
import { CheckListItem } from '@/app/lib/definitions';
import CheckList from '@/app/ui/dashboard/check-list/CheckList';

export default function ClientCheckList({ data }: { data: CheckListItem[] }) {
  const { checkList, handleStatusChange } = useCheckList(data);

  return <CheckList checkList={checkList} onStatusChange={handleStatusChange} />;
}
