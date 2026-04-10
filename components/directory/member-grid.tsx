"use client"

import React, { useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useMembers } from "@/hooks/use-members"
import { ROLE_LABELS, ROLE_ORDER, type Member, type MemberRole } from "@/types/member"
import { Mail, MapPin, Phone, Search } from "lucide-react"

const ALL_ROLES = "all"

function matches(value: string | null | undefined, query: string): boolean {
  return !!value && value.toLowerCase().includes(query)
}

function getInitials(name: string): string {
  if (/[\u4e00-\u9fff]/.test(name)) return name.slice(-2)
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
}

function MemberRow({ member }: { member: Member }) {
  const role = member.role as MemberRole
  return (
    <tr className="group border-b border-border/50 transition-colors hover:bg-muted/40">
      {/* Name + Avatar */}
      <td className="py-3 pl-4 pr-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0 rounded-md">
            <AvatarImage src={member.avatar_url ?? undefined} alt={member.name} className="rounded-md object-cover" />
            <AvatarFallback className="rounded-md text-xs font-medium">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{member.name}</p>
            {member.name_en && (
              <p className="truncate text-xs text-muted-foreground">{member.name_en}</p>
            )}
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-3 py-3">
        <Badge variant={role} className="whitespace-nowrap">
          {member.title ?? ROLE_LABELS[role]}
        </Badge>
      </td>

      {/* Email */}
      <td className="px-3 py-3">
        <a
          href={`mailto:${member.email}`}
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Mail className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{member.email}</span>
        </a>
      </td>

      {/* Phone */}
      <td className="px-3 py-3">
        {member.phone ? (
          <a
            href={`tel:${member.phone}`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span className="whitespace-nowrap">{member.phone}</span>
          </a>
        ) : (
          <span className="text-sm text-muted-foreground/30">—</span>
        )}
      </td>

      {/* Office */}
      <td className="px-3 py-3 pr-4">
        {member.office ? (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{member.office}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground/30">—</span>
        )}
      </td>
    </tr>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border/50">
      <td className="py-3 pl-4 pr-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </td>
      <td className="px-3 py-3"><Skeleton className="h-5 w-14 rounded-full" /></td>
      <td className="px-3 py-3"><Skeleton className="h-3.5 w-36" /></td>
      <td className="px-3 py-3"><Skeleton className="h-3.5 w-24" /></td>
      <td className="px-3 py-3 pr-4"><Skeleton className="h-3.5 w-16" /></td>
    </tr>
  )
}

export function MemberGrid() {
  const { data: members, isLoading, error } = useMembers()
  const [query, setQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<MemberRole | typeof ALL_ROLES>(ALL_ROLES)

  const filtered = useMemo(() => {
    if (!members) return []
    const q = query.trim().toLowerCase()
    return members.filter((m) => {
      const roleMatch = selectedRole === ALL_ROLES || m.role === selectedRole
      if (!roleMatch) return false
      if (!q) return true
      return (
        matches(m.name, q) ||
        matches(m.name_en, q) ||
        matches(m.email, q) ||
        matches(m.phone, q) ||
        matches(m.office, q) ||
        matches(m.title, q) ||
        m.research_areas?.some((a) => a.toLowerCase().includes(q))
      )
    })
  }, [members, query, selectedRole])

  const availableRoles = useMemo(() => {
    if (!members) return []
    const present = new Set(members.map((m) => m.role))
    return ROLE_ORDER.filter((r) => present.has(r))
  }, [members])

  if (error) {
    return (
      <p className="py-20 text-center text-sm text-muted-foreground">
        無法載入成員資料，請稍後再試。
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜尋姓名、Email、辦公室…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedRole(ALL_ROLES)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedRole === ALL_ROLES
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            全部
          </button>
          {availableRoles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedRole === role
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {ROLE_LABELS[role]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              <th className="py-2.5 pl-4 pr-3 text-xs font-medium text-muted-foreground">姓名</th>
              <th className="px-3 py-2.5 text-xs font-medium text-muted-foreground">身份</th>
              <th className="px-3 py-2.5 text-xs font-medium text-muted-foreground">Email</th>
              <th className="px-3 py-2.5 text-xs font-medium text-muted-foreground">電話</th>
              <th className="px-3 py-2.5 pr-4 text-xs font-medium text-muted-foreground">辦公室</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-sm text-muted-foreground">
                  {query ? `找不到「${query}」相關的成員` : "尚無成員資料"}
                </td>
              </tr>
            ) : (
              (() => {
                // Group by role in ROLE_ORDER, only when showing all roles
                if (selectedRole !== ALL_ROLES) {
                  return filtered.map((member) => <MemberRow key={member.id} member={member} />)
                }

                const groups = ROLE_ORDER
                  .map((role) => ({
                    role,
                    members: filtered.filter((m) => m.role === role),
                  }))
                  .filter((g) => g.members.length > 0)

                return groups.map(({ role, members }) => (
                  <React.Fragment key={role}>
                    <tr className="border-b border-border/50 bg-muted/20">
                      <td colSpan={5} className="px-4 py-1.5">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {ROLE_LABELS[role]}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground/60">{members.length}</span>
                      </td>
                    </tr>
                    {members.map((member) => (
                      <MemberRow key={member.id} member={member} />
                    ))}
                  </React.Fragment>
                ))
              })()
            )}
          </tbody>
        </table>

        {/* Footer count */}
        {!isLoading && filtered.length > 0 && (
          <div className="border-t border-border/60 bg-muted/20 px-4 py-2">
            <p className="text-xs text-muted-foreground">
              共 {filtered.length} 位{selectedRole !== ALL_ROLES ? ROLE_LABELS[selectedRole] : "成員"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
