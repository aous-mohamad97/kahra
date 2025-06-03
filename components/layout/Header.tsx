"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn, getAbsoluteImageUrl } from "@/lib/utils";
import { api, NavigationItem, SiteSettings } from "@/lib/api";
// Make sure getAbsoluteImageUrl is correctly imported if your backend doesn't always provide absolute logo URLs
// import { getAbsoluteImageUrl } from '@/lib/utils';

// Default/fallback navigation items WITH is_active
const defaultNavItems: NavigationItem[] = [
  {
    id: 1,
    label: "Home",
    url: "/",
    location: "header",
    order: 1,
    target: "_self",
    is_active: true,
  },
  {
    id: 2,
    label: "About Us",
    url: "/about",
    location: "header",
    order: 2,
    target: "_self",
    is_active: true,
  },
  {
    id: 3,
    label: "Sectors",
    url: "/sectors",
    location: "header",
    order: 3,
    target: "_self",
    is_active: true,
  },
  {
    id: 4,
    label: "Services",
    url: "/services",
    location: "header",
    order: 4,
    target: "_self",
    is_active: true,
  },
  {
    id: 5,
    label: "Experience",
    url: "/experience",
    location: "header",
    order: 5,
    target: "_self",
    is_active: true,
  },
  {
    id: 6,
    label: "Contact",
    url: "/contact",
    location: "header",
    order: 6,
    target: "_self",
    is_active: true,
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navItems, setNavItems] = useState<NavigationItem[]>(defaultNavItems);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [navResponse, settingsResponse] = await Promise.all([
          api.getNavigation("header"),
          api.getSiteSettings(),
        ]);

        const activeNavItems = navResponse?.data?.filter(
          (item) => item.is_active
        );
        if (activeNavItems && activeNavItems.length > 0) {
          setNavItems(activeNavItems);
        } else {
          console.warn(
            "No active navigation items fetched for header, using defaults."
          );
          setNavItems(defaultNavItems.filter((item) => item.is_active));
        }

        if (settingsResponse?.data) {
          // Assuming backend provides absolute logo_header_url
          // If not, and you need getAbsoluteImageUrl:
          const settingsData = settingsResponse.data;
          if (settingsData.logo_header_url) {
            settingsData.logo_header_url = getAbsoluteImageUrl(settingsData.logo_header_path);
            console.log(getAbsoluteImageUrl(settingsData.logo_header_path));
          }
          setSiteSettings(settingsResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch header data:", error);
        setNavItems(defaultNavItems.filter((item) => item.is_active));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const siteName = siteSettings?.site_name || "KahraGen";
  const logoUrl = siteSettings?.logo_header_url || null;

  return (
    <header
      className={cn(
        "top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "fixed bg-black/90 backdrop-blur-md shadow-lg py-3" // Restored accent, adjusted opacity & blur
          : "relative bg-black py-4" // Restored accent
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center shrink-0 z-50"
            aria-label={`${siteName} homepage`}
          >
            {logoUrl ? (
              <Image
                src={logoUrl} // Expecting absolute URL from backend
                alt={`${siteName} Logo`}
                width={160}
                height={40}
                priority
                className="h-8 md:h-10 w-auto object-contain"
              />
            ) : (
              // Text color for logo should contrast with bg-accent
              <span className="text-2xl font-bold text-primary tracking-wider">
                {siteName}
              </span>
            )}
          </Link>

          {!isLoading && navItems.length > 0 && (
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.id || item.label}
                  href={item.url}
                  target={item.target || "_self"}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors tracking-wide", // Restored px-4
                    pathname === item.url
                      ? "text-yellow-400 font-semibold" // Active state as per your original
                      : "text-neutral-300 hover:text-yellow-400" // Inactive state as per your original
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="lg:hidden flex items-center">
            <button
              className="p-2 text-primary hover:text-primary/80" // Text color contrasting with bg-accent
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && !isLoading && navItems.length > 0 && (
        <div
          id="mobile-menu"
          className={cn(
            "lg:hidden absolute top-full left-0 right-0 shadow-lg py-2 px-2 border-t",
            // Match scrolled header background for consistency
            isScrolled
              ? "bg-accent/80 backdrop-blur-md border-accent/30"
              : "bg-accent border-accent/50"
          )}
        >
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id || item.label}
                href={item.url}
                target={item.target || "_self"}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  pathname === item.url
                    ? "bg-primary text-white" // Active state
                    : "text-primary hover:bg-primary/10" // Inactive state
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
