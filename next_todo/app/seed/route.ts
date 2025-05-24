import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { checkList,users,project,checkListCat,CheckListMiddle } from '../lib/placeholder-data';

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


async function seedProject() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS project (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      client VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `;

  const insertedProject = await Promise.all(
    project.map(
      (projectitem) => sql`
        INSERT INTO project (id, title, client)
        VALUES (${projectitem.id}, ${projectitem.title}, ${projectitem.client})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedProject;
}

async function seedCheckList() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS checklist (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      status BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
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

async function seedcheckListCat() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS checklist_cat (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `;

  const insertedCheckListCat = await Promise.all(
    checkListCat.map(
      (checkListCatitem) => sql`
        INSERT INTO checklist_cat (id, title)
        VALUES (${checkListCatitem.id}, ${checkListCatitem.title})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCheckListCat;
}

//中間テーブル
async function seedCheckList_CheckListCat() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS checklist_checklistcat (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      checklist_id UUID REFERENCES checklist(id),
      checklist_cat_id UUID REFERENCES checklist_cat(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `;

  const insertedCheckListMiddle = await Promise.all(
    CheckListMiddle.map((item) =>
      sql`
        INSERT INTO checklist_checklist_cat (checklist_id, checklist_cat_id)
        VALUES (${item.checklist_id}, ${item.checklist_cat_id})
        ON CONFLICT DO NOTHING;
      `,
    )
  );

  return insertedCheckListMiddle;
}


export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      // seedUsers(),
      seedProject(),
      seedCheckList(),
      seedcheckListCat(),
      seedCheckList_CheckListCat(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
