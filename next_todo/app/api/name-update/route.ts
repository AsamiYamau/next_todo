import { updateUserName } from "@/app/lib/actions";

export async function POST(req: Request) {

  try {
    const { userId, name } = await req.json();

    if (!userId || !name) {
      return new Response("Bad Request", { status: 400 });
    }

    // ここでデータベースのユーザー名を更新する処理を実装
    await updateUserName(userId, name);

    return new Response("Name updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating name:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}