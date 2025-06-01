

export default async function Page({ params }: { params: { id: string } }) {


  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">カテゴリー編集</h1>
      {/* <CategoryEditForm category={category} /> */}
    </div>
  );
}
