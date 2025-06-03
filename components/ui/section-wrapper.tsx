import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  background?: "primary" | "secondary" | "white";
  id?: string;
}

export function SectionWrapper({ 
  children, 
  className,
  background = "white",
  id 
}: SectionWrapperProps) {
  const bgClasses = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary",
    white: "bg-white",
  };

  return (
    <section 
      id={id}
      className={cn(bgClasses[background])}
    >
      <div className={cn(
        "container max-w-7xl mx-auto px-4 py-20",
        className
      )}>
        {children}
      </div>
    </section>
  );
}