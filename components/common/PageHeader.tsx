import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string | null; // Allow null
  className?: string;
  backgroundImageUrl?: string | null; // New prop
}

export default function PageHeader({
  title,
  description,
  className,
  backgroundImageUrl,
}: PageHeaderProps) {
  // Use a default image if backgroundImageUrl is not provided, or remove the style if none is desired
  const bgImage =
    backgroundImageUrl ||
    "https://images.pexels.com/photos/2130611/pexels-photo-2130611.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  return (
    <div
      className={cn("relative bg-primary text-white py-32 md:py-40", className)}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-wider uppercase">
          {title}
        </h1>
        {description && (
          <p className="text-xl md:text-2xl max-w-3xl text-white/80 font-light">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
