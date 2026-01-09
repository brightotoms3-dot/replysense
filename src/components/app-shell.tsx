"use client";

import React, { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Sidebar from "@/components/sidebar";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex flex-col flex-1">
        <header className="flex h-16 items-center border-b px-4 sm:px-6 bg-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-4"
          >
            {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <Logo />
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
