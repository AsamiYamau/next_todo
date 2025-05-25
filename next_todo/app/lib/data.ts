// lib/data.ts
import postgres from 'postgres';
import { CheckListItem,Project,CheckListItemWithCategories } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function getCheckList(): Promise<CheckListItem[]> {
  const data = await sql<CheckListItem[]>`
    SELECT id, title, status FROM checklist
  `;
  return data;
}

export async function getProject(): Promise<Project[]> {
  const data = await sql<Project[]>`
    SELECT id, title, client FROM project
  `;
  return data;
}

//プロジェクト詳細で使用する、projectのidと紐づいたchecklistを取得
export async function getCheckListByProjectId(projectId: string): Promise<CheckListItemWithCategories[]> {
  const data = await sql<CheckListItemWithCategories[]>`
    SELECT
      checklist.id,
      checklist.title,
      checklist.status,
      COALESCE(
        json_agg(
          json_build_object(
            'id', checklist_cat.id,
            'title', checklist_cat.title
          )
        ) FILTER (WHERE checklist_cat.id IS NOT NULL),
        '[]'
      ) AS categories
    FROM checklist
    LEFT JOIN checklist_checklistcat 
      ON checklist_checklistcat.checklist_id = checklist.id
    LEFT JOIN checklist_cat 
      ON checklist_cat.id = checklist_checklistcat.checklist_cat_id
    WHERE checklist.project_id = ${projectId}
    GROUP BY checklist.id, checklist.title, checklist.status
  `;

  return data;
}

//プロジェクト詳細で使用する、titleとclientを取得
export async function getProjectById(projectId: string): Promise<Project | null> {
  const data = await sql<Project[]>`
    SELECT id, title, client FROM project WHERE id = ${projectId}
  `;
  return data.length > 0 ? data[0] : null;
}
