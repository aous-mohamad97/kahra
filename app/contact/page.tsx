// frontend/app/contact/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import MapLocation from "@/components/contact/MapLocation";
import { api, PageData, SiteSettings, PageHeaderContentData } from "@/lib/api";
import { ContentBlockRenderer } from "@/components/common/ContentBlockRenderer";

async function getContactPageAllData(): Promise<{
  page: PageData | null;
  settings: SiteSettings | null;
}> {
  try {
    const [pageRes, settingsRes] = await Promise.all([
      api.getPageBySlug("contact"),
      api.getSiteSettings(),
    ]);
    return {
      page: pageRes?.data || null,
      settings: settingsRes?.data || null,
    };
  } catch (error) {
    console.error("Failed to fetch contact page data:", error);
    return { page: null, settings: null };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getContactPageAllData();
  if (!page) {
    return { title: "Contact Us", description: "Get in touch with us." };
  }
  return {
    title: page.meta_title || page.title || "Contact Us | KahraGen Engineering",
    description:
      page.meta_description || "Contact KahraGen Engineering for inquiries.",
    keywords: page.meta_keywords || [],
  };
}

export default async function ContactPage() {
  const { page, settings } = await getContactPageAllData();

  if (!page || !settings) {
    notFound();
  }

  const pageHeaderBlock = page.content?.find(
    (block) => block.type === "page_header_content"
  )?.data as PageHeaderContentData | undefined;
  const introParagraphBlock = page.content?.find(
    (block) => block.type === "paragraph"
  ); // Example for intro text

  return (
    <div className="flex flex-col">
      <PageHeader
        title={pageHeaderBlock?.header_title || page.title}
        description={pageHeaderBlock?.header_description}
        backgroundImageUrl={pageHeaderBlock?.header_background_image_url}
      />

      {introParagraphBlock && (
        <div className="container mx-auto px-4 py-8">
          <ContentBlockRenderer block={introParagraphBlock} />
        </div>
      )}

      <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ContactInfo
          title={settings.contact_page_info_title}
          officeTitle="Dubai Headquarters" // This could also come from settings if you have multiple offices
          address={settings.contact_address}
          phone={settings.contact_phone}
          email={settings.contact_email}
          officeHoursRaw={settings.office_hours_raw}
        />
        <ContactForm title={settings.contact_page_form_title} />
      </div>
      <MapLocation
        mapIframeUrl={settings.map_iframe_url}
        mapTitle={settings.map_title}
      />
    </div>
  );
}
