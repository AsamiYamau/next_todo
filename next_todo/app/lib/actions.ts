'use server';

import postgres from 'postgres';

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