import { type NextRequest, NextResponse } from "next/server";

const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("supabase.co");

export async function middleware(request: NextRequest) {
  // В demo режиме пропускаем проверку авторизации
  if (DEMO_MODE) {
    return NextResponse.next();
  }

  // Real Supabase middleware
  const { updateSession } = await import("@/lib/supabase/middleware");
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
