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

