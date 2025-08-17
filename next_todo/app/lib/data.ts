// lib/data.ts


import postgres from 'postgres';
import { CheckListItem,Project,CheckListItemWithCategories,Client, DefaultCheckListItemWithCategories } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function getCheckList(): Promise<CheckListItem[]> {
  const data = await sql<CheckListItem[]>`
    SELECT id, title, status FROM checklist
  `;
  return data;
}

export async function getProject(userId: string,teamId:string): Promise<Project[]> {
  const data = await sql<Project[]>`
        SELECT
      project.id,
      project.title,
      client.id AS client_id,
      client.name AS client_name
    FROM project
    JOIN client_project ON project.id = client_project.project_id
    JOIN client ON client_project.client_id = client.id
    WHERE project.user_id = ${userId} OR project.team_id = ${teamId}
    ORDER BY project.created_at ASC;
  `;
  return data;
}

//プロジェクト詳細で使用する、projectのidと紐づいたchecklistを取得
export async function getCheckListByProjectId(projectId: string, userId: string,teamId:string): Promise<CheckListItemWithCategories[]> {
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
    WHERE checklist.project_id = ${projectId} AND (checklist.user_id = ${userId} OR checklist.team_id = ${teamId})
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
export async function getCheckedUserNameById(userId: string, teamId:string): Promise<string | null> {
  const data = await sql<{ name: string }[]>`
    SELECT name FROM users WHERE id = ${userId} OR team_id = ${teamId}
  `;
  return data.length > 0 ? data[0].name : null;
}

//プロジェクト詳細で使用する、titleとclientを取得
export async function getProjectById(projectId: string, userId: string, teamId:string): Promise<Project | null> {
  const data = await sql<Project[]>`
    SELECT 
    project.id, 
    project.title, 
    client.id AS client_id,
    client.name AS client_name
    FROM project
    JOIN client_project ON project.id = client_project.project_id
    JOIN client ON client_project.client_id = client.id
    WHERE project.id = ${projectId} AND (project.user_id = ${userId} OR client.user_id = ${userId} OR project.team_id = ${teamId})
  `;
  return data.length > 0 ? data[0] : null;
}

//プロジェクト詳細で使用する、projectと紐づいたカテゴリーを中間テーブルproject_checklistcatから取得

export async function getCategoriesByProjectId(projectId: string, userId: string,teamId:string): Promise<{ id: string; title: string }[]> {
  const data = await sql<{ id: string; title: string }[]>`
    SELECT checklist_cat.id, checklist_cat.title
    FROM checklist_cat
    JOIN project_checklistcat ON project_checklistcat.checklist_cat_id = checklist_cat.id
    JOIN project ON project.id = project_checklistcat.project_id
    WHERE project_checklistcat.project_id = ${projectId}
      AND (project.user_id = ${userId} OR project.team_id = ${teamId})
  `;
  return data;
}

// checklist編集で使用する、checklistのtitleとカテゴリーを取得
export async function getCheckListById(checklistId: string, userId: string,teamId:string): Promise<CheckListItemWithCategories | null> {
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
    WHERE checklist.id = ${checklistId} AND (checklist.user_id = ${userId} OR checklist.team_id = ${teamId})
    GROUP BY checklist.id, checklist.title
  `;

  return data.length > 0 ? data[0] : null;
}

//親のproject_idを取得
export async function getProjectIdByCheckListId(checklistId: string, userId: string,teamId:string): Promise<string | null> {
  const data = await sql<{ project_id: string }[]>`
    SELECT project_id FROM checklist WHERE id = ${checklistId} AND (user_id = ${userId} OR team_id = ${teamId})
  `;
  return data.length > 0 ? data[0].project_id : null;
}
//一つのカテゴリーのtitleを取得
export async function getCategoryById(categoryId: string,userId: string, teamId:string): Promise<{ id: string; title: string} | null> {
  const data = await sql<{ id: string; title: string }[]>`
    SELECT id, title FROM checklist_cat WHERE id = ${categoryId} AND (user_id = ${userId} OR team_id = ${teamId})
  `;
  return data.length > 0 ? data[0] : null;
}

//カテゴリーで絞り込み用　idを受け取って、カテゴリーに紐づくチェックリストを取得
export async function choiceCategory(categoryId: string): Promise<CheckListItemWithCategories[]> {
  try {
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
    JOIN checklist_checklistcat ON checklist_checklistcat.checklist_id = checklist.id
    LEFT JOIN checklist_cat ON checklist_cat.id = checklist_checklistcat.checklist_cat_id
    WHERE checklist_checklistcat.checklist_cat_id = ${categoryId}
    GROUP BY checklist.id, checklist.title, checklist.status, users.name, checked_user.name, checklist.created_at, checklist.checked_at
    ORDER BY checklist.created_at ASC
  `;
        // ← ここでサーバー側で文字列化して返す（日本時間にするなら要調整）
const formattedData2 = data.map(item => ({
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

  return formattedData2;
  } catch (error) {
    console.error('Error fetching checklists by category ID:', error);
    throw new Error('Failed to fetch checklists by category ID');
  }
}
//デフォルト用　カテゴリーで絞り込み用　idを受け取って、カテゴリーに紐づくチェックリストを取得
export async function choiceDefaultCategory(categoryId: string): Promise<CheckListItemWithCategories[]> {
  try {
    const data = await sql<CheckListItemWithCategories[]>`
    SELECT
      default_checklist.id,
      default_checklist.title,
      default_checklist.status,
      users.name AS created_user_name,
      default_checklist.created_at,
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
    LEFT JOIN users
      ON default_checklist.created_user = users.id
    JOIN default_checklist_default_checklistcat ON default_checklist_default_checklistcat.default_checklist_id = default_checklist.id
    LEFT JOIN default_checklist_cat ON default_checklist_cat.id = default_checklist_default_checklistcat.default_checklist_cat_id
    WHERE default_checklist_default_checklistcat.default_checklist_cat_id = ${categoryId}
    GROUP BY default_checklist.id, default_checklist.title, default_checklist.status, users.name, default_checklist.created_at
    ORDER BY default_checklist.created_at ASC
  `;
        // ← ここでサーバー側で文字列化して返す（日本時間にするなら要調整）
const formattedData2 = data.map(item => ({
  ...item,
  created_at: new Date(item.created_at).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }),
}));

  return formattedData2;
  } catch (error) {
    console.error('Error fetching checklists by category ID:', error);
    throw new Error('Failed to fetch checklists by category ID');
  }
}

//デフォルトテンプレート取得
export async function getDefaultTemplate(userId: string,teamId:string): Promise<Project[]> {
  const data = await sql<Project[]>`
        SELECT
      default_project.id,
      default_project.title
    FROM default_project
    WHERE default_project.user_id = ${userId} OR default_project.team_id = ${teamId}
    ORDER BY default_project.created_at ASC;
  `;
  return data;
}
//デフォルト詳細で使用する、titleを取得
export async function getDefaultById(defaultId: string, userId: string,teamId:string): Promise<Project | null> {
  const data = await sql<Project[]>`
    SELECT 
    default_project.id, 
    default_project.title
    FROM default_project
    WHERE default_project.id = ${defaultId} AND (default_project.user_id = ${userId} OR default_project.team_id = ${teamId})
  `;
  return data.length > 0 ? data[0] : null;
}
//デフォルトチェックリストを取得
export async function getDefaultCheckList(templateId:string,userId:string,teamId:string): Promise<DefaultCheckListItemWithCategories[]> {
  const data = await sql<DefaultCheckListItemWithCategories[]>`
    SELECT
      default_checklist.id,
      default_checklist.title,
      users.name AS created_user_name,
      default_checklist.created_at,
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
    LEFT JOIN users
      ON default_checklist.user_id = users.id
    LEFT JOIN default_checklist_default_checklistcat 
      ON default_checklist_default_checklistcat.default_checklist_id = default_checklist.id
    LEFT JOIN default_checklist_cat 
      ON default_checklist_cat.id = default_checklist_default_checklistcat.default_checklist_cat_id
    WHERE default_checklist.default_project_id = ${templateId} AND (default_checklist.user_id = ${userId} OR default_checklist.team_id = ${teamId})
    GROUP BY default_checklist.id, default_checklist.title, users.name, default_checklist.created_at
    ORDER BY default_checklist.created_at ASC
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
}));

  return formattedData;
}
//デフォルトチェックリストのカテゴリーを取得
export async function getDefaultCheckListCategory(templateId:string,userId:string,teamId:string): Promise<{ id: string; title: string }[]> {
  const data = await sql<{ id: string; title: string }[]>`
    SELECT 
    default_checklist_cat.id, 
    default_checklist_cat.title 
    FROM default_checklist_cat
    JOIN default_project_default_checklistcat 
      ON default_project_default_checklistcat.default_checklist_cat_id = default_checklist_cat.id
    JOIN default_project 
      ON default_project_id = default_project_default_checklistcat.default_project_id
    WHERE default_project_default_checklistcat.default_project_id = ${templateId} AND (default_project.user_id = ${userId} OR default_project.team_id = ${teamId})
    ORDER BY default_checklist_cat.created_at ASC
  `;
  return data;
}


//デフォルト　１つのカテゴリーのtitleを取得
export async function getDefaultCategoryById(categoryId: string,userId:string,teamId:string): Promise<{ id: string; title: string } | null> {
  const data = await sql<{ id: string; title: string }[]>`
    SELECT id, title FROM default_checklist_cat WHERE id = ${categoryId} AND (user_id = ${userId} OR team_id = ${teamId})
  `;
  return data.length > 0 ? data[0] : null;
}

// checklist編集で使用する、checklistのtitleとカテゴリーを取得
export async function getDefaultCheckListById(checklistId: string,userId:string,teamId:string): Promise<CheckListItemWithCategories | null> {
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
    WHERE default_checklist.id = ${checklistId} AND (default_checklist.user_id = ${userId} OR default_checklist.team_id = ${teamId})
    GROUP BY default_checklist.id, default_checklist.title
  `;

  return data.length > 0 ? data[0] : null;
}
//親のdefaultidを取得
export async function getDefaultIdByCheckListId(checklistId: string, userId: string,teamId:string): Promise<string | null> {
  const data = await sql<{ default_project_id: string }[]>`
    SELECT default_project_id FROM default_checklist WHERE id = ${checklistId} AND (user_id = ${userId} OR team_id = ${teamId})
  `;
  return data.length > 0 ? data[0].default_project_id : null;
}

//ユーザーidから名前を取得
export async function getUserNameById(userId: string): Promise<string | null> {
  const data = await sql<{ name: string }[]>`
    SELECT name FROM users WHERE id = ${userId}
  `;
  return data.length > 0 ? data[0].name : null;
}

//クライアント情報の取得
export async function getClient(userId: string,teamId:string): Promise<Client[]> {
  const data = await sql<Client[]>`
    SELECT id, name FROM client 
    WHERE user_id = ${userId} OR team_id = ${teamId}
    ORDER BY created_at ASC; 
  `;
  return data;
}
//クライアントidから、紐づくプロジェクトを取得
export async function getProjectByClientId(clientId: string, userId: string,teamId:string): Promise<Project[]> {

    const data = await sql<Project[]>`
        SELECT
      project.id,
      project.title,
      client.id AS client_id,
      client.name AS client_name
    FROM project
    JOIN client_project ON project.id = client_project.project_id
    JOIN client ON client_project.client_id = client.id
    WHERE client_project.client_id = ${clientId} AND (project.user_id = ${userId} OR project.team_id = ${teamId})
    ORDER BY project.created_at ASC;
  `;
  return data;
}

//チーム情報の取得
export async function getTeamByTeamId(teamId: string): Promise<{ id: string; name: string } | null> {
  const data = await sql<{ id: string; name: string }[]>`
    SELECT id, name FROM teams WHERE id = ${teamId} 
  `;
  return data.length > 0 ? data[0] : null;
}
//チームメンバー取得
export async function getTeamMembers(teamId: string): Promise<{ id: string; name: string; role:number }[]> {
  const data = await sql<{ id: string; name: string; role:number }[]>`
    SELECT users.id, users.name, users.role
    FROM users
  WHERE users.team_id = ${teamId}
  `;
  return data;
}
