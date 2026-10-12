import { NextResponse, type NextRequest } from "next/server";

// The app has no user login. Every request passes straight through.
export function proxy(request: NextRequest) {
  return NextResponse.next({ request });
}

export const config = {
  matcher: [],
};
