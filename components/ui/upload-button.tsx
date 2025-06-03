"use client";

import * as React from "react";
import { UploadButton as UTUploadButton } from "@uploadthing/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadButtonProps {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
}

export function UploadButton({
  onUploadComplete,
  onUploadError,
  className,
}: UploadButtonProps) {
  return (
    // <UTUploadButton
    //   endpoint="imageUploader"
    //   onClientUploadComplete={(res: any) => {
    //     if (res?.[0]?.url && onUploadComplete) {
    //       onUploadComplete(res[0].url);
    //     }
    //   }}
    //   onUploadError={(error: any) => {
    //     if (onUploadError) {
    //       onUploadError(error);
    //     }
    //   }}
    //   appearance={{
    //     button: cn(
    //       "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2",
    //       className
    //     ),
    //   }}
    // />
    <></>
  );
}
