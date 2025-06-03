"use client";

import { useRef, useState, useEffect } from "react";
import { MapPin, Briefcase, Calendar } from "lucide-react"; // Keep for potential static icons if needed
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; //
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; //
import { JobOpening } from "@/lib/api"; // Assuming you've defined this type
import Link from "next/link"; // For application URLs

interface CareersListProps {
  sectionTitle: string;
  sectionDescription: string;
  jobOpenings: JobOpening[];
  generalApplicationPrompt?: string | null;
  generalApplicationButtonText?: string | null;
  generalApplicationButtonUrl?: string | null;
}

export default function CareersList({
  sectionTitle,
  sectionDescription,
  jobOpenings = [],
  generalApplicationPrompt,
  generalApplicationButtonText,
  generalApplicationButtonUrl,
}: CareersListProps) {
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
    <section ref={sectionRef} className="py-20 bg-gray-50 dark:bg-gray-900">
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

        {jobOpenings.length > 0 ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            {jobOpenings.map((job, index) => (
              <div
                key={job.id} // Assuming jobs have unique IDs from backend
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all duration-700",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10",
                  `delay-${index * 150}`
                )}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{job.title}</h3>
                      {job.department && (
                        <p className="text-primary">{job.department}</p>
                      )}
                    </div>
                    <div className="mt-2 md:mt-0">
                      {job.job_type && (
                        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                          {job.job_type}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
                    {job.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                    )}
                    {job.posted_date && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <span>
                          Posted:{" "}
                          {new Date(job.posted_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Use dangerouslySetInnerHTML if description is HTML from RichEditor */}
                  <div
                    className="mb-4 text-gray-600 dark:text-gray-300 prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />

                  <Accordion type="single" collapsible className="w-full">
                    {job.responsibilities &&
                      job.responsibilities.length > 0 && (
                        <AccordionItem value="responsibilities">
                          <AccordionTrigger>Responsibilities</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                              {job.responsibilities.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    {job.requirements && job.requirements.length > 0 && (
                      <AccordionItem value="requirements">
                        <AccordionTrigger>Requirements</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                            {job.requirements.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>

                  <div className="mt-6">
                    {job.application_url ? (
                      <Button
                        asChild
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Link
                          href={job.application_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Apply Now
                        </Link>
                      </Button>
                    ) : job.application_instructions ? (
                      <Button className="bg-primary hover:bg-primary/90">
                        Apply Now
                      </Button> // Could open a modal with instructions
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No open positions at the moment. Please check back later.</p>
          </div>
        )}

        {(generalApplicationPrompt || generalApplicationButtonText) && (
          <div
            className={cn(
              "text-center mt-12 transition-all duration-700 delay-300",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            {generalApplicationPrompt && (
              <p className="text-lg mb-4">{generalApplicationPrompt}</p>
            )}
            {generalApplicationButtonText && generalApplicationButtonUrl && (
              <Button asChild variant="outline" size="lg">
                <Link href={generalApplicationButtonUrl}>
                  {generalApplicationButtonText}
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
