"use client";
import { useState, useEffect } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link"; // Import Link for CTAs
import { HomeHeroData } from "@/lib/api"; // Import the data type

export default function Hero(props: HomeHeroData) {
  // Accept props
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToId = (id: string) => {
    // More generic scroll
    const section = document.getElementById(
      id.startsWith("#") ? id.substring(1) : id
    );
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative h-screen min-h-[600px] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${
            `https://kahragen.aldrtech.com${props.background_image_url}` ||
            `https://kahragen.aldrtech.com${props.background_image_path}` ||
            "/default-hero-bg.jpg"
          }')`,
        }} // Use prop, add fallback
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1
            className={cn(
              /* ...animation classes... */ "text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white tracking-wider uppercase"
            )}
          >
            {props.title}
          </h1>
          <p
            className={cn(
              /* ...animation classes... */ "text-xl md:text-2xl text-white/90 mb-8 font-light"
            )}
          >
            {props.description}
          </p>
          <div
            className={cn(/* ...animation classes... */ "flex flex-wrap gap-4")}
          >
            {props.cta1_text && props.cta1_url && (
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-primary font-bold tracking-wide"
                asChild
              >
                <Link href={props.cta1_url}>{props.cta1_text}</Link>
              </Button>
            )}
            {props.cta2_text && props.cta2_url && (
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white/10"
                onClick={() =>
                  props.cta2_url?.startsWith("#") && scrollToId(props.cta2_url)
                }
              >
                {props.cta2_url?.startsWith("#") ? (
                  props.cta2_text
                ) : (
                  <Link href={props.cta2_url}>{props.cta2_text}</Link>
                )}
              </Button>
            )}
          </div>
          {/* Scroll down button - can be made conditional or its target dynamic */}
          <div
            className={cn(
              /* ...animation classes... */ "absolute left-1/2 -translate-x-1/2 text-white"
            )}
            style={{ bottom: "-8vh" }}
          >
            <button
              onClick={() => scrollToId("company-intro")} // Example: make this target dynamic if needed
              className="animate-bounce p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Scroll down"
            >
              <ArrowDown className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
