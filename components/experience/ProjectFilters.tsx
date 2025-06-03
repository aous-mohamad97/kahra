"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation"; // For updating URL with filters
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectFiltersProps {
  projectTypes: string[];
  projectRegions: string[];
}

export default function ProjectFilters({
  projectTypes = [],
  projectRegions = [],
}: ProjectFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedType, setSelectedType] = useState(
    () => searchParams.get("type") || "all"
  );
  const [selectedRegion, setSelectedRegion] = useState(
    () => searchParams.get("region") || "all"
  );

  // Update state if URL search params change (e.g., browser back/forward)
  useEffect(() => {
    setSelectedType(searchParams.get("type") || "all");
    setSelectedRegion(searchParams.get("region") || "all");
  }, [searchParams]);

  const handleApplyFilters = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (selectedType && selectedType !== "all") {
      current.set("type", selectedType);
    } else {
      current.delete("type");
    }

    if (selectedRegion && selectedRegion !== "all") {
      current.set("region", selectedRegion);
    } else {
      current.delete("region");
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`); // This will trigger a re-fetch if ExperiencePage reads searchParams
  };

  const handleResetFilters = () => {
    setSelectedType("all");
    setSelectedRegion("all");
    router.push(pathname); // Clear query params
  };

  return (
    <div className="mb-12">
      <div className="flex items-center mb-6">
        <Filter className="h-5 w-5 mr-2 text-accent" />
        <h2 className="text-2xl font-bold tracking-wider uppercase">
          Filter Projects
        </h2>{" "}
        {/* This title could also be dynamic */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1 uppercase tracking-wider">
            Project Type
          </label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {projectTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 uppercase tracking-wider">
            Region
          </label>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {projectRegions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-2">
          <Button
            onClick={handleApplyFilters}
            className="bg-accent hover:bg-accent/90 text-primary font-bold tracking-wide"
          >
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleResetFilters}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
