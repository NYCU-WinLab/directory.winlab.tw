import { createClient } from "@/lib/supabase/proxy"
import { type NextRequest, NextResponse } from "next/server"

const publicPaths = ["/login", "/api/auth/callback"]

export default async function proxy(request: NextRequest) {
  const { supabase, response } = createClient(request)
  const { pathname } = request.nextUrl

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (!user) {
    const isPublic =
      publicPaths.some((p) => pathname.startsWith(p)) ||
      pathname.startsWith("/api/")

    if (!isPublic) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
