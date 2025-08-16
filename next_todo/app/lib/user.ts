import postgres from 'postgres';
import { User } from './definitions'; // 型定義がなければ定義してください

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function getUserByEmail(email: string): Promise<User | null> {
  const data = await sql<User[]>`
    SELECT * FROM users WHERE email = ${email} LIMIT 1
  `;
  return data[0] ?? null;
}

export async function getAllUsers(): Promise<User[]> {
  const data = await sql<User[]>`
    SELECT id, name, email, role FROM users ORDER BY created_at DESC
  `;
  return data;
}

export async function getUserById(id: string): Promise<User | null> {
  const data = await sql<User[]>`
    SELECT id, name, email, role FROM users WHERE id = ${id}
  `;
  return data[0] ?? null;
}

export async function updateUserRole(id: string, role: number): Promise<void> {
  await sql`
    UPDATE users SET role = ${role} WHERE id = ${id}
  `;
}

export async function createUser(name: string, email: string, hashedPassword: string, role:number, plan: number,team_id:string): Promise<void> {
  await sql`
    INSERT INTO users (name, email, password,role, plan,team_id)
    VALUES (${name}, ${email}, ${hashedPassword},${role}, ${plan}, ${team_id})
  `;
}

//招待トークンがあるかどうか判定
export async function getInviteByToken(token: string) {
  const invites = await sql`
    SELECT * FROM invites WHERE token = ${token}
  `;
  return invites.length > 0 ? invites[0] : null;
}
// 招待を受け入れたらinvitesテーブルのacceptedを更新
export async function markInviteAccepted(token: string) {
  await sql`
    UPDATE invites SET accepted = true WHERE token = ${token}
  `;
}