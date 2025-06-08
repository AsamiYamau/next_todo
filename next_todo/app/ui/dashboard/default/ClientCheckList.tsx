'use client';

import { useCheckList } from '@/app/lib/defaultUseCheckList';
import { CheckListItem } from '@/app/lib/definitions';
import CheckList from '@/app/ui/dashboard/default/CheckList';
import CheckListForm from '@/app/ui/dashboard/check-list/CheckListForm';

export default function ClientCheckList({ data }: 
  { data: CheckListItem[]; } ) {
  const { checkList, handleStatusChange } = useCheckList(data);

  return <CheckList checkList={checkList} onStatusChange={handleStatusChange} />;
}
