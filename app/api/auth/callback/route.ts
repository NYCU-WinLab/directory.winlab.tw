import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const { origin } = requestUrl
  const code = requestUrl.searchParams.get("code")
  const rawNext = requestUrl.searchParams.get("next") || "/"
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/"

  try {
    if (code) {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error exchanging code for session:", error)
        return NextResponse.redirect(`${origin}/?error=auth_error`)
      }
    }

    return NextResponse.redirect(`${origin}${next}`)
  } catch (error) {
    console.error("Auth callback error:", error)

    if (
      error instanceof Error &&
      (error.message.includes("Invalid UTF-8") ||
        error.message.includes("Invalid cookie"))
    ) {
      const response = NextResponse.redirect(`${origin}/?error=corrupted_session`)
      const projectId =
        process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/\/\/([^.]+)\./)?.[1] || ""
      const prefix = `sb-${projectId}-auth-token`

      for (const name of [prefix, `${prefix}.0`, `${prefix}.1`]) {
        response.cookies.set(name, "", { maxAge: 0, path: "/" })
        response.cookies.set(name, "", {
          maxAge: 0,
          path: "/",
          domain: ".winlab.tw",
        })
      }
      return response
    }

    return NextResponse.redirect(`${origin}/?error=unknown`)
  }
}
