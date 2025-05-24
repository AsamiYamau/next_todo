import { updateCheckListStatus } from '@/app/lib/actions';

export async function POST(req: Request) {
  const { id, status } = await req.json();

  try {
    await updateCheckListStatus(id, status);
    return new Response('OK', { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response('Error', { status: 500 });
  }
}
