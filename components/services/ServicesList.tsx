"use client";

import { useRef, useState, useEffect } from "react";
import * as LucideIcons from "lucide-react"; // Import all icons
import { cn } from "@/lib/utils";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Button } from "@/components/ui/button";
import { Service as ServiceData } from "@/lib/api"; // Import your Service type

// Helper to get Lucide icon component by name
const getIcon = (name?: string): React.ElementType => {
  if (!name || !(name in LucideIcons)) {
    console.warn(
      `Icon "${name}" not found in LucideIcons. Falling back to Cog icon.`
    );
    return LucideIcons.Cog; // Default icon if specific one not found
  }
  return (LucideIcons as any)[name];
};

interface ServicesListProps {
  services: ServiceData[];
}

export default function ServicesList({ services = [] }: ServicesListProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedService, setExpandedService] = useState<number | null>(null); // Use service.id which is number

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
        // Check if current is not null
        observer.disconnect();
      }
    };
  }, []);

  const toggleService = (id: number) => {
    // id is a number from service.id
    setExpandedService((prevId) => (prevId === id ? null : id));
  };

  if (services.length === 0) {
    return (
      <SectionWrapper background="white">
        <p className="text-center text-gray-500">
          No services information available at the moment.
        </p>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper background="white">
      {" "}
      {/* Or another background as needed */}
      <div
        ref={sectionRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {services.map((service, index) => {
          const IconComponent = getIcon(service.icon); // Get icon dynamically
          return (
            <div
              key={service.id} // Use service.id from backend
              className={cn(
                "bg-secondary dark:bg-gray-800 rounded-lg p-8 transition-all duration-700 group hover:shadow-lg",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10",
                `delay-${index * 100}`,
                expandedService === service.id
                  ? "shadow-xl ring-2 ring-accent"
                  : "shadow-sm" // Enhanced expanded style
              )}
            >
              <div className="flex items-center mb-6">
                <div className="bg-accent/10 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <IconComponent className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold tracking-wider uppercase">
                  {service.title}
                </h3>
              </div>

              {/* Use dangerouslySetInnerHTML if description is HTML from RichEditor */}
              <div
                className="text-muted-foreground mb-6 font-light prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: service.description || "" }}
              />

              {service.details && service.details.length > 0 && (
                <div
                  className={cn(
                    "grid grid-cols-1 gap-4 mt-6 overflow-hidden transition-all duration-500 ease-in-out",
                    expandedService === service.id
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0" // Adjusted for smoother transition
                  )}
                >
                  <h4 className="font-bold tracking-wider uppercase text-accent">
                    Key Features:
                  </h4>
                  <ul className="space-y-3">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-accent mt-1.5 mr-3 flex-shrink-0"></div>
                        <span className="text-muted-foreground font-light">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.details &&
                service.details.length > 0 && ( // Only show button if there are details to expand
                  <Button
                    variant="ghost"
                    onClick={() => toggleService(service.id)}
                    className="mt-6 text-primary hover:text-accent font-medium tracking-wide transition-colors"
                    aria-expanded={expandedService === service.id}
                  >
                    {expandedService === service.id
                      ? "Show less"
                      : "Learn more"}
                  </Button>
                )}
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
