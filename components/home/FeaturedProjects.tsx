"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn, getAbsoluteImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Project as ProjectData } from "@/lib/api"; // Import type

interface FeaturedProjectsProps {
  sectionTitle: string;
  sectionDescription?: string | null;
  viewAllText?: string | null;
  viewAllUrl?: string | null;
  projects: ProjectData[];
}

export default function FeaturedProjects({
  sectionTitle,
  sectionDescription,
  viewAllText,
  viewAllUrl,
  projects = [],
}: FeaturedProjectsProps) {
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

  if (projects.length === 0) return null; // Don't render if no featured projects

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div
            className={cn(
              "max-w-2xl transition-all duration-700",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            <h2 className="text-3xl font-bold mb-4">{sectionTitle}</h2>
            {sectionDescription && (
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {sectionDescription}
              </p>
            )}
          </div>
          {viewAllText && viewAllUrl && (
            <Link
              href={viewAllUrl}
              className={cn(
                "inline-flex items-center mt-6 md:mt-0 text-primary hover:underline font-medium transition-all duration-700",
                isVisible ? "opacity-100" : "opacity-0"
              )}
            >
              {viewAllText}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={cn(
                /* ...animation classes... */ "bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md"
              )}
            >
              {project.image_url && (
                <div className="relative h-48">
                  <Image
                    src={getAbsoluteImageUrl(project.image_url)}
                    alt={project.title || "Project Image"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex gap-2 mb-3">
                  {project.type && (
                    <span className="text-xs font-medium px-2.5 py-0.5 bg-primary/10 text-primary rounded">
                      {project.type}
                    </span>
                  )}
                  {project.capacity && (
                    <span className="text-xs font-medium px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                      {project.capacity}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {project.short_description}
                </p>
                <div className="flex justify-between items-center">
                  {project.location && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {project.location}
                    </span>
                  )}
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/experience`}>
                      View details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
