import { MemberGrid } from "@/components/directory/member-grid"

export default function DirectoryPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4">
      <div className="mx-2">
        <h1 className="text-2xl font-bold">實驗室通訊錄</h1>
        <p className="mt-1 text-sm text-muted-foreground">NYCU Winlab 成員聯絡資訊</p>
      </div>
      <MemberGrid />
    </div>
  )
}
