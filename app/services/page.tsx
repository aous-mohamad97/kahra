// frontend/app/services/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import ServicesList from "@/components/services/ServicesList"; // Your detailed list component
import { api, PageData, Service, PageHeaderContentData } from "@/lib/api";

async function getServicesPageData(): Promise<{
  page: PageData | null;
  services: Service[];
}> {
  try {
    const [pageRes, servicesRes] = await Promise.all([
      api.getPageBySlug("services"), // Slug for the "Services" page itself
      api.getServices(),
    ]);
    return {
      page: pageRes?.data || null,
      services: servicesRes?.data || [],
    };
  } catch (error) {
    console.error("Failed to fetch Services page data:", error);
    return { page: null, services: [] };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getServicesPageData();
  if (!page) {
    return {
      title: "Our Services | KahraGen Engineering",
      description: "Explore KahraGen’s full-service engineering offering.",
    };
  }
  return {
    title:
      page.meta_title || page.title || "Our Services | KahraGen Engineering",
    description:
      page.meta_description ||
      "Explore KahraGen’s full-service engineering offering.",
    keywords: page.meta_keywords || [],
  };
}

export default async function ServicesPage() {
  const { page, services } = await getServicesPageData();

  if (!page && services.length === 0) {
    // Or just !page if page data is essential
    notFound();
  }

  const pageHeaderBlock = page?.content?.find(
    (block) => block.type === "page_header_content"
  )?.data as PageHeaderContentData | undefined;

  return (
    <div className="flex flex-col">
      <PageHeader
        title={pageHeaderBlock?.header_title || page?.title || "Our Services"}
        description={
          pageHeaderBlock?.header_description ||
          "Explore our comprehensive service offerings."
        }
        backgroundImageUrl={pageHeaderBlock?.header_background_image_url}
      />
      {/* The ServicesList component will be rendered within its own SectionWrapper */}
      <ServicesList services={services} />
    </div>
  );
}
