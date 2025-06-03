// frontend/app/about/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  api,
  PageData,
  CoreValueData as CoreValueDataFromAPI,
} from "@/lib/api"; // Use CoreValueDataFromAPI from api.ts
import HeroSection from "@/components/common/HeroSection";
import SectionTitle from "@/components/common/SectionTitle";
// Removed LeadershipSlider import
import { AnimatedSection } from "@/components/about/AnimatedSection";

import {
  CheckCircle,
  ShieldCheck,
  Lightbulb,
  Leaf,
  Users,
  GitMerge,
  XIcon as LucideIconType,
} from "lucide-react";
import CoreValuesDisplay from "@/components/about/CoreValues";
import { getAbsoluteImageUrl } from "@/lib/utils";

// Interface for the props CoreValuesDisplay expects
interface CoreValueForComponent {
  title: string;
  description: string;
  IconComponent: any;
}

const coreValueIconMap: { [key: string]: any } = {
  CheckCircle,
  ShieldCheck,
  Lightbulb,
  Leaf,
  Users,
  GitMerge,
  default: CheckCircle,
};

const findBlockData = (
  pageContent: any[] | null | undefined,
  blockType: string
): any | null => {
  if (!pageContent) return null;
  const block = pageContent.find((b) => b.type === blockType);
  return block ? block.data : null;
};

async function getAboutPageAllData() {
  try {
    const [pageResponse, coreValuesResponse] = await Promise.all([
      // Removed leadershipResponse
      api.getPageBySlug("about"),
      api.getCoreValues(),
    ]);

    const page = pageResponse?.data || null;
    const coreValues = coreValuesResponse?.data || []; // Ensure data property is accessed if APIResponse wraps it

    if (!page) {
      return null;
    }

    return { page, coreValues }; // Removed leadershipTeam
  } catch (error) {
    console.error("Failed to fetch About Us page data:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getAboutPageAllData();
  if (!data?.page) {
    return {
      title: "About Us | Page Not Found",
      description: "The requested page could not be found.",
    };
  }
  const { page } = data;
  return {
    title: page.meta_title || page.title || "About Us | KahraGen Engineering",
    description:
      page.meta_description ||
      "Learn more about KahraGen Engineering, our mission, vision, and values.",
    keywords: page.meta_keywords || [
      "about kahragen",
      "company values",
      "engineering leadership",
    ],
    // openGraph: {
    //   images: page.header_image_url ? [page.header_image_url] : [],
    // },
  };
}

export default async function AboutPage() {
  const allData = await getAboutPageAllData();

  if (!allData || !allData.page) {
    notFound();
  }

  const { page, coreValues } = allData; // Removed leadershipTeam

  const heroData = findBlockData(page.content, "hero_section") || {
    /* ... defaults ... */ title: page.title || "About KahraGen Engineering",
    subtitle:
      "Learn about our company, our values, and our vision for the future.",
    background_image_url:
      page.header_image_url ||
      "https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  };
  const overviewData = findBlockData(page.content, "company_overview") || {
    /* ... defaults ... */ title: "Our Company",
    subtitle: "Empowering Progress with Sustainability",
    paragraph1_html:
      "<p>Default company overview paragraph 1. Please update this content in the CMS.</p>",
    image_url:
      "https://images.pexels.com/photos/2760242/pexels-photo-2760242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  };
  const visionMissionData = findBlockData(page.content, "vision_mission") || {
    /* ... defaults ... */ vision_title: "Our Vision",
    vision_html_p1: "<p>Default vision content p1. Update in CMS.</p>",
    mission_title: "Our Mission",
    mission_html_p1: "<p>Default mission content p1. Update in CMS.</p>",
  };
  const ctaData = findBlockData(page.content, "cta_section") || {
    /* ... defaults ... */ title: "Join Our Team of Experts",
    paragraph:
      "KahraGen Engineering is always looking for talented professionals...",
    button_text: "Contact Us",
    button_link: "/contact",
    background_image_url:
      "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  };

  const mappedCoreValues: CoreValueForComponent[] = coreValues.map(
    (cv: CoreValueDataFromAPI) => ({
      title: cv.title,
      description: cv.description,
      IconComponent:
        coreValueIconMap[cv.icon_name || "default"] ||
        coreValueIconMap["default"],
    })
  );

  return (
    <>
      <HeroSection
        title={heroData.title}
        subtitle={heroData.subtitle}
        backgroundImageUrl={heroData.background_image_url}
      />

      <section className="py-16 md:py-24 bg-neutral-100 dark:bg-neutral-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection initialVars={{ opacity: 0, x: -30 }}>
              <SectionTitle
                title={overviewData.title}
                subtitle={overviewData.subtitle}
              />
              <div className="space-y-6 text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
                {overviewData.paragraph1_html && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: overviewData.paragraph1_html,
                    }}
                  />
                )}
                {overviewData.paragraph2_html && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: overviewData.paragraph2_html,
                    }}
                  />
                )}
                {overviewData.paragraph3_html && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: overviewData.paragraph3_html,
                    }}
                  />
                )}
              </div>
            </AnimatedSection>
            <AnimatedSection
              initialVars={{ opacity: 0, y: 30 }}
              className="relative h-[450px] md:h-[600px] rounded-xl overflow-hidden shadow-2xl"
            >
              <Image
                src={getAbsoluteImageUrl(overviewData.image_url)}
                alt={overviewData.title || "Company Overview"}
                layout="fill"
                objectFit="cover"
                className="rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-neutral-200 dark:bg-neutral-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatedSection className="bg-white dark:bg-neutral-800 p-6 md:p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                {visionMissionData.vision_title}
              </h3>
              <div className="w-16 h-1 bg-primary mb-6"></div>
              <div className="prose dark:prose-invert max-w-none prose-p:text-neutral-600 dark:prose-p:text-neutral-300 prose-strong:text-neutral-700 dark:prose-strong:text-neutral-200">
                {visionMissionData.vision_html_p1 && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: visionMissionData.vision_html_p1,
                    }}
                  />
                )}
                {visionMissionData.vision_html_p2 && (
                  <div
                    className="mt-4"
                    dangerouslySetInnerHTML={{
                      __html: visionMissionData.vision_html_p2,
                    }}
                  />
                )}
                {visionMissionData.vision_html_p3 && (
                  <div
                    className="mt-4"
                    dangerouslySetInnerHTML={{
                      __html: visionMissionData.vision_html_p3,
                    }}
                  />
                )}
              </div>
            </AnimatedSection>
            <AnimatedSection className="bg-white dark:bg-neutral-800 p-6 md:p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                {visionMissionData.mission_title}
              </h3>
              <div className="w-16 h-1 bg-primary mb-6"></div>
              <div className="prose dark:prose-invert max-w-none prose-p:text-neutral-600 dark:prose-p:text-neutral-300 prose-strong:text-neutral-700 dark:prose-strong:text-neutral-200">
                {visionMissionData.mission_html_p1 && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: visionMissionData.mission_html_p1,
                    }}
                  />
                )}
                {visionMissionData.mission_html_p2 && (
                  <div
                    className="mt-4"
                    dangerouslySetInnerHTML={{
                      __html: visionMissionData.mission_html_p2,
                    }}
                  />
                )}
                {visionMissionData.mission_html_p3 && (
                  <div
                    className="mt-4"
                    dangerouslySetInnerHTML={{
                      __html: visionMissionData.mission_html_p3,
                    }}
                  />
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Core Values - Dynamic */}
      {mappedCoreValues.length > 0 && (
        <CoreValuesDisplay values={mappedCoreValues} />
      )}

      <section
        className="py-20 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,1,0.7), rgba(0,0,1,0.6)), url(${ctaData.background_image_url})`,
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              {ctaData.title}
            </h2>
            <p className="text-neutral-200 dark:text-neutral-300 mb-8">
              {ctaData.paragraph}
            </p>
            <a
              href={ctaData.button_link}
              className="inline-block bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary-dark transition duration-300"
            >
              {ctaData.button_text}
            </a>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
