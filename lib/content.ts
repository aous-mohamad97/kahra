import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ContentSection {
  title: string;
  description: string;
  image: string;
}

interface WebsiteContent {
  hero: ContentSection;
  about: ContentSection;
  services: ContentSection[];
  projects: ContentSection[];
  contact: {
    address: string;
    phone: string;
    email: string;
  };
}

interface ContentStore {
  content: WebsiteContent;
  updateContent: (section: keyof WebsiteContent, data: any) => void;
}

const defaultContent: WebsiteContent = {
  hero: {
    title: "Powering Progress with Sustainable Engineering",
    description: "KahraGen Engineering delivers innovative and sustainable solutions for power generation, renewable energy, and industrial automation across the globe.",
    image: "https://images.pexels.com/photos/2386362/pexels-photo-2386362.jpeg"
  },
  about: {
    title: "Leading Engineering Consultancy Since 1992",
    description: "KahraGen Engineering has been at the forefront of power generation and energy solutions for three decades.",
    image: "https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg"
  },
  services: [],
  projects: [],
  contact: {
    address: "Jumeirah Lakes Towers, Dubai, UAE",
    phone: "+971 4 123 4567",
    email: "projects@kahragen.com"
  }
};

export const useContent = create(
  persist<ContentStore>(
    (set) => ({
      content: defaultContent,
      updateContent: (section, data) =>
        set((state) => ({
          content: {
            ...state.content,
            [section]: data,
          },
        })),
    }),
    {
      name: 'website-content',
    }
  )
);