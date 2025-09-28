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

//ユーザー情報の取得
export async function getUserById(userId: string): Promise<User | null> {
  const data = await sql<User[]>`
    SELECT id, name, email, password, role, team_id, plan, created_at, stripe_customer_id FROM users WHERE id = ${userId} 
  `;
  return data.length > 0 ? data[0] : null;
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

//stripe 
export async function updateUserPlanByStripeCustomerId(stripeCustomerId: string, priceId: string | null) {
  const planMap: Record<string, number> = {
    "price_1SANk7Ch2J0J1cSXtDN9tN0v": 1,
    "price_1SANqICh2J0J1cSXuQe8FziZ": 1,
    "price_1SANl4Ch2J0J1cSX8KRCgCbE": 2,
    "price_1SANrgCh2J0J1cSXQc8VFVkk": 2,
    "price_1SANlmCh2J0J1cSXKbcxSvGm": 3,
    "price_1SANsxCh2J0J1cSXLNQ78Val": 3,
  };



  const plan = priceId ? planMap[priceId] : null;

  await sql`UPDATE users SET plan = ${plan} WHERE stripe_customer_id = ${stripeCustomerId}`;
}
