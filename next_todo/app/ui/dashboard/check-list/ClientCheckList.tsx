'use client';

import { useCheckList } from '@/app/lib/useCheckList';
import { CheckListItem } from '@/app/lib/definitions';
import CheckList from '@/app/ui/dashboard/check-list/CheckList';
import CheckListForm from '@/app/ui/dashboard/check-list/CheckListForm';

export default function ClientCheckList({ data, projectId }: 
  { data: CheckListItem[]; projectId:string; } ) {
  const { checkList, handleStatusChange } = useCheckList(data);

  return <CheckList checkList={checkList} onStatusChange={handleStatusChange} projectId={projectId} />;
}
