import { getAbsoluteImageUrl } from "@/lib/utils";
import Image from "next/image";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImageUrl: string; // Expecting absolute URL
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  backgroundImageUrl,
}) => {
  return (
    <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
      <Image
        src={getAbsoluteImageUrl(backgroundImageUrl)}
        alt={title || "Hero background"}
        layout="fill"
        objectFit="cover"
        priority // For LCP
      />
      <div className="absolute inset-0 bg-black/60"></div> {/* Overlay */}
      <div className="relative z-10 p-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
        {subtitle && (
          <p className="text-lg md:text-2xl max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
export default HeroSection;
