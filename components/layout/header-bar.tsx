"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export function HeaderBar() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between p-4 px-6">
      <nav className="flex items-center gap-2">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          WinLab
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-lg text-muted-foreground">通訊錄</span>
      </nav>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {loading ? (
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        ) : user ? (
          <button
            onClick={() => router.push("/me")}
            className="cursor-pointer transition-opacity hover:opacity-80"
            aria-label="個人資料"
          >
            <Avatar>
              <AvatarImage
                src={user.user_metadata?.avatar_url}
                alt={user.user_metadata?.full_name ?? user.email}
              />
              <AvatarFallback>
                {(user.user_metadata?.full_name ?? user.email ?? "U")
                  .charAt(0)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        ) : (
          <Button size="sm" asChild className="animate-in duration-200 fade-in">
            <Link
              href={
                pathname && pathname !== "/login"
                  ? `/login?next=${encodeURIComponent(pathname)}`
                  : "/login"
              }
            >
              登入
            </Link>
          </Button>
        )}
      </div>
    </header>
  )
}
