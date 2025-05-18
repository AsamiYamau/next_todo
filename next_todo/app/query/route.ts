import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function checkList() {
	const data = await sql`
    SELECT checklist.title, checklist.status
    FROM checklist
  `;

	return data;
}

export async function GET() {
  try {
  	return Response.json(await checkList());
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}
