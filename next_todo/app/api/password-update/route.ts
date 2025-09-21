import { updateUserPassword } from "@/app/lib/actions";
import { getUserById } from "@/app/lib/data";
import bcrypt from 'bcryptjs';


export async function POST(req: Request) {
  try {
    const { userId, currentPassword, newPassword } = await req.json();

    if (!userId || !currentPassword || !newPassword) {
      return Response.json({ message: "Bad Request" }, { status: 400 });
    }

    // ユーザー情報を取得し、現在のパスワードハッシュを取得
    const user = await getUserById(userId);
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // パスワードが一致するか検証
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return Response.json({ message: "現在のパスワードが正しくありません" }, { status: 401 });
    }


    // ここでデータベースのパスワードを更新する処理を実装
    const hashed = await bcrypt.hash(newPassword, 10);

    await updateUserPassword(userId, hashed);
    

    return Response.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating password:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}