"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import Link from "next/link";
import { HomeCompanyIntroData, MetricItem } from "@/lib/api"; // Import type

// Note: The 'metrics' const was removed from here, now passed as intro_metrics_items

export default function CompanyIntro(props: HomeCompanyIntroData) {
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
    <SectionWrapper background="secondary" id="company-intro">
      {" "}
      {/* Changed id for Hero scroll */}
      <div
        ref={sectionRef}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        <div className={cn(/* ...animation classes... */)}>
          <h2 className="section-title">{props.section_title}</h2>
          <p
            className="text-lg mb-6 text-muted-foreground"
            dangerouslySetInnerHTML={{
              __html: props.section_description || "",
            }}
          />
          {props.key_features_list && props.key_features_list.length > 0 && (
            <ul className="space-y-3 mb-8">
              {props.key_features_list.map((item, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          {props.learn_more_link_text && props.learn_more_link_url && (
            <Link
              href={props.learn_more_link_url}
              className="inline-flex items-center text-primary hover:text-accent font-medium transition-colors"
            >
              {props.learn_more_link_text}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>
        {props.intro_metrics_items && props.intro_metrics_items.length > 0 && (
          <div className="grid grid-cols-2 gap-6">
            {props.intro_metrics_items.map((metric, index) => (
              <div
                key={index}
                className={cn(
                  /* ...animation classes... */ "bg-white p-6 rounded-lg shadow-md"
                )}
              >
                <h3 className="text-4xl font-bold text-accent mb-2">
                  {metric.value}
                </h3>
                <p className="text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
