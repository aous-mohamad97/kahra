// frontend/app/careers/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/common/PageHeader"; //
import CareersList from "@/components/careers/CareersList"; //
import CompanyBenefits from "@/components/careers/CompanyBenefits"; //
import {
  api,
  PageData,
  JobOpening,
  PageHeaderContentData,
  CompanyBenefitsSectionData,
  JobListingsConfigurationData,
} from "@/lib/api";

async function getCareersPageContent(): Promise<{
  pageData: PageData | null;
  jobOpenings: JobOpening[];
}> {
  try {
    const pageRes = await api.getPageBySlug("careers");
    const jobsRes = await api.getJobOpenings(); // Fetch active job openings
    return {
      pageData: pageRes.data,
      jobOpenings: jobsRes.data || [],
    };
  } catch (error) {
    console.error("Failed to fetch careers page content:", error);
    return { pageData: null, jobOpenings: [] };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { pageData } = await getCareersPageContent();
  if (!pageData) {
    return { title: "Careers", description: "Join our team." };
  }
  return {
    title:
      pageData.meta_title || pageData.title || "Careers | KahraGen Engineering",
    description:
      pageData.meta_description ||
      "Explore career opportunities at KahraGen Engineering.",
    keywords: pageData.meta_keywords || [],
  };
}

export default async function CareersPage() {
  const { pageData, jobOpenings } = await getCareersPageContent();

  if (!pageData) {
    notFound(); // Or render a specific error message
  }

  // Extract content from blocks
  const pageHeaderBlock = pageData.content?.find(
    (block) => block.type === "page_header_content"
  )?.data as PageHeaderContentData | undefined;
  const companyBenefitsBlock = pageData.content?.find(
    (block) => block.type === "company_benefits_section"
  )?.data as CompanyBenefitsSectionData | undefined;
  const jobListingsConfigBlock = pageData.content?.find(
    (block) => block.type === "job_listings_configuration"
  )?.data as JobListingsConfigurationData | undefined;

  return (
    <div className="flex flex-col">
      <PageHeader
        title={pageHeaderBlock?.header_title || pageData.title}
        description={pageHeaderBlock?.header_description}
        backgroundImageUrl={pageHeaderBlock?.header_background_image_url} // Pass the dynamic URL
      />

      {companyBenefitsBlock && (
        <CompanyBenefits
          sectionTitle={companyBenefitsBlock.section_title}
          sectionDescription={companyBenefitsBlock.section_description}
          benefitsList={companyBenefitsBlock.benefits_list}
        />
      )}

      {jobListingsConfigBlock && (
        <CareersList
          sectionTitle={jobListingsConfigBlock.section_title}
          sectionDescription={jobListingsConfigBlock.section_description}
          jobOpenings={jobOpenings}
          generalApplicationPrompt={
            jobListingsConfigBlock.general_application_prompt
          }
          generalApplicationButtonText={
            jobListingsConfigBlock.general_application_button_text
          }
          generalApplicationButtonUrl={
            jobListingsConfigBlock.general_application_button_url
          }
        />
      )}
    </div>
  );
}
