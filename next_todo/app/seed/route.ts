import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { checkList,users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}


async function seedCheckList() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS checklist (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL
    );
  `;

  const insertedCheckList = await Promise.all(
    checkList.map(
      (checkListitem) => sql`
        INSERT INTO checklist (id, title, status)
        VALUES (${checkListitem.id}, ${checkListitem.title}, ${checkListitem.status})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCheckList;
}



export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      seedUsers(),
      seedCheckList(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
