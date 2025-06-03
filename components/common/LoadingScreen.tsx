// frontend/components/common/LoadingScreen.tsx
"use client"; // Not strictly necessary if no hooks, but good practice if it might evolve

import { Loader2 } from "lucide-react"; // Using a Lucide icon for the spinner
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  isLoading: boolean;
}

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-300 ease-in-out",
        isLoading ? "opacity-100 visible" : "opacity-0 invisible"
      )}
      aria-live="polite"
      aria-busy={isLoading}
    >
      {isLoading && ( // Only render spinner when active to allow CSS transitions on opacity
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
          {/* You can replace text-yellow-500 with your theme's accent color if it's yellow, e.g., text-accent */}
          <p className="mt-4 text-sm text-yellow-500/80">Loading...</p>
        </div>
      )}
    </div>
  );
}
