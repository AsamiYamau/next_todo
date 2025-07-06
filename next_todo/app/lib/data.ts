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
    SELECT id, title, client FROM project ORDER BY created_at ASC; 
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
      users.name AS created_user_name,
      checked_user.name AS checked_user_name,
      checklist.created_at,
      checklist.checked_at,
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
    LEFT JOIN users
      ON checklist.created_user = users.id
    LEFT JOIN users AS checked_user
      ON checklist.checked_user = checked_user.id
    LEFT JOIN checklist_checklistcat 
      ON checklist_checklistcat.checklist_id = checklist.id
    LEFT JOIN checklist_cat 
      ON checklist_cat.id = checklist_checklistcat.checklist_cat_id
    WHERE checklist.project_id = ${projectId}
    GROUP BY checklist.id, checklist.title, checklist.status, users.name, checked_user.name, checklist.created_at, checklist.checked_at
    ORDER BY checklist.created_at ASC
  `;

    // ← ここでサーバー側で文字列化して返す（日本時間にするなら要調整）
const formattedData = data.map(item => ({
  ...item,
  created_at: new Date(item.created_at).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }),
  checked_at: item.checked_at
    ? new Date(item.checked_at).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null,
}));

  return formattedData;
}

//プロジェクト詳細で使用する,チェックしたユーザー名をidから取得
export async function getCheckedUserNameById(userId: string): Promise<string | null> {
  const data = await sql<{ name: string }[]>`
    SELECT name FROM users WHERE id = ${userId}
  `;
  return data.length > 0 ? data[0].name : null;
}

//プロジェクト詳細で使用する、titleとclientを取得
export async function getProjectById(projectId: string): Promise<Project | null> {
  const data = await sql<Project[]>`
    SELECT id, title, client FROM project WHERE id = ${projectId}
  `;
  return data.length > 0 ? data[0] : null;
}

//プロジェクト詳細で使用する、projectと紐づいたカテゴリーを中間テーブルproject_checklistcatから取得

export async function getCategoriesByProjectId(projectId: string): Promise<{ id: string; title: string }[]> {
  const data = await sql<{ id: string; title: string }[]>`
    SELECT checklist_cat.id, checklist_cat.title
    FROM checklist_cat
    JOIN project_checklistcat ON project_checklistcat.checklist_cat_id = checklist_cat.id
    WHERE project_checklistcat.project_id = ${projectId}
  `;
  return data;
}

// checklist編集で使用する、checklistのtitleとカテゴリーを取得
export async function getCheckListById(checklistId: string): Promise<CheckListItemWithCategories | null> {
  const data = await sql<CheckListItemWithCategories[]>`
    SELECT
      checklist.id,
      checklist.title,
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
    WHERE checklist.id = ${checklistId}
    GROUP BY checklist.id, checklist.title
  `;

  return data.length > 0 ? data[0] : null;
}

//親のproject_idを取得
export async function getProjectIdByCheckListId(checklistId: string): Promise<string | null> {
  const data = await sql<{ project_id: string }[]>`
    SELECT project_id FROM checklist WHERE id = ${checklistId}
  `;
  return data.length > 0 ? data[0].project_id : null;
}
//一つのカテゴリーのtitleを取得
export async function getCategoryById(categoryId: string): Promise<{ id: string; title: string } | null> {
  const data = await sql<{ id: string; title: string }[]>`
    SELECT id, title FROM checklist_cat WHERE id = ${categoryId}
  `;
  return data.length > 0 ? data[0] : null;
}

//カテゴリーで絞り込み用　idを受け取って、カテゴリーに紐づくチェックリストを取得
export async function choiceCategory(categoryId: string): Promise<{ id: string; title: string; status: boolean }[]> {
  try {
    const data = await sql<{ id: string; title: string; status: boolean }[]>`
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
    JOIN checklist_checklistcat ON checklist_checklistcat.checklist_id = checklist.id
    LEFT JOIN checklist_cat ON checklist_cat.id = checklist_checklistcat.checklist_cat_id
    WHERE checklist_checklistcat.checklist_cat_id = ${categoryId}
    GROUP BY checklist.id, checklist.title, checklist.status
  `;
    return data;
  } catch (error) {
    console.error('Error fetching checklists by category ID:', error);
    throw new Error('Failed to fetch checklists by category ID');
  }
}

//デフォルトチェックリストを取得
export async function getDefaultCheckList(): Promise<CheckListItemWithCategories[]> {
  const data = await sql<CheckListItemWithCategories[]>`
    SELECT
      default_checklist.id,
      default_checklist.title,
      default_checklist.status,
      COALESCE(
        json_agg(
          json_build_object(
            'id', default_checklist_cat.id,
            'title', default_checklist_cat.title
          )
        ) FILTER (WHERE default_checklist_cat.id IS NOT NULL),
        '[]'
      ) AS categories
    FROM default_checklist
    LEFT JOIN default_checklist_default_checklistcat 
      ON default_checklist_default_checklistcat.default_checklist_id = default_checklist.id
    LEFT JOIN default_checklist_cat 
      ON default_checklist_cat.id = default_checklist_default_checklistcat.default_checklist_cat_id
    GROUP BY default_checklist.id, default_checklist.title, default_checklist.status
  `;

  return data;
}
//デフォルトチェックリストのカテゴリーを取得
export async function getDefaultCheckListCategory(): Promise<{ id: string; title: string }[]> {
  const data = await sql<{ id: string; title: string }[]>`
    SELECT id, title FROM default_checklist_cat
  `;
  return data;
}

//デフォルト　１つのカテゴリーのtitleを取得
export async function getDefaultCategoryById(categoryId: string): Promise<{ id: string; title: string } | null> {
  const data = await sql<{ id: string; title: string }[]>`
    SELECT id, title FROM default_checklist_cat WHERE id = ${categoryId}
  `;
  return data.length > 0 ? data[0] : null;
}

// checklist編集で使用する、checklistのtitleとカテゴリーを取得
export async function getDefaultCheckListById(checklistId: string): Promise<CheckListItemWithCategories | null> {
  const data = await sql<CheckListItemWithCategories[]>`
    SELECT
      default_checklist.id,
      default_checklist.title,
      COALESCE(
        json_agg(
          json_build_object(
            'id', default_checklist_cat.id,
            'title', default_checklist_cat.title
          )
        ) FILTER (WHERE default_checklist_cat.id IS NOT NULL),
        '[]'
      ) AS categories
    FROM default_checklist
    LEFT JOIN default_checklist_default_checklistcat 
      ON default_checklist_default_checklistcat.default_checklist_id = default_checklist.id
    LEFT JOIN default_checklist_cat 
      ON default_checklist_cat.id = default_checklist_default_checklistcat.default_checklist_cat_id
    WHERE default_checklist.id = ${checklistId}
    GROUP BY default_checklist.id, default_checklist.title
  `;

  return data.length > 0 ? data[0] : null;
}

//ユーザーidから名前を取得
export async function getUserNameById(userId: string): Promise<string | null> {
  const data = await sql<{ name: string }[]>`
    SELECT name FROM users WHERE id = ${userId}
  `;
  return data.length > 0 ? data[0].name : null;
}