import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function getSupabaseServerClient() {
  const cookieStore = cookies();

  // createServerComponentClient reads cookies via the Next.js headers API
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
}
