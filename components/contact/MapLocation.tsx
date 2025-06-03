"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "@/components/ui/section-wrapper"; //

interface MapLocationProps {
  mapIframeUrl?: string | null;
  mapTitle?: string | null;
}

export default function MapLocation({
  mapIframeUrl,
  mapTitle,
}: MapLocationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // ... (intersection observer logic same) ...
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

  const defaultMapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.515951439259!2d55.14950061500928!3d25.08169018390106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6b3ed980a8c7%3A0x3e3cf248e430179b!2sJumeirah%20Lakes%20Towers!5e0!3m2!1sen!2sae!4v1620000000000!5m2!1sen!2sae"; // A generic JLT map link

  return (
    <SectionWrapper background="secondary" className="py-0">
      <div
        ref={sectionRef}
        className={cn(
          "h-[400px] md:h-[600px] w-full transition-all duration-700 transform", // Adjusted height for responsiveness
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <iframe
          src={mapIframeUrl || defaultMapUrl} // Use dynamic or default URL
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={mapTitle || "KahraGen Engineering Office Location"}
          className="rounded-lg shadow-lg"
        ></iframe>
      </div>
    </SectionWrapper>
  );
}
