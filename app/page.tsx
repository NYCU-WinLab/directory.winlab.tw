import { MemberGrid } from "@/components/directory/member-grid"

export default function DirectoryPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">實驗室通訊錄</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          NYCU Winlab 成員聯絡資訊
        </p>
      </div>
      <MemberGrid />
    </div>
  )
}
