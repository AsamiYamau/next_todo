
import InviteMember from "@/app/ui/dashboard/member/InviteMember";
import CreateMember from "@/app/ui/dashboard/member/CreateMember";
//チームがあるかどうか判定
import { getTeamByUserId } from "@/app/lib/data";
// sessionの取得
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth"; // 認証設定の場所によって調整

//チームメンバー取得
import { getTeamMembers } from "@/app/lib/data";

export default async function InviteTestPage() {
  //ログインユーザー
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  // チームがあるかどうか判定
  let teamFlg = false;
  const team = await getTeamByUserId(userId);
  let teamId = ""; // チームIDを初期化
  if (team) {
    teamFlg = true;
    teamId = team.id; // チームIDを取得
  } else {
    teamFlg = false;
  }

  //チーム名
  const teamName = team ? team.name : "未設定";

  //チームメンバー取得
  const teamMembers = teamFlg ? await getTeamMembers(teamId) : [];

let teamCreateSection = null;
if (!teamFlg) {
  teamCreateSection = (
    <div className="">
      <p>チームを作成してメンバーを招待しましょう。</p>
      <CreateMember />
    </div>
  );
}

  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl font-bold">メンバー管理</h1>
      {/* 初回　チーム作成 */}
     {teamCreateSection}
      {teamFlg && (
        <div className="">
          <h2>
            チーム名：<span>{teamName}</span>
          </h2>
          <InviteMember teamName={teamName} teamId={teamId}/>

          <h3 className="mt-4">チームメンバー</h3>
          <ul className="">
            {teamMembers.map((member) => (
              <li key={member.id} className="mb-2">
                {member.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
