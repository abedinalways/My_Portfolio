import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  if (session && session.startsWith("adm_")) {
    return NextResponse.json({ authenticated: true, email: "admin@gmail.com" });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
