import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Constructs an absolute image URL from a given path.
 * Prepends NEXT_PUBLIC_APP_URL if the path is not already absolute.
 * Handles different relative path formats from the API.
 * @param imagePath The image path from the API (e.g., "/storage/image.jpg", "path/image.jpg", or already absolute)
 * @returns The absolute image URL or a fallback/empty string.
 */
export function getAbsoluteImageUrl(imagePath?: string | null): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!imagePath) {
    // You can return a placeholder image URL or an empty string
    // e.g., return '/images/placeholder.png';
    return "";
  }

  // Check if imagePath is already an absolute URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If NEXT_PUBLIC_APP_URL is not defined, we can't make it absolute.
  // Return the path as is (it might work if served from the same domain, or use a root-relative path).
  if (!appUrl) {
    console.warn(
      "NEXT_PUBLIC_APP_URL is not set. Returning potentially relative image path:",
      imagePath
    );
    return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  }

  let pathSegment = imagePath;

  // Normalize the pathSegment to ensure it starts with `/storage/` if it's a relative asset path
  // from Laravel's public storage.
  if (pathSegment.startsWith("storage/")) {
    // Path like "storage/pages/image.jpg" -> "/storage/pages/image.jpg"
    pathSegment = `/${pathSegment}`;
  } else if (
    !pathSegment.startsWith("/") &&
    !pathSegment.startsWith("storage/")
  ) {
    // Path like "pages/image.jpg" -> "/storage/pages/image.jpg"
    // This assumes paths not starting with a slash are relative to the 'storage' directory.
    pathSegment = `/storage/${pathSegment}`;
  }
  // If pathSegment is already like "/storage/pages/image.jpg", it's fine.
  // If pathSegment is like "/some-other-public-folder/image.jpg", it will also be handled correctly.

  // Ensure no double slashes between appUrl and pathSegment
  return `${appUrl.replace(/\/$/, "")}${pathSegment}`;
}
