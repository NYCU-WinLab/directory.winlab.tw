import { createServerClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

export const createServiceClient = () => {
  const serviceKey = process.env.SUPABASE_SECRET_KEY
  if (!serviceKey) throw new Error("SUPABASE_SECRET_KEY is not set")
  return createSupabaseClient(supabaseUrl!, serviceKey)
}

export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll().filter((cookie) => {
          try {
            if (cookie.value) Buffer.from(cookie.value, "utf-8")
            return true
          } catch {
            return false
          }
        })
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              domain:
                process.env.NODE_ENV === "production" ? ".winlab.tw" : undefined,
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
            })
          })
        } catch {
          // Server Component — cookie setting is a no-op
        }
      },
    },
  })
}
