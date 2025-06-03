"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn, getAbsoluteImageUrl } from "@/lib/utils";
import { HomeCallToActionData } from "@/lib/api"; // Import type

export default function CallToAction(props: HomeCallToActionData) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false); // Kept for potential text animations

  useEffect(() => {
    // Intersection observer for isVisible (e.g., for triggering text animations)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Disconnect after a single observation
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    const currentRef = sectionRef.current; // Capture current ref value
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef); // Use unobserve for cleanup
      }
    };
  }, []);

  // Parallax scroll effect (scrollPosition state and its useEffect) has been removed.

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 text-white bg-cover bg-center bg-fixed" // Added md:py-28 for more padding on larger screens
      style={
        props.background_image_url
          ? {
              backgroundImage: `linear-gradient(to right, rgba(0,0,1,0.75), rgba(0,0,1,0.65)), url('${getAbsoluteImageUrl(
                props.background_image_url
              )}')`,
            }
          : {
              // Fallback if no image URL is provided - you might want a solid color from your theme
              // Ensure your 'primary' color in Tailwind config translates well here, or use a specific hex/rgba
              backgroundColor: "var(--primary-dark)", // Example using a darker primary, or replace with Tailwind class on the section.
            }
      }
    >
      {/* The fixed background and gradient are applied via the style prop above.
          If no image, a fallback background color is applied.
          An explicit overlay div is not strictly needed if the gradient is part of the backgroundImage.
      */}
      <div className="container mx-auto px-4 relative z-10">
        {" "}
        {/* Content wrapper */}
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className={cn(
              "text-4xl md:text-5xl font-bold mb-6 tracking-wider uppercase",
              // Example animation using isVisible state (requires CSS or Framer Motion)
              isVisible
                ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
                : "opacity-0 translate-y-5"
            )}
          >
            {props.title}
          </h2>
          <p
            className={cn(
              "text-xl mb-8 text-white/90 font-light", // Increased opacity for better readability
              isVisible
                ? "opacity-100 translate-y-0 transition-all duration-700 ease-out delay-200"
                : "opacity-0 translate-y-5"
            )}
          >
            {props.description}
          </p>
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4 justify-center",
              isVisible
                ? "opacity-100 translate-y-0 transition-all duration-700 ease-out delay-300"
                : "opacity-0 translate-y-5"
            )}
          >
            {props.cta1_text && props.cta1_url && (
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold tracking-wide shadow-lg" // Use accent-foreground for text on accent
              >
                <Link href={props.cta1_url}>{props.cta1_text}</Link>
              </Button>
            )}
            {props.cta2_text && props.cta2_url && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white bg-white/10 hover:text-white font-bold tracking-wide shadow-lg"
              >
                <Link href={props.cta2_url}>{props.cta2_text}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
