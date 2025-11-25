"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/types/supabase";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    let ignore = false;

    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!ignore) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    }

    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!ignore) setUser(session?.user ?? null);
    });

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, loading };
}
