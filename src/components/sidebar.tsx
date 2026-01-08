"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquareReply, Heart } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/reply-helper", label: "Reply Helper", icon: MessageSquareReply },
  { href: "/crush-assistant", label: "Crush Assistant", icon: Heart },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card p-4 flex flex-col">
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-base font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}