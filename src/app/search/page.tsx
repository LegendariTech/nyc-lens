'use client';

import { PropertyAutocomplete } from "@/components/search/PropertyAutocomplete";

export default function SearchPage() {
  return (
    <div className="flex min-h-full items-start justify-center p-4 pt-4 md:pt-[20vh]">
      <PropertyAutocomplete />
    </div>
  );
}


