import { cn } from "@/lib/utils";
import { MessageSquareHeart } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <MessageSquareHeart className="h-6 w-6 text-primary" />
      <h1 className={cn("font-bold tracking-tight text-xl text-primary", className)}>
        ReplySense
      </h1>
    </Link>
  );
}