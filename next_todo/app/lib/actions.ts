'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from "uuid";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function updateCheckListStatus(id: string, status: boolean, LoginUser: string | null) {
  try {
    await sql`
      UPDATE checklist
      SET status = ${status},checked_user = ${LoginUser},checked_at = ${status ? sql`CURRENT_TIMESTAMP` : null}
      WHERE id = ${id}
    `;
  } catch (error) {
    // エラーをログに出力
    console.error('Error updating status:', error);
    throw new Error('Failed to update status');
  }
}

//project新規追加
export async function createProject(title: string, client: string,userId: string, teamId: string | null) {
  try {
    const [project] = await sql`
      INSERT INTO project (title, client,user_id, team_id)
      VALUES (${title}, ${client}, ${userId}, ${teamId})
      RETURNING id
    `;
    const projectId = project.id;
    //client_project中間テーブルに登録
    await sql`
      INSERT INTO client_project (client_id, project_id)
      VALUES (${client}, ${projectId})
      ON CONFLICT DO NOTHING
    `;
  } catch (error) {
    // エラーをログに出力
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
}
//project編集
export async function updateProject(id: string, title: string, client: string,userId: string, teamId: string | null) {
  try {
    await sql`
      UPDATE project
      SET title = ${title}, client = ${client}
      WHERE id = ${id} AND (user_id = ${userId} OR team_id = ${teamId})
    `;
  } catch (error) {
    // エラーをログに出力
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
}
//project削除

export async function deleteProject(projectId: string, userId: string, team_id: string | null) {
  await sql.begin(async (tx) => {
    // 1. checklist_checklistcat の削除（checklist_id を project_id 経由で特定）
    await tx`
      DELETE FROM checklist_checklistcat
      WHERE checklist_id IN (
        SELECT id FROM checklist WHERE project_id = ${projectId}
      )
    `;

    // 2. checklist 削除
    await tx`
      DELETE FROM checklist
      WHERE project_id = ${projectId} AND (user_id = ${userId} OR team_id = ${team_id})
    `;

    // 3. project_checklistcat 削除
    await tx`
      DELETE FROM project_checklistcat
      WHERE project_id = ${projectId}
    `;

    // 4. project 削除
    await tx`
      DELETE FROM project
      WHERE id = ${projectId} AND (user_id = ${userId} OR team_id = ${team_id})
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
      )
    `;
  });
}



// チェックリストの新規追加　選択したカテゴリー追加と中間テーブル追加
export async function createCheckList(title: string, projectId: string, categories: string[],createdUser: string, userId: string, teamId: string | null) {
  try {
    // 1. checklistに追加
    const [checklist] = await sql`
      INSERT INTO checklist (title, project_id, status,created_user, user_id, team_id)
      VALUES (${title}, ${projectId}, false, ${createdUser}, ${userId}, ${teamId})
      RETURNING id
    `;
    const checklistId = checklist.id;

    // 2. カテゴリーごとにIDを取得し、中間テーブルに登録
    for (const categoryId of categories) {
      // 2-1. checklist_catからIDを取得
      // const [cat] = await sql`
      //   SELECT id FROM checklist_cat WHERE title = ${categoryName}
      // `;
      // if (!cat) continue; // 万が一見つからなければスキップ

      // const catId = cat.id;

      // 2-2. 中間テーブルに紐付けを追加
      await sql`
        INSERT INTO checklist_checklistcat (checklist_id, checklist_cat_id)
        VALUES (${checklistId}, ${categoryId})
        ON CONFLICT DO NOTHING
      `;
    }

    revalidatePath(`/dashboard/project/${projectId}`);
  } catch (error) {
    console.error('Error creating checklist with categories:', error);
    throw new Error('Failed to create checklist with categories');
  }
}

//チェックリストのカテゴリー新規追加（projectに紐付け）
export async function createCheckListCategory(title: string, projectId: string, userId: string, teamId: string | null) {
  try {
    const [createCat] = await sql`
      INSERT INTO checklist_cat (title, user_id, team_id)
      VALUES (${title}, ${userId}, ${teamId})
      RETURNING id
    `;
    const categoryId = createCat.id;

    // 2. プロジェクトとカテゴリーの紐付け
    await sql`
      INSERT INTO project_checklistcat (project_id, checklist_cat_id)
      VALUES (${projectId}, ${categoryId})
      ON CONFLICT DO NOTHING
    `;

    revalidatePath(`/dashboard/project/${projectId}`);

     // これを追加！ → 呼び出し元で使えるようになる
    return { id: categoryId };
  } catch (error) {
    console.error('Error creating checklist category:', error);
    throw new Error('Failed to create checklist category');
  }
}

// チェックリストの編集
export async function updateCheckList(id: string, title: string, categories: string[],userId: string, teamId: string | null) {
  try {
    // 現在のカテゴリーとの紐付けを削除
    await sql`
      DELETE FROM checklist_checklistcat
      WHERE checklist_id = ${id}
    `;
    //  checklistのタイトルを更新
    await sql`
      UPDATE checklist
      SET title = ${title}
      WHERE id = ${id}  AND (user_id = ${userId} OR team_id = ${teamId})
    `;



    // 3. 新しいカテゴリーとの紐付けを追加
    for (const catId of categories) {
      await sql`
        INSERT INTO checklist_checklistcat (checklist_id, checklist_cat_id)
        VALUES (${id}, ${catId})
        ON CONFLICT DO NOTHING
      `;
    }

  } catch (error) {
    console.error('Error updating checklist:', error);
    throw new Error('Failed to update checklist');
  }
}

// checklist削除
export async function deleteCheckList(id: string, userId: string, teamId: string | null) {
  try {
    //中間テーブルも削除
    await sql`
      DELETE FROM checklist_checklistcat WHERE checklist_id = ${id}
    `;
    await sql`
      DELETE FROM checklist WHERE id = ${id} AND (user_id = ${userId} OR team_id = ${teamId})
    `;

    
  } catch (error) {
    console.error('Error deleting checklist:', error);
    throw new Error('Failed to delete checklist');
  }
}

//projectの一つのカテゴリー編集
export async function updateCategory(id: string, title: string,userId: string, teamId: string | null) {
  try {
    await sql`
      UPDATE checklist_cat
      SET title = ${title}
      WHERE id = ${id} AND (user_id = ${userId} OR team_id = ${teamId})
    `;
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }

}
// projectのカテゴリー削除
export async function deleteCategory(id: string, userId: string, teamId: string | null) {
  try {
    // 中間テーブルから削除
    await sql`
      DELETE FROM project_checklistcat WHERE checklist_cat_id = ${id}
    `;

    // checklist_checklistcatからも削除
    await sql`
      DELETE FROM checklist_checklistcat WHERE checklist_cat_id = ${id}
    `;

    // checklist_catから削除
    await sql`
      DELETE FROM checklist_cat WHERE id = ${id} AND (user_id = ${userId} OR team_id = ${teamId})
    `;




  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
}

//デフォルトテンプレートの新規追加
export async function defaultCreateProject(title: string, userId: string, teamId: string | null) {
  try {
    await sql`
      INSERT INTO default_project (title, user_id, team_id)
      VALUES (${title}, ${userId}, ${teamId})
    `;
  } catch (error) {
    // エラーをログに出力
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
}
//テンプレート編集
export async function defaultUpdateProject(id: string, title: string,userId: string, teamId: string | null) {
  try {
    await sql`
      UPDATE default_project
      SET title = ${title}
      WHERE id = ${id} AND (user_id = ${userId} OR team_id = ${teamId})
    `;
  } catch (error) {
    // エラーをログに出力
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
}
//デフォルトテンプレート削除
export async function defaultDeleteProject(projectId: string, userId: string, teamId: string | null) {
  await sql.begin(async (tx) => {
    // 1. checklist_checklistcat の削除（checklist_id を project_id 経由で特定）
    await tx`
      DELETE FROM default_checklist_default_checklistcat
      WHERE default_checklist_id IN (
        SELECT id FROM default_checklist WHERE default_project_id = ${projectId}
      )
    `;

    // 2. checklist 削除
    await tx`
      DELETE FROM default_checklist
      WHERE default_project_id = ${projectId} AND (user_id = ${userId} OR team_id = ${teamId})
    `;

    // 3. project_checklistcat 削除
    await tx`
      DELETE FROM default_project_default_checklistcat
      WHERE default_project_id = ${projectId}
    `;

    // 4. project 削除
    await tx`
      DELETE FROM default_project
      WHERE id = ${projectId} AND (user_id = ${userId} OR team_id = ${teamId})
    `;

    // checklistcat の未使用削除
    await tx`
      DELETE FROM default_checklist_cat
      WHERE id IN (
        SELECT id FROM default_checklist_cat
        WHERE NOT EXISTS (
          SELECT 1 FROM default_checklist_default_checklistcat WHERE default_checklist_cat_id = default_checklist_cat.id
        )
        AND NOT EXISTS (
          SELECT 1 FROM default_project_default_checklistcat WHERE default_checklist_cat_id = default_checklist_cat.id
        )
      )
    `;
  });
}

// デフォルトチェックリストの新規追加　選択したカテゴリー追加と中間テーブル追加
export async function defaultCreateCheckList(title: string, categories: string[],templateId: string, userId: string, teamId: string | null) {
  try {
    // 1. checklistに追加
    const [default_checklist] = await sql`
      INSERT INTO default_checklist (title, status, default_project_id, user_id, team_id)
      VALUES (${title}, false, ${templateId}, ${userId}, ${teamId})
      RETURNING id
    `;
    const default_checklistId = default_checklist.id;

    // 2. カテゴリーごとにIDを取得し、中間テーブルに登録
    for (const categoryName of categories) {
      // 2-1. checklist_catからIDを取得
      const [cat] = await sql`
        SELECT id FROM default_checklist_cat WHERE title = ${categoryName}
      `;
      if (!cat) continue; // 万が一見つからなければスキップ

      const default_catId = cat.id;

      // 2-2. 中間テーブルに紐付けを追加
      await sql`
        INSERT INTO default_checklist_default_checklistcat (default_checklist_id, default_checklist_cat_id)
        VALUES (${default_checklistId}, ${default_catId})
        ON CONFLICT DO NOTHING
      `;
    }

    revalidatePath(`/dashboard/default`);
  } catch (error) {
    console.error('Error creating checklist with categories:', error);
    throw new Error('Failed to create checklist with categories');
  }
}

//デフォルトチェックリストのカテゴリー新規追加
export async function defaultCreateCheckListCategory(title: string,templateId: string,userId: string, teamId: string | null) {
  try {
    const [default_createCat] = await sql`
      INSERT INTO default_checklist_cat (title, user_id, team_id)
      VALUES (${title}, ${userId}, ${teamId})
      RETURNING id
    `;
    const categoryId = default_createCat.id;
    // 2. プロジェクトとカテゴリーの紐付け
    await sql`
      INSERT INTO default_project_default_checklistcat (default_project_id, default_checklist_cat_id)
      VALUES (${templateId}, CAST(${categoryId} AS uuid))
      ON CONFLICT DO NOTHING
    `;


    revalidatePath(`/dashboard/default`);
  } catch (error) {
    console.error('Error creating checklist category:', error);
    throw new Error('Failed to create checklist category');
  }
}

// デフォルトチェックリストの編集
export async function defaultUpdateCheckList(id: string, title: string, categories: string[], userId: string, teamId: string | null) {
  try {
    // 現在のカテゴリーとの紐付けを削除
    await sql`
      DELETE FROM default_checklist_default_checklistcat
      WHERE default_checklist_id = ${id}
    `;
    //  checklistのタイトルを更新
    await sql`
      UPDATE default_checklist
      SET title = ${title}
      WHERE id = ${id} AND (user_id = ${userId} OR team_id = ${teamId})
    `;

    // 3. 新しいカテゴリーとの紐付けを追加
    for (const catId of categories) {
      await sql`
        INSERT INTO default_checklist_default_checklistcat (default_checklist_id, default_checklist_cat_id)
        VALUES (${id}, ${catId})
        ON CONFLICT DO NOTHING
      `;
    }

  } catch (error) {
    console.error('Error updating checklist:', error);
    throw new Error('Failed to update checklist');
  }
}

// デフォルトchecklist削除
export async function defaultDeleteCheckList(id: string, userId: string, teamId: string | null) {
  try {
    //中間テーブルも削除
    await sql`
      DELETE FROM default_checklist_default_checklistcat WHERE default_checklist_id = ${id}
    `;
    await sql`
      DELETE FROM default_checklist WHERE id = ${id} AND (user_id = ${userId} OR team_id = ${teamId})
    `;

    
  } catch (error) {
    console.error('Error deleting checklist:', error);
    throw new Error('Failed to delete checklist');
  }
}


//デフォルトカテゴリー編集
export async function defaultUpdateCategory(id: string, title: string, userId: string, teamId: string | null) {
  try {
    await sql`
      UPDATE default_checklist_cat
      SET title = ${title}
      WHERE id = ${id}  AND (user_id = ${userId} OR team_id = ${teamId})
    `;
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }

}

// デフォルトカテゴリー削除
export async function defaultDeleteCategory(id: string, userId: string, teamId: string | null) {
  try {
    // 中間テーブルから削除
    await sql`
      DELETE FROM default_checklist_default_checklistcat WHERE default_checklist_cat_id = ${id}
    `;
    await sql`
      DELETE FROM default_project_default_checklistcat WHERE default_checklist_cat_id = ${id}
    `;

    // checklist_catから削除
    await sql`
      DELETE FROM default_checklist_cat WHERE id = ${id} AND (user_id = ${userId} OR team_id = ${teamId})
    `;




  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
}

// デフォルトチェックリストのステータス
export async function defaultUpdateCheckListStatus(id: string, status: string) {
  try {
    await sql`
      UPDATE default_checklist
      SET status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    // エラーをログに出力
    console.error('Error updating status:', error);
    throw new Error('Failed to update status');
  }
}


//クライアント新規追加
export async function createClient(name: string, memo:string, userId: string, teamId: string | null) {
  try {
    await sql`
      INSERT INTO client (name, memo, user_id, team_id)
      VALUES (${name}, ${memo}, ${userId}, ${teamId})
    `;
  } catch (error) {
    // エラーをログに出力
    console.error('Error creating client:', error);
    throw new Error('Failed to create client');
  }
}
//クライアント削除
export async function deleteClient(clientId: string) {
  try {
    await sql`
      DELETE FROM client WHERE id = ${clientId}
    `;
  } catch (error) {
    console.error('Error deleting client:', error);
    throw new Error('Failed to delete client');
  }
}

//チーム作成
export async function createTeam(name: string, userId: string) {
  try {
    const [team] = await sql`
      INSERT INTO teams (name, user_id)
      VALUES (${name}, ${userId})
      RETURNING id
    `;
    const teamId = team.id; 

    //userテーブルのteam_idカラムにteamIdを設定
    await sql`
      UPDATE users
      SET team_id = ${teamId}
      WHERE id = ${userId}
    `;
  } catch (error) {
    console.error('Error creating team:', error);
    throw new Error('Failed to create team');
  }
}
//チームメンバー招待
export async function createInvite(email: string, teamId: string) {
  const inviteToken = uuidv4();

  await sql`
    INSERT INTO invites (email, token, team_id, expires_at)
    VALUES (${email}, ${inviteToken}, ${teamId}, NOW() + INTERVAL '7 days')
  `;

  return inviteToken;
}

// ユーザーの権限変更
export async function updateUserRole(userId: string, roleValue: number) {
  try {
    await sql`
      UPDATE users
      SET role = ${roleValue}
      WHERE id = ${userId}
    `;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw new Error('Failed to update user role');
  }
}

