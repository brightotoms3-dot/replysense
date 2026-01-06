import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <h1 className={cn("font-bold tracking-tight text-primary", className)}>
      ReplySense
    </h1>
  );
}
