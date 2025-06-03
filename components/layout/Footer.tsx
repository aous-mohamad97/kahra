"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // For footer logo
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Facebook,
  Twitter,
  ExternalLink,
  // Icon as LucideIconType, // Use this for the map value type
} from "lucide-react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { api, SiteSettings, NavigationItem } from "@/lib/api";
import { getAbsoluteImageUrl } from "@/lib/utils"; // Assuming getAbsoluteImageUrl is in utils.ts

const socialIconMap: { [key: string]: any } = {
  // Corrected type for Icon values
  linkedin: Linkedin,
  facebook: Facebook,
  twitter: Twitter,
  default: ExternalLink, // Fallback icon
};

// Default values in case API fetch fails or data is missing
const defaultSiteSettings: Partial<SiteSettings> = {
  site_name: "KahraGen Engineering",
  footer_description:
    "Powering Progress with Sustainable Engineering. We deliver innovative solutions across conventional power, renewable energy, and industrial automation sectors.",
  contact_address: "Jumeirah Lakes Towers, Dubai, UAE",
  contact_phone: "+971 4 123 4567",
  contact_email: "projects@kahragen.com",
  social_media_links: { linkedin: "#", facebook: "#", twitter: "#" },
  footer_copyright_text: `© ${new Date().getFullYear()} KahraGen Engineering Consultancy. All rights reserved.`,
  logo_footer_path: null, // Keep path for consistency, URL will be derived
  logo_footer_url: null,
};

const defaultQuickLinks: NavigationItem[] = [
  {
    id: 101,
    label: "About Us",
    url: "/about",
    location: "footer_quick_links",
    order: 1,
    target: "_self",
    is_active: true,
  },
  {
    id: 102,
    label: "Services",
    url: "/services",
    location: "footer_quick_links",
    order: 2,
    target: "_self",
    is_active: true,
  },
  {
    id: 103,
    label: "Sectors",
    url: "/sectors",
    location: "footer_quick_links",
    order: 3,
    target: "_self",
    is_active: true,
  },
  {
    id: 104,
    label: "Experience",
    url: "/experience",
    location: "footer_quick_links",
    order: 4,
    target: "_self",
    is_active: true,
  },
  {
    id: 105,
    label: "Careers",
    url: "/careers",
    location: "footer_quick_links",
    order: 5,
    target: "_self",
    is_active: true,
  },
  {
    id: 106,
    label: "Contact",
    url: "/contact",
    location: "footer_quick_links",
    order: 6,
    target: "_self",
    is_active: true,
  },
];

const defaultLegalLinks: NavigationItem[] = [
  {
    id: 201,
    label: "Privacy Policy",
    url: "/privacy-policy",
    location: "footer_legal_links",
    order: 1,
    target: "_self",
    is_active: true,
  },
  {
    id: 202,
    label: "Terms of Service",
    url: "/terms",
    location: "footer_legal_links",
    order: 2,
    target: "_self",
    is_active: true,
  },
];

export default function Footer() {
  const [settings, setSettings] =
    useState<Partial<SiteSettings>>(defaultSiteSettings);
  const [quickLinks, setQuickLinks] =
    useState<NavigationItem[]>(defaultQuickLinks);
  const [legalLinks, setLegalLinks] =
    useState<NavigationItem[]>(defaultLegalLinks);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      setIsLoading(true);
      try {
        const [settingsRes, quickLinksRes, legalLinksRes] = await Promise.all([
          api.getSiteSettings(),
          api.getNavigation("footer_quick_links"),
          api.getNavigation("footer_legal_links"),
        ]);

        // Process settings and derive absolute logo URL
        const fetchedSettings = settingsRes?.data;
        if (fetchedSettings) {
          // Derive absolute URL if backend provides path, or use provided URL
          // This assumes backend sends logo_footer_path, and logo_footer_url might be pre-transformed or null
          fetchedSettings.logo_footer_url = getAbsoluteImageUrl(
            fetchedSettings.logo_footer_path
          );
          setSettings(fetchedSettings);
        } else {
          setSettings(defaultSiteSettings);
        }

        const activeQuickLinks = quickLinksRes?.data?.filter(
          (item) => item.is_active
        );
        setQuickLinks(
          activeQuickLinks?.length
            ? activeQuickLinks
            : defaultQuickLinks.filter((item) => item.is_active)
        );

        const activeLegalLinks = legalLinksRes?.data?.filter(
          (item) => item.is_active
        );
        setLegalLinks(
          activeLegalLinks?.length
            ? activeLegalLinks
            : defaultLegalLinks.filter((item) => item.is_active)
        );
      } catch (error) {
        console.error("Failed to fetch footer data:", error);
        // Fallback to defaults is already handled by initial state if settings remain null
        setSettings(defaultSiteSettings); // Ensure defaults are set on error
        setQuickLinks(defaultQuickLinks.filter((item) => item.is_active));
        setLegalLinks(defaultLegalLinks.filter((item) => item.is_active));
      } finally {
        setIsLoading(false);
      }
    };
    fetchFooterData();
  }, []);

  const socialLinksArray = settings.social_media_links
    ? Object.entries(settings.social_media_links).map(([key, url]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        href: url,
        Icon: socialIconMap[key.toLowerCase()] || socialIconMap["default"],
      }))
    : [];

  const footerLogoUrl = settings?.logo_footer_url; // This should now be the absolute URL
  const siteName = settings?.site_name || defaultSiteSettings.site_name;

  if (isLoading && !settings.site_name) {
    return (
      <footer className="bg-primary text-white dark:bg-neutral-900">
        <div className="container mx-auto py-16 text-center">Loading...</div>
      </footer>
    );
  }

  return (
    <footer className="bg-primary text-white dark:bg-neutral-900 dark:text-neutral-300">
      <SectionWrapper background="primary" className="py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          <div className="lg:col-span-2">
            {footerLogoUrl ? (
              <Link
                href="/"
                className="mb-6 inline-block"
                aria-label={`${siteName} homepage`}
              >
                <Image
                  src={footerLogoUrl} // Use the derived absolute URL
                  alt={`${siteName} Footer Logo`}
                  width={180} // Adjust as needed for your footer logo
                  height={45} // Adjust as needed
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </Link>
            ) : (
              <h3 className="text-xl font-semibold mb-6 tracking-wider text-white dark:text-primary-dark">
                {siteName}
              </h3>
            )}
            <p className="text-white/80 dark:text-neutral-400 mb-6 font-light max-w-md leading-relaxed">
              {settings.footer_description ||
                defaultSiteSettings.footer_description}
            </p>
            {socialLinksArray.length > 0 && (
              <div className="flex space-x-5">
                {socialLinksArray.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-accent dark:hover:text-primary-dark transition-colors"
                    aria-label={social.name}
                  >
                    <social.Icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {quickLinks.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-6 tracking-wider text-white dark:text-primary-dark">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((item) => (
                  <li key={item.id || item.url}>
                    <Link
                      href={item.url}
                      target={item.target || "_self"}
                      className="text-white/80 hover:text-accent dark:hover:text-primary-dark transition-colors font-light inline-block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold mb-6 tracking-wider text-white dark:text-primary-dark">
              Contact
            </h3>
            <ul className="space-y-4">
              {settings.contact_address && (
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-accent dark:text-primary-dark mt-1 flex-shrink-0" />
                  <div className="text-white/80 dark:text-neutral-400 font-light">
                    {settings.contact_address.split("\n").map((line, index) => (
                      <p key={index}>{line.trim()}</p>
                    ))}
                  </div>
                </li>
              )}
              {settings.contact_phone && (
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-accent dark:text-primary-dark flex-shrink-0" />
                  <a
                    href={`tel:${settings.contact_phone.replace(/\s/g, "")}`}
                    className="text-white/80 dark:text-neutral-400 hover:text-accent dark:hover:text-primary-dark transition-colors font-light"
                  >
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              {settings.contact_email && (
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-accent dark:text-primary-dark flex-shrink-0" />
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="text-white/80 dark:text-neutral-400 hover:text-accent dark:hover:text-primary-dark transition-colors font-light"
                  >
                    {settings.contact_email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/20 dark:border-neutral-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/70 dark:text-neutral-500 font-light text-center md:text-left">
              {settings.footer_copyright_text ||
                defaultSiteSettings.footer_copyright_text}
            </p>
            {legalLinks.length > 0 && (
              <div className="flex gap-x-6 gap-y-2 flex-wrap justify-center md:justify-end text-sm">
                {legalLinks.map((item) => (
                  <Link
                    key={item.id || item.url}
                    href={item.url}
                    target={item.target || "_self"}
                    className="text-white/70 dark:text-neutral-500 hover:text-accent dark:hover:text-primary-dark transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>
    </footer>
  );
}
