"use client";
import { useState, useEffect, useRef } from "react";
import * as LucideIcons from "lucide-react"; // Import all
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Sector as SectorData } from "@/lib/api"; // Import Sector type

interface SectorGridProps {
  introTitle: string;
  introDescription: string;
  sectors: SectorData[];
}

const getIcon = (name?: string): React.ElementType => {
  /* ... same getIcon helper ... */
  if (!name || !(name in LucideIcons)) return LucideIcons.HelpCircle;
  return (LucideIcons as any)[name];
};

export default function SectorGrid({
  introTitle,
  introDescription,
  sectors = [],
}: SectorGridProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    /* ... observer ... */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className={cn(
              /* ...animation classes... */ "text-3xl font-bold mb-4"
            )}
          >
            {introTitle}
          </h2>
          <p
            className={cn(
              /* ...animation classes... */ "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            )}
          >
            {introDescription}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectors.map((sector, index) => {
            const IconComponent = getIcon(sector.icon);
            return (
              <Link
                key={sector.slug || sector.id} // Use slug from backend
                href={`/sectors`} // Link to individual sector page
                className={cn(
                  /* ...animation classes... */ "bg-gray-50 dark:bg-gray-700 p-6 rounded-lg transition-all duration-500 hover:shadow-lg transform hover:-translate-y-1"
                )}
              >
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{sector.title}</h3>
                {/* Use short description if available, or full description truncated */}
                <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                  {sector.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
