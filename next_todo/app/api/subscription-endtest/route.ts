

import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

//退会処理。ユーザーに紐づくデータをすべて削除

export async function POST(req: Request) {

  const { userId, teamId } = await req.json();


  try {
    
//退会処理。ユーザーに紐づくデータをすべて削除
  await sql.begin(async (tx) => {
    // teamIdがあれば、チーム全体のデータとユーザーも削除
    if (teamId) {
      // チームに紐づくユーザーID一覧を取得
      const teamUsers = await tx`
        SELECT id FROM users WHERE team_id = ${teamId}
      `;
      const teamUserIds = teamUsers.map((u: any) => u.id);
      // チーム全員分のデータ削除
      for (const uid of teamUserIds) {
        // checklist_checklistcat
        await tx`
          DELETE FROM checklist_checklistcat WHERE checklist_id IN (SELECT id FROM checklist WHERE user_id = ${uid} OR team_id = ${teamId})
        `;
        // checklist
        await tx`
          DELETE FROM checklist WHERE user_id = ${uid} OR team_id = ${teamId}
        `;
        // project_checklistcat
        await tx`
          DELETE FROM project_checklistcat WHERE project_id IN (SELECT id FROM project WHERE user_id = ${uid} OR team_id = ${teamId})
        `;
        // project
        await tx`
          DELETE FROM project WHERE user_id = ${uid} OR team_id = ${teamId}
        `;
        // client_project
        await tx`
          DELETE FROM client_project WHERE client_id IN (SELECT id FROM client WHERE user_id = ${uid} OR team_id = ${teamId})
        `;
        // client
        await tx`
          DELETE FROM client WHERE user_id = ${uid} OR team_id = ${teamId}
        `;
        // invites
        await tx`
          DELETE FROM invites WHERE team_id = ${teamId}
        `;
        // password_resets
        await tx`
          DELETE FROM password_resets WHERE user_id = ${uid}
        `;
        // checklistcat の未使用削除
        await tx`
          DELETE FROM checklist_cat WHERE id IN (
            SELECT id FROM checklist_cat
            WHERE NOT EXISTS (
              SELECT 1 FROM checklist_checklistcat WHERE checklist_cat_id = checklist_cat.id
            )
            AND NOT EXISTS (
              SELECT 1 FROM project_checklistcat WHERE checklist_cat_id = checklist_cat.id
            )
            AND (user_id = ${uid} OR team_id = ${teamId})
          )
        `;
        // users
        await tx`
          DELETE FROM users WHERE id = ${uid}
        `;
      }
    } else {
      // checklist_checklistcat の削除（checklist_id を user_id 経由で特定）
      await tx`
        DELETE FROM checklist_checklistcat
        WHERE checklist_id IN (
          SELECT id FROM checklist WHERE user_id = ${userId} OR team_id = ${teamId}
        )
      `;
      // checklist 削除
      await tx`
        DELETE FROM checklist
        WHERE user_id = ${userId} OR team_id = ${teamId}
      `;
      // project_checklistcat 削除
      await tx`
        DELETE FROM project_checklistcat
        WHERE project_id IN (
          SELECT id FROM project WHERE user_id = ${userId} OR team_id = ${teamId}
        )
      `;
      // project 削除
      await tx`
        DELETE FROM project
        WHERE user_id = ${userId} OR team_id = ${teamId}
      `;
      // client_project 削除
      await tx`
        DELETE FROM client_project
        WHERE client_id IN (
          SELECT id FROM client WHERE user_id = ${userId} OR team_id = ${teamId}
        )
      `;
      // client 削除
      await tx`
        DELETE FROM client
        WHERE user_id = ${userId} OR team_id = ${teamId}
      `;
      // invites 削除
      await tx`
        DELETE FROM invites
        WHERE team_id = ${teamId}
      `;
      // password_resets 削除
      await tx`
        DELETE FROM password_resets
        WHERE user_id = ${userId}
      `;
      // users 削除
      await tx`
        DELETE FROM users
        WHERE id = ${userId}
      `;
      // checklistcat の未使用削除
      await tx`
        DELETE FROM checklist_cat
        WHERE id IN (
          SELECT id FROM checklist_cat
          WHERE NOT EXISTS (
            SELECT 1 FROM checklist_checklistcat WHERE checklist_cat_id = checklist_cat.id
          )
          AND NOT EXISTS (
            SELECT 1 FROM project_checklistcat WHERE checklist_cat_id = checklist_cat.id
          )
          AND (user_id = ${userId} OR team_id = ${teamId})
        )
      `;
    }
  });

    return Response.json({ message: "退会手続き完了" }, { status: 200 });
  } catch (err: any) {
    console.error("退会エラー:", err);
    return Response.json({ message: err.message || "Internal Server Error" }, { status: 500 });
  }
}