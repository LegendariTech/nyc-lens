'use client';

import { cn } from '@/utils/cn';

interface Section {
  id: string;
  title: string;
  level: number;
}

interface OnThisPageSidebarProps {
  sections: Section[];
  className?: string;
  scrollContainer?: HTMLElement | null;
}

export function OnThisPageSidebar({ sections, className, scrollContainer }: OnThisPageSidebarProps) {

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Use the provided scroll container or find the main page scroll container
      const container = scrollContainer || document.querySelector('.scroll-container');

      if (container) {
        // Calculate the element's position relative to the scroll container
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const scrollTop = container.scrollTop;

        // Calculate target scroll position with 80px offset
        const targetScrollTop = scrollTop + (elementRect.top - containerRect.top) - 120;

        // Scroll the container
        container.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: 'smooth'
        });
      } else {
        // Fallback to window scroll if container not found
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }

      // Add temporary highlight effect
      element.classList.add('highlight-section');
      setTimeout(() => {
        element.classList.remove('highlight-section');
      }, 2000);
    }
  };

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      'hidden xl:block fixed right-6 top-24 w-64 z-[60]',
      'bg-background border border-foreground/10 rounded-lg shadow-lg',
      'p-4 max-h-[calc(100vh-8rem)] overflow-y-auto',
      className
    )}>
      <h3 className="text-sm font-semibold text-foreground mb-3">On This Page</h3>
      <nav className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              'block w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer',
              'hover:bg-foreground/10 focus:bg-foreground/10 focus:outline-none',
              'text-foreground/70 hover:text-foreground'
            )}
            style={{ paddingLeft: `${(section.level - 1) * 12 + 8}px` }}
          >
            {section.title}
          </button>
        ))}
      </nav>
    </div>
  );
}
