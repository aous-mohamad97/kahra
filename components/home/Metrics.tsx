"use client";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MetricItem } from "@/lib/api"; // Import type

interface MetricsProps {
  metricsItems: MetricItem[];
}

export default function Metrics({ metricsItems = [] }: MetricsProps) {
  // Accept props
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
    <div ref={sectionRef} className="bg-primary text-white py-12">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-12 md:gap-24">
          {metricsItems.map((metric, index) => (
            <div
              key={metric.label || index}
              className={cn(/* ...animation classes... */ "text-center")}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {metric.value}
                {metric.unit && (
                  <span className="text-accent ml-1">{metric.unit}</span>
                )}
              </div>
              <div className="text-lg text-white/80 uppercase tracking-wider">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
