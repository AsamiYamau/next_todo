import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    if (user === process.env.BASIC_USER && pwd === process.env.BASIC_PASS) {
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

// 全ページに適用（Next.js の内部リソースは除外）
export const config = {
  matcher: ["/:path*"], 
};
