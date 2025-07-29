import { updateCheckListStatus } from '@/app/lib/actions';

export async function POST(req: Request) {
  const { id, status, LoginUser } = await req.json();
console.log('update-status route:', { id, status, LoginUser });
  try {
    await updateCheckListStatus(id, status, LoginUser);
    return new Response('OK', { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response('Error', { status: 500 });
  }
}
