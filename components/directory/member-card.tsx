import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ROLE_LABELS, type Member, type MemberRole } from "@/types/member"
import { Mail, MapPin, Phone } from "lucide-react"

interface MemberCardProps {
  member: Member
}

function getInitials(name: string): string {
  // For Chinese names, take last 2 chars; for English, take first letters of words
  if (/[\u4e00-\u9fff]/.test(name)) {
    return name.slice(-2)
  }
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function MemberCard({ member }: MemberCardProps) {
  const role = member.role as MemberRole

  return (
    <Card className="group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20">
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* Avatar */}
          <Avatar className="h-14 w-14 shrink-0 rounded-lg">
            <AvatarImage
              src={member.avatar_url ?? undefined}
              alt={member.name}
              className="rounded-lg object-cover"
            />
            <AvatarFallback className="rounded-lg text-sm font-medium">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-semibold leading-tight">{member.name}</p>
                {member.name_en && (
                  <p className="truncate text-xs text-muted-foreground">{member.name_en}</p>
                )}
              </div>
              <Badge variant={role} className="shrink-0">
                {member.title ?? ROLE_LABELS[role]}
              </Badge>
            </div>

            {/* Contact info */}
            <div className="mt-2 space-y-1">
              <a
                href={`mailto:${member.email}`}
                className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-3 w-3 shrink-0" />
                <span className="truncate">{member.email}</span>
              </a>

              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="h-3 w-3 shrink-0" />
                  <span>{member.phone}</span>
                </a>
              )}

              {member.office && (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span>{member.office}</span>
                </p>
              )}
            </div>

            {/* Research areas */}
            {member.research_areas && member.research_areas.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1">
                {member.research_areas.map((area) => (
                  <span
                    key={area}
                    className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {area}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
