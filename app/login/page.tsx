"use client"

export const dynamic = "force-dynamic"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useCallback, useState } from "react"

function LoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/"
  const [loading, setLoading] = useState<"keycloak" | "google" | null>(null)
  const supabase = createClient()

  const handleLogin = useCallback(
    async (provider: "google" | "keycloak") => {
      setLoading(provider)
      try {
        const origin = window.location.origin
        const redirectTo =
          `${origin}/api/auth/callback` +
          (next && next !== "/" ? `?next=${encodeURIComponent(next)}` : "")

        await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo,
            scopes: provider === "keycloak" ? "openid" : undefined,
          },
        })
      } catch (error) {
        console.error("Login error:", error)
        setLoading(null)
      }
    },
    [next, supabase]
  )

  return (
    <Card className="w-full max-w-sm border-border/80 bg-card/95 shadow-lg backdrop-blur-sm">
      <CardContent className="flex flex-col gap-3 p-6">
        <div className="mb-2 text-center">
          <h1 className="text-xl font-semibold tracking-tight">登入</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            登入以查看 WinLab 通訊錄
          </p>
        </div>

        <Button
          type="button"
          variant="default"
          className="w-full"
          disabled={loading !== null}
          onClick={() => handleLogin("keycloak")}
        >
          {loading === "keycloak" ? "導向 Keycloak…" : "使用 Keycloak 登入"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={loading !== null}
          onClick={() => handleLogin("google")}
        >
          {loading === "google" ? "導向 Google…" : "使用 Google 登入（備用）"}
        </Button>

        <p className="mt-1 text-center text-xs text-muted-foreground">
          <Link
            href="/"
            className="underline underline-offset-2 hover:text-foreground"
          >
            返回首頁
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

function LoginFormFallback() {
  return (
    <Card className="w-full max-w-sm">
      <CardContent className="flex flex-col gap-3 p-6">
        <div className="mb-2 space-y-2 text-center">
          <div className="mx-auto h-5 w-24 animate-pulse rounded bg-muted" />
          <div className="mx-auto h-4 w-40 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100dvh-8rem)] flex-col items-center justify-center px-4 py-12">
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
