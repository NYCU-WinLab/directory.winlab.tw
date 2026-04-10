import "@/app/globals.css"
import { Footer } from "@/components/layout/footer"
import { HeaderBar } from "@/components/layout/header-bar"
import { Separator } from "@/components/ui/separator"
import { QueryProvider } from "@/components/query-provider"
import { AuthProvider } from "@/contexts/auth-context"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "通訊錄 | Winlab",
  description: "NYCU Winlab 實驗室成員通訊錄",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <QueryProvider>
              <div className="flex min-h-dvh flex-col">
                <HeaderBar />
                <Separator />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
