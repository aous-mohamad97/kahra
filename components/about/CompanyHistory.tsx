/* eslint-disable react/no-unescaped-entities */
"use client";

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { SectionWrapper } from '@/components/ui/section-wrapper';

export default function CompanyHistory() {
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
    <SectionWrapper background="white">
      <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Image column */}
        <div className={cn(
          "relative h-[500px] rounded-lg overflow-hidden shadow-xl transition-all duration-1000",
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
        )}>
          <Image
            src="https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="KahraGen Engineering history"
            fill
            className="object-cover"
          />
        </div>
        
        {/* Content column */}
        <div className={cn(
          "transition-all duration-1000 delay-200",
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
        )}>
          <h2 className="section-title">Our Journey Since 1992</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-3 tracking-wider text-accent">Vision</h3>
              <p className="text-muted-foreground">
                To be a global leader in sustainable engineering solutions that power progress and transform lives.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-3 tracking-wider text-accent">Mission</h3>
              <p className="text-muted-foreground">
                We deliver innovative, reliable, and sustainable engineering solutions through technical excellence, 
                collaborative partnerships, and unwavering commitment to our clients' success.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-3 tracking-wider text-accent">Our History</h3>
              <p className="text-muted-foreground">
                Founded in 1992, KahraGen Engineering began as a specialized power generation consultancy. 
                Over three decades, we've evolved into a comprehensive engineering solutions provider, 
                expanding our expertise to renewable energy, smart grid technologies, and industrial automation. 
                Today, we proudly serve clients across 12 countries, having successfully delivered over 5.8 GW 
                of power generation capacity, including 450 MW of solar energy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}