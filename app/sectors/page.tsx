// frontend/app/sectors/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import SectorsList from "@/components/sectors/SectorsList";
import { api, PageData, Sector, PageHeaderContentData } from "@/lib/api";

async function getSectorsPageData(): Promise<{
  page: PageData | null;
  sectors: Sector[];
}> {
  try {
    const [pageRes, sectorsRes] = await Promise.all([
      api.getPageBySlug("sectors"), // Use the slug you defined in Filament for this page
      api.getSectors(),
    ]);
    return {
      page: pageRes?.data || null,
      sectors: sectorsRes?.data || [],
    };
  } catch (error) {
    console.error("Failed to fetch Sectors page data:", error);
    return { page: null, sectors: [] };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getSectorsPageData();
  if (!page) {
    return {
      title: "Our Sectors | KahraGen Engineering",
      description: "Explore the sectors KahraGen Engineering serves.",
    };
  }
  return {
    title:
      page.meta_title || page.title || "Our Sectors | KahraGen Engineering",
    description:
      page.meta_description ||
      "Explore the sectors KahraGen Engineering serves.",
    keywords: page.meta_keywords || [],
  };
}

export default async function SectorsPage() {
  const { page, sectors } = await getSectorsPageData();

  if (!page) {
    // Decide fallback behavior if the 'sectors' page entry is missing
    // For now, we can proceed if sectors are fetched but page data might be minimal
    console.warn(
      "Page data for 'sectors' not found. Displaying sectors list with default header."
    );
  }

  const pageHeaderBlock = page?.content?.find(
    (block) => block.type === "page_header_content"
  )?.data as PageHeaderContentData | undefined;

  return (
    <div className="flex flex-col">
      <PageHeader
        title={pageHeaderBlock?.header_title || page?.title || "Our Sectors"}
        description={
          pageHeaderBlock?.header_description ||
          "Explore the diverse sectors where we deliver excellence"
        }
        backgroundImageUrl={pageHeaderBlock?.header_background_image_url}
      />
      <SectorsList sectors={sectors} />
    </div>
  );
}
