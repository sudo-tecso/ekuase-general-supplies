"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import type { Session } from "next-auth";

interface ProvidersProps {
  children: React.ReactNode;
  /**
   * The server-side session fetched in the root layout via `auth()`.
   * Passing it here pre-hydrates the SessionProvider so that `useSession()`
   * is immediately `authenticated` on the first client render — no async
   * fetch needed, no flash of "Sign In" on page transitions.
   */
  session: Session | null;
}

export const Providers = ({ children, session }: ProvidersProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" />
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
};
