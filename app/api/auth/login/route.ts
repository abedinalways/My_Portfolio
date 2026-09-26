import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const validEmail = "admin@gmail.com";
    const validPassword = "12345678";

    if (email?.trim().toLowerCase() === validEmail && password === validPassword) {
      const token = `adm_${Buffer.from(Date.now().toString()).toString("base64")}`;

      const res = NextResponse.json({
        success: true,
        user: { email: validEmail, role: "admin" },
      });

      res.cookies.set("admin_session", token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return res;
    }

    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "Server error during authentication" },
      { status: 500 }
    );
  }
}
