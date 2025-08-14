"use client";
import { supabase } from "@/lib/supabaseClient";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (!ignore) setIsLoggedIn(!!data.session);
    }
    checkSession();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.refresh();
  }

  function handleSignIn() {
    router.push("/login");
  }

  if (isLoggedIn === null) return null;

  return isLoggedIn ? (
    <button
      onClick={handleSignOut}
      className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Sign Out
    </button>
  ) : (
    <button
      onClick={handleSignIn}
      className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Sign In
    </button>
  );
}
