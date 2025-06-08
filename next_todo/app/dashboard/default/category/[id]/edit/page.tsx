import { getDefaultCategoryById } from '@/app/lib/data';
import CategoryEditForm from '@/app/ui/dashboard/default/CategoryEditForm';

export default async function Page({ params }: { params: { id: string } }) {
  const categoryId = params.id;
  console.log('カテゴリーID:', categoryId);
  const category = await getDefaultCategoryById(categoryId);
  console.log('カテゴリー情報:', category);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">カテゴリー編集</h1>
      <div className="border border-2 border-gray-300 p-4 rounded w-[60%] mx-auto">
        <CategoryEditForm category={category!}  />
      </div>
    </div>
  );
}
