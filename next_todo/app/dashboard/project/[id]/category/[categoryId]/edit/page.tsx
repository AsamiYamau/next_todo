import { getCategoryById } from '@/app/lib/data';
import CategoryEditForm from '@/app/ui/dashboard/project/CategoryEditForm';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; categoryId: string }>;
}) {
  const { id: projectId, categoryId } = await params;
  const category = await getCategoryById(categoryId);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">カテゴリー編集</h1>
      <div className="border border-2 border-gray-300 p-4 rounded w-[60%] mx-auto">
        <CategoryEditForm category={category!} projectId={projectId!} />
      </div>
    </div>
  );
}