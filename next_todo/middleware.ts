import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (auth) {
    const base64 = auth.split(" ")[1];
    // Edge Runtime対応: atob を使用
    const [user, pwd] = atob(base64).split(":");

    if (
      user === process.env.BASIC_USER &&
      pwd === process.env.BASIC_PASSWORD
    ) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Auth required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: ["/:path*"],
};
