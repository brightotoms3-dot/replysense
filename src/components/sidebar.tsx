"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquareReply, Heart, HeartPulse, CalendarHeart, Wand2 } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/reply-helper", label: "Reply Helper", icon: MessageSquareReply },
  { href: "/crush-assistant", label: "Crush Assistant", icon: Heart },
  { href: "/vibe-check", label: "Vibe Check", icon: HeartPulse },
  { href: "/date-planner", label: "Date Planner", icon: CalendarHeart },
  { href: "/rizz-assistant", label: "Rizz Assistant", icon: Wand2 },
];

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside 
      className={cn(
        "border-r bg-card p-4 flex flex-col transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0 p-0 overflow-hidden"
      )}
    >
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary whitespace-nowrap",
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
