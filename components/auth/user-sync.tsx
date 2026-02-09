"use client";

import { useUser } from "@stackframe/stack";
import { useEffect, useRef } from "react";
import { syncUser } from "@/app/actions/dashboard";

export function UserSync() {
  const user = useUser();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (user && !syncedRef.current) {
      syncUser().catch(console.error);
      syncedRef.current = true;
    }
  }, [user]);

  return null;
}
