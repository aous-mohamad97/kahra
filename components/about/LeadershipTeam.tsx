"use client";

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionWrapper } from '@/components/ui/section-wrapper';

const leaders = [
  {
    name: 'Dr. Ahmed Al-Farsi',
    title: 'Chief Executive Officer',
    bio: 'With over 25 years of experience in power engineering, Dr. Al-Farsi leads our global operations with a focus on sustainable growth and innovation.',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    linkedin: '#',
  },
  {
    name: 'Sarah Johnson',
    title: 'Chief Technical Officer',
    bio: 'An expert in renewable energy systems, Sarah drives our technical excellence and spearheads our R&D initiatives in emerging energy technologies.',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    linkedin: '#',
  },
  {
    name: 'Michael Chen',
    title: 'Director of Operations',
    bio: 'Michael brings 18 years of experience in project delivery and operational excellence across complex engineering projects worldwide.',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    linkedin: '#',
  },
  {
    name: 'Elena Petrova',
    title: 'Head of Renewable Energy',
    bio: 'Elena leads our renewable energy division with expertise in solar, wind, and energy storage solutions across diverse global markets.',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    linkedin: '#',
  },
];

export default function LeadershipTeam() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper background="secondary">
      <div ref={sectionRef}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={cn(
            "section-title",
            isVisible ? "opacity-100" : "opacity-0"
          )}>
            Executive Leadership Team
          </h2>
          <p className={cn(
            "section-description",
            isVisible ? "opacity-100" : "opacity-0"
          )}>
            Meet the experienced professionals who drive our vision and guide our company toward continued success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {leaders.map((leader, index) => (
            <div 
              key={leader.name}
              className={cn(
                "bg-white rounded-lg overflow-hidden transition-all duration-700 transform group",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
                `delay-${index * 150}`
              )}
            >
              <div className="relative h-80 group">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 w-full">
                    <a 
                      href={leader.linkedin}
                      className="w-10 h-10 bg-accent hover:bg-accent/90 text-primary rounded-full flex items-center justify-center transition-colors"
                      aria-label={`${leader.name}'s LinkedIn profile`}
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold tracking-wider uppercase mb-1">{leader.name}</h3>
                <p className="text-accent font-medium mb-3 uppercase tracking-wide text-sm">{leader.title}</p>
                <p className="text-muted-foreground font-light">{leader.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}