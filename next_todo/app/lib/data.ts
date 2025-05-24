// lib/data.ts
import postgres from 'postgres';
import { CheckListItem,Project } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function getCheckList(): Promise<CheckListItem[]> {
  const data = await sql<CheckListItem[]>`
    SELECT id, title, status FROM checklist
  `;
  return data;
}

export async function getProject(): Promise<Project[]> {
  const data = await sql<Project[]>`
    SELECT id, title, client client FROM project
  `;
  return data;
}

//プロジェクト詳細で使用する、projectのidと紐づいたchecklistを取得
export async function getCheckListByProjectId(projectId: string): Promise<CheckListItem[]> {
  const data = await sql<CheckListItem[]>`
    SELECT id, title, status FROM checklist WHERE project_id = ${projectId}
  `;
  return data;
}