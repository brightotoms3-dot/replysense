"use client";

import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";

interface LandingScreenProps {
  onStart: () => void;
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in-50 duration-500">
      <Logo className="text-5xl md:text-6xl" />
      <p className="text-xl md:text-2xl text-muted-foreground">
        Don’t reply yet. Ask the AI.
      </p>
      <Button size="lg" onClick={onStart} className="px-12 py-6 text-lg">
        Get Help Now
      </Button>
    </div>
  );
}
