"use client";

import { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoadingScreen } from "@/components/common/LoadingScreen";

export function PageLoadingIndicatorContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  // This effect handles route changes
  useEffect(() => {
    setIsLoading(true); // Show loader immediately on path/param change

    // Hide loader after a delay to allow content to render and avoid flashing
    // Adjust delay as needed. 750ms is a common starting point.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname, searchParams]); // Re-run effect when path or search params change

  // This effect handles the very first load of the application client-side
  useEffect(() => {
    // We set loading to true initially for a very short period
    // to cover the time until the first paint after hydration.
    setIsLoading(true);
    const initialLoadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3500); // Shorter delay, just for perceived initial load

    return () => clearTimeout(initialLoadTimer);
  }, []);

  return <LoadingScreen isLoading={isLoading} />;
}

// Wrap with Suspense because usePathname and useSearchParams are not available
// during SSR for the initial static shell.
// The loading indicator itself is primarily for client-side transitions.
export function PageLoadingIndicator() {
  return (
    <Suspense fallback={null}>
      <PageLoadingIndicatorContent />
    </Suspense>
  );
}
