import InviteMember from "@/app/ui/dashboard/member/InviteMember";
import CreateMember from "@/app/ui/dashboard/member/CreateMember";
//チームがあるかどうか判定
import { getTeamByTeamId } from "@/app/lib/data";
// sessionの取得
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth"; // 認証設定の場所によって調整

//チームメンバー取得
import { getTeamMembers } from "@/app/lib/data";
import { redirect } from "next/navigation";

import MemberEdit from "@/app/ui/dashboard/member/MemberEdit";



export default async function InviteTestPage() {
  //ログインユーザー
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const teamId = (session?.user as any)?.team_id; // チームIDを取得
  const userRole = (session?.user as any)?.role; // ユーザーのロールを取得

  //権限が1でない場合は、メンバー管理画面にアクセスできない
  if (userRole !== 1) {
    //ダッシュボードへリダイレクト
    redirect("/dashboard");
  }

  //権限名の

  // チームがあるかどうか判定
  let teamFlg = false;
  const team = await getTeamByTeamId(teamId);
  if (teamId) {
    teamFlg = true;
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
    <main className='p-6 md:p-12'>
      <h1 className="mb-4 text-xl md:text-2xl font-bold">メンバー管理</h1>
      {/* 初回　チーム作成 */}
      {teamCreateSection}
      {teamFlg && (
        <div className="">
          <h2>
            チーム名：<span>{teamName}</span>
          </h2>
          <InviteMember teamName={teamName} teamId={teamId} />

          <h3 className="mt-4">チームメンバー</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <li
                key={member.id}
                className="p-2  border-2 border-sky-900 rounded"
              >
                <div className="">
                  <span className="">{member.name}</span>：
                  {member.role === 1 && (
                    <span className="text-sm text-red-600">管理者</span>
                  )}
                  {member.role === 2 && (
                    <span className="text-sm text-sky-900">編集者</span>
                  )}
                </div>
                {/* //権限を編集 */}
                <MemberEdit member={member} userId={userId} teamId={teamId} />

              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
