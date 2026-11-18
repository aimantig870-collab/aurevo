import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseKey, supabaseUrl } from "@/lib/env";

/** Session-aware client for admin pages and server actions. Runs as the signed-in user (RLS enforced). */
export async function serverClient() {
  if (!supabaseUrl || !supabaseKey) return null;
  const store = await cookies();
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          /* called from a Server Component — the proxy refreshes the session instead */
        }
      },
    },
  });
}
