// frontend/app/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  api,
  PageData,
  Project,
  Sector,
  PageContentBlock,
  HomeHeroData,
  HomeMetricsBarData,
  HomeCompanyIntroData,
  HomeSectorGridData,
  HomeFeaturedProjectsData,
  HomeCallToActionData,
} from "@/lib/api";

// Import your homepage components
import Hero from "@/components/home/Hero";
import Metrics from "@/components/home/Metrics"; // This is the top metrics bar
import CompanyIntro from "@/components/home/CompanyIntro";
import SectorGrid from "@/components/home/SectorGrid";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import CallToAction from "@/components/home/CallToAction";

async function getHomepageData() {
  try {
    const pageRes = await api.getPageBySlug("home");
    const homePageData = pageRes?.data || null;

    let featuredProjectsData: HomeFeaturedProjectsData | undefined;
    let featuredProjectsList: Project[] = [];
    if (homePageData?.content) {
      featuredProjectsData = homePageData.content.find(
        (block) => block.type === "home_featured_projects"
      )?.data as HomeFeaturedProjectsData | undefined;

      if (featuredProjectsData) {
        const projectsRes = await api.getProjects({
          is_featured: true,
          limit: featuredProjectsData.limit || 3,
        });
        featuredProjectsList = projectsRes?.data || [];
      }
    }

    const sectorsRes = await api.getSectors(); // For SectorGrid

    return {
      page: homePageData,
      featuredProjects: featuredProjectsList,
      sectors: sectorsRes?.data || [],
      // Extract data for each block type
      heroData: homePageData?.content?.find((b) => b.type === "home_hero")
        ?.data as HomeHeroData | undefined,
      metricsBarData: homePageData?.content?.find(
        (b) => b.type === "home_metrics_bar"
      )?.data as HomeMetricsBarData | undefined,
      companyIntroData: homePageData?.content?.find(
        (b) => b.type === "home_company_intro"
      )?.data as HomeCompanyIntroData | undefined,
      sectorGridData: homePageData?.content?.find(
        (b) => b.type === "home_sector_grid"
      )?.data as HomeSectorGridData | undefined,
      // featuredProjectsData is already extracted above
      callToActionData: homePageData?.content?.find(
        (b) => b.type === "home_call_to_action"
      )?.data as HomeCallToActionData | undefined,
    };
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    return {
      page: null,
      featuredProjects: [],
      sectors: [],
      heroData: undefined,
      metricsBarData: undefined,
      companyIntroData: undefined,
      sectorGridData: undefined,
      callToActionData: undefined,
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getHomepageData();
  return {
    title: page?.meta_title || "KahraGen Engineering | Powering Progress",
    description:
      page?.meta_description ||
      "Innovative and sustainable engineering solutions.",
    keywords: page?.meta_keywords || [],
  };
}

export default async function Home() {
  const {
    page,
    featuredProjects,
    sectors,
    heroData,
    metricsBarData,
    companyIntroData,
    sectorGridData,
    callToActionData,
  } = await getHomepageData();

  if (!page) {
    // notFound(); // Or display a fallback static homepage / error message
    return <div>Error loading homepage content. Please try again later.</div>;
  }

  return (
    <div className="flex flex-col">
      {heroData && <Hero {...heroData} />}
      {metricsBarData && (
        <Metrics metricsItems={metricsBarData.metrics_items} />
      )}
      {companyIntroData && <CompanyIntro {...companyIntroData} />}
      {sectorGridData && (
        <SectorGrid
          introTitle={sectorGridData.section_title}
          introDescription={sectorGridData.section_description}
          sectors={sectors}
        />
      )}
      {featuredProjects.length > 0 && (
        <FeaturedProjects
          sectionTitle={
            (
              page.content?.find((b) => b.type === "home_featured_projects")
                ?.data as HomeFeaturedProjectsData | undefined
            )?.section_title || "Featured Projects"
          }
          sectionDescription={
            (
              page.content?.find((b) => b.type === "home_featured_projects")
                ?.data as HomeFeaturedProjectsData | undefined
            )?.section_description
          }
          viewAllText={
            (
              page.content?.find((b) => b.type === "home_featured_projects")
                ?.data as HomeFeaturedProjectsData | undefined
            )?.view_all_text
          }
          viewAllUrl={
            (
              page.content?.find((b) => b.type === "home_featured_projects")
                ?.data as HomeFeaturedProjectsData | undefined
            )?.view_all_url
          }
          projects={featuredProjects}
        />
      )}
      {callToActionData && <CallToAction {...callToActionData} />}
    </div>
  );
}
