"use client"

import { createClient } from "@/lib/supabase/client"
import type { Member } from "@/types/member"
import { useQuery } from "@tanstack/react-query"

async function fetchMembers(): Promise<Member[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("is_active", true)
    .order("role")
    .order("name")

  if (error) throw error
  return data ?? []
}

export function useMembers() {
  return useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  })
}
