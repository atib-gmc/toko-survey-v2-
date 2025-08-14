"use client";

// import React { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/auth-js/dist/module/lib/types";
import { useEffect, useRef, useState } from "react";

export function ProfileDropdown() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (!user) return null;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="rounded-full w-10 h-10 bg-gray-200 flex items-center justify-center text-gray-500 focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="material-icons">account_circle</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg py-2 z-50">
          <a
            href="/dashboard"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </a>
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
