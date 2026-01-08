'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquareReply, Bot, Menu, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';


const navItems = [
  { href: '/reply-helper', icon: MessageSquareReply, label: 'Reply Helper' },
  { href: '/game-creator', icon: Bot, label: 'Game Creator' },
];

function NavContent() {
  const pathname = usePathname();

  return (
    <>
      <div className="px-4 py-6">
        <Logo />
      </div>
      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              pathname.startsWith(item.href) && "bg-muted text-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0 w-64">
             <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-background">
        <NavContent />
      </aside>
    </>
  );
}
