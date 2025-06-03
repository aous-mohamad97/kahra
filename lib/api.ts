// frontend/lib/api.ts
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "API error with no JSON response" }));
    console.error("API Error Response:", errorData);
    throw new Error(errorData.message || `API error: ${res.status}`);
  }

  return res.json();
}

export interface APIResponse<T> {
  data: T;
  message?: string;
}

// --- Reusable Block Structures for Page Content ---
export interface ParagraphBlockData {
  text: string; // HTML string from RichEditor
}

export interface SubheadingBlockData {
  text: string;
  level: "h2" | "h3" | "h4";
}
export interface CoreValueData {
  // Renamed from CoreValueDataFromAPI for consistency
  id: number;
  title: string;
  description: string;
  icon_name?: string;
}
export interface HeroBlockData {
  title: string;
  subtitle?: string;
  background_image_path?: string | null;
  background_image_url?: string | null;
  cta_text?: string;
  cta_url?: string;
}

export interface ImageGalleryItemData {
  image_path: string;
  image_url?: string;
  alt_text?: string;
}
export interface ImageGalleryBlockData {
  images: ImageGalleryItemData[];
}

// Specific Block Data for Careers Page (and others)
export interface PageHeaderContentData {
  header_title?: string | null;
  header_description?: string | null;
  header_background_image_path?: string | null;
  header_background_image_url?: string | null;
}

export interface CompanyBenefitItem {
  icon_name: string;
  title: string;
  description: string;
}
export interface CompanyBenefitsSectionData {
  section_title: string;
  section_description: string;
  benefits_list: CompanyBenefitItem[];
}

export interface JobListingsConfigurationData {
  section_title: string;
  section_description: string;
  general_application_prompt?: string | null;
  general_application_button_text?: string | null;
  general_application_button_url?: string | null;
}

// Main PageContentBlock union type
export interface PageContentBlock {
  type:
    | "paragraph"
    | "subheading"
    | "hero"
    | "image_gallery"
    | "page_header_content"
    | "company_benefits_section"
    | "job_listings_configuration"
    | "intro_section"
    // Homepage specific blocks
    | "home_hero"
    | "home_metrics_bar"
    | "home_company_intro"
    | "home_sector_grid"
    | "home_featured_projects"
    | "home_call_to_action"
    | string;
  data:
    | ParagraphBlockData
    | SubheadingBlockData
    | HeroBlockData
    | ImageGalleryBlockData
    | PageHeaderContentData
    | CompanyBenefitsSectionData
    | JobListingsConfigurationData
    | IntroSectionData
    // Homepage specific block data
    | HomeHeroData
    | HomeMetricsBarData
    | HomeCompanyIntroData
    | HomeSectorGridData
    | HomeFeaturedProjectsData
    | HomeCallToActionData
    | any;
}

// --- Model Interfaces ---
export interface SiteSettings {
  id: number;
  site_name?: string | null;
  site_slogan?: string | null;
  logo_header_path?: string | null;
  logo_header_url?: string | null;
  logo_footer_path?: string | null;
  logo_footer_url?: string | null;
  favicon_path?: string | null;
  favicon_url?: string | null; // URL for the main favicon
  apple_touch_icon_path?: string | null; // URL for the main favicon
  default_meta_title?: string | null; // New
  default_meta_description?: string | null;
  default_meta_keywords?: string[] | null; // Expecting array after JSON parse, or string if not parsed yet by frontend
  default_og_image_path?: string | null; // New
  default_og_image_url?: string | null; // New
  google_verification_code?: string | null; // New
  theme_color?: string | null; // New
  contact_email?: string | null;
  contact_phone?: string | null;
  contact_address?: string | null;
  footer_description?: string | null; // New
  footer_copyright_text?: string | null;
  social_media_links?: Record<string, string> | null;
  // ... other fields from your seeder/model
  office_hours_raw?: string | null;
  map_iframe_url?: string | null;
  map_title?: string | null;
  contact_page_info_title?: string | null;
  contact_page_form_title?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NavigationItem {
  id: number;
  label: string;
  url: string;
  target: "_self" | "_blank";
  location: string;
  order: number;
  parent_id?: number | null;
  is_active: boolean; // This should already be here
  created_at?: string;
  updated_at?: string;
  children?: NavigationItem[];
}

export interface PageData {
  id: number;
  title: string;
  slug: string;
  content?: PageContentBlock[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[] | null;
  header_image_path?: string | null;
  header_image_url?: string | null;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description: string; // Changed from shortDescription for consistency
  location: string;
  region?: string | null; // Added region
  capacity: string;
  type: string;
  date: string;
  image?: string | null;
  image_url?: string | null; // For transformed main image URL
  details: any[]; // Could be string[] or array of objects if details have structure
  published: boolean;
  created_at?: string;
  updated_at?: string;
}
export interface ProjectType {
  name: string;
} // Or just string[]
export interface ProjectRegion {
  name: string;
}
export interface Service {
  id: number;
  slug: string;
  title: string;
  description: string; // Potentially HTML from RichEditor
  icon: string; // Name of the Lucide icon
  details: string[]; // Array of strings for key features
  order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}
// Update PageContentBlock and add IntroSectionData
export interface IntroSectionData {
  section_title: string;
  section_description: string;
}
export interface ProjectFilterOptionsData {
  // If storing options in Page content
  types: string[];
  regions: string[];
}
export interface Sector {
  id: number; // Ensure your Sector model uses 'id' if your hardcoded data used it, or 'slug'
  slug: string;
  title: string;
  description: string; // Potentially HTML from RichEditor
  icon: string; // Name of the Lucide icon
  image?: string | null; // Original path
  image_url?: string | null; // Transformed URL
  features: string[];
  order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
  // summary_text?: string | null; // If you added this from previous 'our-sectors' page example
}

export interface JobOpening {
  id: number;
  title: string;
  slug: string;
  department?: string | null;
  location?: string | null;
  job_type?: string | null;
  description: string; // HTML content
  responsibilities?: string[] | null;
  requirements?: string[] | null;
  posted_date?: string | null;
  closing_date?: string | null;
  application_url?: string | null;
  application_instructions?: string | null;
  is_active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}
// --- New Homepage Block Data Interfaces ---
export interface HomeHeroData {
  title: string;
  description: string;
  background_image_path?: string | null;
  background_image_url?: string | null;
  cta1_text?: string;
  cta1_url?: string;
  cta2_text?: string;
  cta2_url?: string;
}

export interface MetricItem {
  value: string;
  unit?: string | null;
  label: string;
}
export interface HomeMetricsBarData {
  metrics_items: MetricItem[];
}

export interface HomeCompanyIntroData {
  section_title: string;
  section_description: string;
  key_features_list: string[];
  learn_more_link_text?: string;
  learn_more_link_url?: string;
  intro_metrics_items: MetricItem[]; // Reusing MetricItem
}

export interface HomeSectorGridData {
  section_title: string;
  section_description: string;
}

export interface HomeFeaturedProjectsData {
  section_title: string;
  section_description: string;
  view_all_text?: string;
  view_all_url?: string;
  limit?: number;
}

export interface HomeCallToActionData {
  title: string;
  description: string;
  background_image_path?: string | null;
  background_image_url?: string | null;
  cta1_text?: string;
  cta1_url?: string;
  cta2_text?: string;
  cta2_url?: string;
}
// --- API Function Definitions ---
export const api = {
  getSiteSettings: () =>
    fetchAPI<APIResponse<SiteSettings | null>>("/site-settings"),
  getNavigation: (location: string) =>
    fetchAPI<APIResponse<NavigationItem[]>>(`/navigation/${location}`),

  getPages: () => fetchAPI<APIResponse<PageData[]>>("/pages"),
  getPageBySlug: (slug: string) =>
    fetchAPI<APIResponse<PageData>>(`/pages/${slug}`),

  getProjects: (filters?: {
    type?: string;
    region?: string;
    is_featured?: boolean;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (filters?.type && filters.type !== "all")
      queryParams.append("type", filters.type);
    if (filters?.region && filters.region !== "all")
      queryParams.append("region", filters.region);
    if (filters?.is_featured !== undefined)
      queryParams.append("is_featured", filters.is_featured ? "1" : "0");
    if (filters?.limit) queryParams.append("limit", filters.limit.toString());
    const queryString = queryParams.toString();
    return fetchAPI<APIResponse<Project[]>>(
      `/projects${queryString ? `?${queryString}` : ""}`
    );
  },
  getProjectTypes: () => fetchAPI<APIResponse<string[]>>("/project-types"), // Or ProjectType[]
  getProjectRegions: () => fetchAPI<APIResponse<string[]>>("/project-regions"), // Or ProjectRegion[]
  getProjectBySlug: (slug: string) =>
    fetchAPI<APIResponse<Project>>(`/projects/${slug}`),

  getServices: () => fetchAPI<APIResponse<Service[]>>("/services"),
  getServiceBySlug: (slug: string) =>
    fetchAPI<APIResponse<Service>>(`/services/${slug}`),

  getSectors: () => fetchAPI<APIResponse<Sector[]>>("/sectors"),
  getSectorBySlug: (slug: string) =>
    fetchAPI<APIResponse<Sector>>(`/sectors/${slug}`),

  getJobOpenings: (params?: { department?: string; location?: string }) => {
    const query = params
      ? new URLSearchParams(params as Record<string, string>).toString()
      : "";
    return fetchAPI<APIResponse<JobOpening[]>>(
      `/job-openings${query ? `?${query}` : ""}`
    );
  },
  getCoreValues: () => fetchAPI<APIResponse<CoreValueData[]>>("/core-values"),
  getJobOpeningBySlug: (
    slug: string // Assuming your backend route for a single job uses slug
  ) => fetchAPI<APIResponse<JobOpening>>(`/job-openings/${slug}`),

  submitContactForm: (formData: ContactFormData) =>
    fetchAPI<APIResponse<{ message: string }>>("/contact-submissions", {
      method: "POST",
      body: JSON.stringify(formData),
    }),
};
