"use client"; // Keep this if you retain any client-side effects like IntersectionObserver

import { useState, useEffect, useRef } from "react"; // Keep for IntersectionObserver if used
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react"; // Removed Zap as it wasn't used
import { cn, getAbsoluteImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Project as ProjectData } from "@/lib/api"; // Import your Project type

interface ProjectsListProps {
  initialProjects: ProjectData[]; // Receive projects as a prop
}

export default function ProjectsList({ initialProjects }: ProjectsListProps) {
  const sectionRef = useRef<HTMLDivElement>(null); // For IntersectionObserver animations
  const [isVisible, setIsVisible] = useState(false);
  // The list of projects to display will now come directly from props,
  // or be updated via props when filters change in the parent.
  // No need for 'filteredProjects' state here if parent handles filtering.
  const projectsToDisplay = initialProjects;

  useEffect(() => {
    // IntersectionObserver for animations (optional, can be kept or removed)
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
        // Check if current is not null before disconnecting
        observer.disconnect();
      }
    };
  }, []); // Empty dependency array if sectionRef doesn't change

  if (!projectsToDisplay || projectsToDisplay.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No projects found matching your criteria.
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsToDisplay.map((project, index) => (
          <div
            key={project.id} // Use project.id from backend
            id={`project-${project.id}`}
            className={cn(
              "bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all duration-700 transform hover:shadow-lg hover:-translate-y-1",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10", // Animation class
              `delay-${index * 100}` // Animation class
            )}
          >
            <div className="relative h-48">
              {project.image_url && ( // Use image_url from backend
                <Image
                  src={getAbsoluteImageUrl(project.image_url)}
                  alt={project.title || "Project image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes
                />
              )}
            </div>

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
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {project.short_description}
              </p>

              <div className="flex flex-col space-y-2 mb-4">
                {project.location && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{project.location}</span>
                  </div>
                )}
                {project.date && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(project.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                )}
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      {project.title}
                    </DialogTitle>
                    <DialogDescription
                      className="text-base mt-2 prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: project.description || "",
                      }}
                    />
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="relative h-60 rounded-md overflow-hidden">
                      {project.image_url && (
                        <Image
                          src={getAbsoluteImageUrl(project.image_url)}
                          alt={project.title || "Project image"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 800px"
                        />
                      )}
                    </div>

                    <div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* ... Render location, date, type, capacity from project object ... */}
                        {project.location && (
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Location
                            </div>
                            <div className="font-medium">
                              {project.location}
                            </div>
                          </div>
                        )}
                        {project.date && (
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Completed
                            </div>
                            <div className="font-medium">
                              {new Date(project.date).getFullYear()}
                            </div>
                          </div>
                        )}
                        {project.type && (
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Type
                            </div>
                            <div className="font-medium">{project.type}</div>
                          </div>
                        )}
                        {project.capacity && (
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Capacity
                            </div>
                            <div className="font-medium">
                              {project.capacity}
                            </div>
                          </div>
                        )}
                      </div>

                      {project.details && project.details.length > 0 && (
                        <>
                          <h4 className="font-semibold mb-2">
                            Technical Highlights:
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {project.details.map(
                              (
                                detail,
                                idx // Assuming detail is a string for now
                              ) => (
                                <li key={idx} className="flex items-start">
                                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></div>
                                  <span className="text-sm">
                                    {
                                      typeof detail === "string"
                                        ? detail
                                        : JSON.stringify(
                                            detail
                                          ) /* fallback for complex detail items */
                                    }
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
