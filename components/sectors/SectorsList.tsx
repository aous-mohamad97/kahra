"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import * as LucideIcons from "lucide-react"; // Import all icons
import { cn, getAbsoluteImageUrl } from "@/lib/utils";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Sector as SectorData } from "@/lib/api"; // Import your Sector type

// Helper to get Lucide icon component by name
const getIcon = (name?: string): React.ElementType => {
  if (!name || !(name in LucideIcons)) {
    console.warn(
      `Icon "${name}" not found in LucideIcons. Falling back to HelpCircle.`
    );
    return LucideIcons.HelpCircle; // Default icon
  }
  return (LucideIcons as any)[name]; // Type assertion
};

interface SectorsListProps {
  sectors: SectorData[]; // Receive sectors as a prop
}

export default function SectorsList({ sectors = [] }: SectorsListProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  if (sectors.length === 0) {
    return (
      <SectionWrapper background="white">
        <p className="text-center text-gray-500">
          No sectors information available at the moment.
        </p>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper background="white">
      <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sectors.map((sector, index) => {
          const IconComponent = getIcon(sector.icon); // Get icon component dynamically
          return (
            <div
              key={sector.slug || sector.id} // Use slug or id from backend
              className={cn(
                "group bg-secondary dark:bg-gray-800 rounded-lg overflow-hidden transition-all duration-500 transform",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10",
                `delay-${index * 150}`
              )}
            >
              <div className="relative h-64 overflow-hidden">
                {sector.image_url && ( // Use image_url from backend
                  <Image
                    src={getAbsoluteImageUrl(sector.image_url)}
                    alt={sector.title || "Sector Image"}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-accent/20 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-wider uppercase">
                      {sector.title}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Use dangerouslySetInnerHTML if description is HTML */}
                <div
                  className="text-muted-foreground mb-6 font-light prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: sector.description || "" }}
                />

                {sector.features && sector.features.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-bold tracking-wider uppercase text-accent">
                      Key Features:
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {sector.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-accent mr-3 flex-shrink-0" />
                          <span className="text-muted-foreground font-light">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
