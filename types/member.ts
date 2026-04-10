/**
 * Supabase table schema — run in SQL editor to set up:
 *
 * CREATE TABLE members (
 *   id            uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
 *   name          text    NOT NULL,
 *   name_en       text,
 *   email         text    NOT NULL UNIQUE,
 *   phone         text,
 *   role          text    NOT NULL CHECK (role IN ('professor','phd','master','undergraduate','alumni','staff')),
 *   title         text,
 *   avatar_url    text,
 *   github        text,
 *   office        text,
 *   research_areas text[],
 *   joined_year   integer,
 *   is_active     boolean DEFAULT true,
 *   created_at    timestamptz DEFAULT now(),
 *   updated_at    timestamptz DEFAULT now()
 * );
 *
 * ALTER TABLE members ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Authenticated users can view members"
 *   ON members FOR SELECT TO authenticated USING (true);
 */

export type MemberRole =
  | "professor"
  | "phd"
  | "master"
  | "undergraduate"
  | "alumni"
  | "staff"
  | "pending"

export interface Member {
  id: string
  name: string
  name_en: string | null
  email: string
  phone: string | null
  role: MemberRole
  title: string | null
  avatar_url: string | null
  github: string | null
  office: string | null
  research_areas: string[] | null
  joined_year: number | null
  is_active: boolean
  student_id: string | null
}

export const ROLE_LABELS: Record<MemberRole, string> = {
  professor: "教授",
  phd: "博士生",
  master: "碩士生",
  undergraduate: "大學生",
  alumni: "校友",
  staff: "行政人員",
  pending: "待確認",
}

export const ROLE_ORDER: MemberRole[] = [
  "professor",
  "phd",
  "master",
  "undergraduate",
  "staff",
  "alumni",
  "pending",
]
