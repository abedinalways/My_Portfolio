import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("admin_session");
  return res;
}

export async function GET(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  if (session && session.startsWith("adm_")) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
