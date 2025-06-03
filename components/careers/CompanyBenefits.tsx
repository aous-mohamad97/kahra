"use client";

import { useRef, useState, useEffect } from "react";
import * as LucideIcons from "lucide-react"; // Import all icons
import { cn } from "@/lib/utils";
import { CompanyBenefitItem } from "@/lib/api"; // Assuming you've defined this type

// Helper to get Lucide icon component by name
const getIcon = (name?: string): React.ElementType => {
  if (!name || !(name in LucideIcons)) {
    return LucideIcons.HelpCircle; // Default icon
  }
  return (LucideIcons as any)[name];
};

interface CompanyBenefitsProps {
  sectionTitle: string;
  sectionDescription: string;
  benefitsList: CompanyBenefitItem[];
}

export default function CompanyBenefits({
  sectionTitle,
  sectionDescription,
  benefitsList = [],
}: CompanyBenefitsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // ... (intersection observer logic remains the same) ...
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
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className={cn(
              "text-3xl font-bold mb-4 transition-all duration-700",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            {sectionTitle}
          </h2>
          <p
            className={cn(
              "text-lg text-gray-600 dark:text-gray-300 transition-all duration-700 delay-100",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            {sectionDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefitsList.map((benefit, index) => {
            const IconComponent = getIcon(benefit.icon_name);
            return (
              <div
                key={index} // Use a more stable key if benefits have IDs from backend
                className={cn(
                  "bg-gray-50 dark:bg-gray-700 p-6 rounded-lg transition-all duration-500 transform",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10",
                  `delay-${index * 100}`
                )}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
