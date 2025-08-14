"use client";

import { MdAccountCircle } from "react-icons/md";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabaseClient";
import { RxDashboard } from "react-icons/rx";
import { PiSignOutFill } from "react-icons/pi";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function DropdownMenuCheckboxes() {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(false);
  //   const [showPanel, setShowPanel] = React.useState<Checked>(false);
  function signout() {
    // Sign out logic here
    supabase.auth.signOut().then(() => {
      // Handle post-signout actions
      window.location.href = "/login"; // Redirect to login page
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full ">
          <MdAccountCircle size={50} className="scale-150" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-blue-800">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          onCheckedChange={() => (window.location.href = "/dashboard")}
        >
          <RxDashboard />
          Dashboard
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          //   checked={showPanel}
          onCheckedChange={signout}
        >
          <PiSignOutFill />
          log out
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
