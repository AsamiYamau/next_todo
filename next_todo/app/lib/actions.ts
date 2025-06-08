'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function updateCheckListStatus(id: string, status: string) {
  try {
    await sql`
      UPDATE checklist
      SET status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    // エラーをログに出力
    console.error('Error updating status:', error);
    throw new Error('Failed to update status');
  }
}

//project新規追加
export async function createProject(title: string, client: string) {
  try {
    await sql`
      INSERT INTO project (title, client)
      VALUES (${title}, ${client})
    `;
  } catch (error) {
    // エラーをログに出力
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
}
//project編集
export async function updateProject(id: string, title: string, client: string) {
  try {
    await sql`
      UPDATE project
      SET title = ${title}, client = ${client}
      WHERE id = ${id}
    `;
  } catch (error) {
    // エラーをログに出力
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
}
//project削除

export async function deleteProject(projectId: string) {
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
      WHERE project_id = ${projectId}
    `;

    // 3. project_checklistcat 削除
    await tx`
      DELETE FROM project_checklistcat
      WHERE project_id = ${projectId}
    `;

    // 4. project 削除
    await tx`
      DELETE FROM project
      WHERE id = ${projectId}
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
export async function createCheckList(title: string, projectId: string, categories: string[]) {
  try {
    // 1. checklistに追加
    const [checklist] = await sql`
      INSERT INTO checklist (title, project_id, status)
      VALUES (${title}, ${projectId}, false)
      RETURNING id
    `;
    const checklistId = checklist.id;

    // 2. カテゴリーごとにIDを取得し、中間テーブルに登録
    for (const categoryName of categories) {
      // 2-1. checklist_catからIDを取得
      const [cat] = await sql`
        SELECT id FROM checklist_cat WHERE title = ${categoryName}
      `;
      if (!cat) continue; // 万が一見つからなければスキップ

      const catId = cat.id;

      // 2-2. 中間テーブルに紐付けを追加
      await sql`
        INSERT INTO checklist_checklistcat (checklist_id, checklist_cat_id)
        VALUES (${checklistId}, ${catId})
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
export async function createCheckListCategory(title: string, projectId: string) {
  try {
    const [createCat] = await sql`
      INSERT INTO checklist_cat (title)
      VALUES (${title})
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
  } catch (error) {
    console.error('Error creating checklist category:', error);
    throw new Error('Failed to create checklist category');
  }
}

// チェックリストの編集
export async function updateCheckList(id: string, title: string, categories: string[], ) {
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
      WHERE id = ${id}
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
export async function deleteCheckList(id: string) {
  try {
    //中間テーブルも削除
    await sql`
      DELETE FROM checklist_checklistcat WHERE checklist_id = ${id}
    `;
    await sql`
      DELETE FROM checklist WHERE id = ${id}
    `;

    
  } catch (error) {
    console.error('Error deleting checklist:', error);
    throw new Error('Failed to delete checklist');
  }
}

//projectの一つのカテゴリー編集
export async function updateCategory(id: string, title: string) {
  try {
    await sql`
      UPDATE checklist_cat
      SET title = ${title}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }

}
// projectのカテゴリー削除
export async function deleteCategory(id: string) {
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
      DELETE FROM checklist_cat WHERE id = ${id}
    `;




  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
}


// デフォルトチェックリストの新規追加　選択したカテゴリー追加と中間テーブル追加
export async function defaultCreateCheckList(title: string, categories: string[]) {
  try {
    // 1. checklistに追加
    const [default_checklist] = await sql`
      INSERT INTO default_checklist (title, status)
      VALUES (${title}, false)
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
export async function defaultCreateCheckListCategory(title: string) {
  try {
    const [default_createCat] = await sql`
      INSERT INTO default_checklist_cat (title)
      VALUES (${title})
      RETURNING id
    `;
    const categoryId = default_createCat.id;


    revalidatePath(`/dashboard/default`);
  } catch (error) {
    console.error('Error creating checklist category:', error);
    throw new Error('Failed to create checklist category');
  }
}

// デフォルトチェックリストの編集
export async function defaultUpdateCheckList(id: string, title: string, categories: string[], ) {
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
      WHERE id = ${id}
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
export async function defaultDeleteCheckList(id: string) {
  try {
    //中間テーブルも削除
    await sql`
      DELETE FROM default_checklist_default_checklistcat WHERE default_checklist_id = ${id}
    `;
    await sql`
      DELETE FROM default_checklist WHERE id = ${id}
    `;

    
  } catch (error) {
    console.error('Error deleting checklist:', error);
    throw new Error('Failed to delete checklist');
  }
}


//デフォルトカテゴリー編集
export async function defaultUpdateCategory(id: string, title: string) {
  try {
    await sql`
      UPDATE default_checklist_cat
      SET title = ${title}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }

}

// デフォルトカテゴリー削除
export async function defaultDeleteCategory(id: string) {
  try {
    // 中間テーブルから削除
    await sql`
      DELETE FROM default_checklist_default_checklistcat WHERE default_checklist_cat_id = ${id}
    `;

    // checklist_catから削除
    await sql`
      DELETE FROM default_checklist_cat WHERE id = ${id}
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