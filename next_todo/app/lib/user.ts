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

export async function updateUserRole(id: string, role: string): Promise<void> {
  await sql`
    UPDATE users SET role = ${role} WHERE id = ${id}
  `;
}

export async function createUser(name: string, email: string, hashedPassword: string, plan: string): Promise<void> {
  await sql`
    INSERT INTO users (name, email, password, plan)
    VALUES (${name}, ${email}, ${hashedPassword}, ${plan})
  `;
}
