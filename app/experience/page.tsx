// frontend/app/experience/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import ProjectsList from "@/components/experience/ProjectsList";
import ProjectFilters from "@/components/experience/ProjectFilters";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import {
  api,
  PageData,
  Project,
  PageHeaderContentData,
  IntroSectionData,
  ProjectFilterOptionsData,
} from "@/lib/api";

async function getExperiencePageData() {
  try {
    const [pageRes, projectsRes, typesRes, regionsRes] = await Promise.all([
      api.getPageBySlug("experience"),
      api.getProjects(), // Initial load, filtering will re-fetch or client-side
      api.getProjectTypes(),
      api.getProjectRegions(),
    ]);
    return {
      page: pageRes?.data || null,
      projects: projectsRes?.data || [],
      projectTypes: typesRes?.data || [],
      projectRegions: regionsRes?.data || [],
    };
  } catch (error) {
    console.error("Failed to fetch experience page data:", error);
    return { page: null, projects: [], projectTypes: [], projectRegions: [] };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getExperiencePageData();
  return {
    title:
      page?.meta_title ||
      page?.title ||
      "Experience & Projects | KahraGen Engineering",
    description:
      page?.meta_description || "Explore KahraGen Engineering's portfolio.",
    keywords: page?.meta_keywords || [],
  };
}

export default async function ExperiencePage() {
  const { page, projects, projectTypes, projectRegions } =
    await getExperiencePageData();

  if (!page) {
    notFound();
  }

  const pageHeaderBlock = page.content?.find(
    (b) => b.type === "page_header_content"
  )?.data as PageHeaderContentData | undefined;
  const introSectionBlock = page.content?.find(
    (b) => b.type === "intro_section"
  )?.data as IntroSectionData | undefined;
  // const filterOptionsFromPage = page.content?.find(b => b.type === 'project_filter_options')?.data as ProjectFilterOptionsData | undefined;

  return (
    <div className="flex flex-col">
      <PageHeader
        title={pageHeaderBlock?.header_title || page.title}
        description={pageHeaderBlock?.header_description}
        backgroundImageUrl={pageHeaderBlock?.header_background_image_url}
      />
      <SectionWrapper background="secondary">
        {introSectionBlock && (
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">{introSectionBlock.section_title}</h2>
            <p className="section-description">
              {introSectionBlock.section_description}
            </p>
          </div>
        )}
        <ProjectFilters
          // Pass fetched or derived types and regions
          projectTypes={projectTypes} // Or filterOptionsFromPage?.types
          projectRegions={projectRegions} // Or filterOptionsFromPage?.regions
        />
        <ProjectsList initialProjects={projects} />{" "}
        {/* Pass initial projects */}
      </SectionWrapper>
    </div>
  );
}
