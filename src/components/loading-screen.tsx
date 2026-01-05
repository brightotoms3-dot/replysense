"use client";

import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in-0 duration-500">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Thinking...</h2>
        <p className="text-muted-foreground">Crafting the perfect replies for you.</p>
      </div>
    </div>
  );
}
