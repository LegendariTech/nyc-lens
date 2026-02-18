'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ButtonGroup } from '@/components/ui';
import { OpenAIIcon, AnthropicIcon, PerplexityIcon, ExternalLinkIcon } from '@/components/icons';
import { cn } from '@/utils/cn';

interface PropertyTabsNavProps {
  activeTab?: string;
  bbl: string;
}

export function PropertyTabsNav({ activeTab, bbl }: PropertyTabsNavProps) {
  const pathname = usePathname();

  // Extract address slug from current URL path
  // e.g., /property/1-13-1/overview/1-Broadway-Manhattan-NY-10004 → /1-Broadway-Manhattan-NY-10004
  const addressSlug = pathname?.split('/').slice(4).join('/') || '';

  // Build URL for a tab value
  const getTabUrl = (value: string) => {
    let newPath = `/property/${bbl}/${value}`;

    // For DOB, add default subtab
    if (value === 'dob') {
      newPath = `/property/${bbl}/dob/jobs-filings`;
    }

    // Append address slug if present
    if (addressSlug) {
      newPath = `${newPath}/${addressSlug}`;
    }

    return newPath;
  };

  // Function to open AI services with property AI data page URL
  const getAIDataUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/property/${bbl}/ai-data`;
    }
    return '';
  };

  const openAIService = (service: string, baseUrl: string) => {
    const aiDataUrl = getAIDataUrl();
    if (aiDataUrl) {
      const query = `Read from ${aiDataUrl} so I can ask questions about it.`;
      const serviceUrl = `${baseUrl}${encodeURIComponent(query)}`;
      window.open(serviceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const aiOptions = [
    {
      label: 'Open in ChatGPT',
      subtitle: 'Ask questions about this property',
      onClick: () => openAIService('ChatGPT', 'https://chat.openai.com/?q='),
      icon: <OpenAIIcon />,
      endIcon: <ExternalLinkIcon />,
    },
    {
      label: 'Open in Claude',
      subtitle: 'Ask questions about this property',
      onClick: () => openAIService('Claude', 'https://claude.ai/new?q='),
      icon: <AnthropicIcon />,
      endIcon: <ExternalLinkIcon />,
    },
    {
      label: 'Open in Perplexity',
      subtitle: 'Ask questions about this property',
      onClick: () => openAIService('Perplexity', 'https://www.perplexity.ai/search?q='),
      icon: <PerplexityIcon />,
      endIcon: <ExternalLinkIcon />,
    },
  ];

  const tabs = [
    { value: 'overview', label: 'Overview', disabled: false },
    { value: 'contacts', label: 'Contacts', disabled: false },
    { value: 'transactions', label: 'Transactions', disabled: false },
    { value: 'pluto', label: 'BuildingInfo', disabled: false },
    { value: 'tax', label: 'Tax', disabled: false },
    { value: 'dob', label: 'DOB', disabled: true },
    { value: 'hpd', label: 'HPD', disabled: true },
  ];

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Tabs */}
      <nav className="inline-flex h-10 items-center justify-start gap-1 rounded-md bg-foreground/5 p-1 overflow-x-auto overflow-y-hidden scrollbar-hide" aria-label="Property information sections">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          const isDisabled = tab.disabled;

          const linkContent = (
            <>
              {tab.label}
            </>
          );

          if (isDisabled) {
            return (
              <span
                key={tab.value}
                className={cn(
                  'inline-flex items-center justify-center gap-2',
                  'whitespace-nowrap rounded-sm px-3 py-1.5',
                  'text-sm font-medium transition-all',
                  'shrink-0',
                  'cursor-not-allowed opacity-40 text-foreground/50'
                )}
                aria-disabled="true"
              >
                {linkContent}
              </span>
            );
          }

          return (
            <Link
              key={tab.value}
              href={getTabUrl(tab.value)}
              scroll={false}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'inline-flex items-center justify-center gap-2',
                'whitespace-nowrap rounded-sm px-3 py-1.5',
                'text-sm font-medium transition-all',
                'shrink-0',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                isActive
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-foreground/70 hover:bg-foreground/10 hover:text-foreground'
              )}
            >
              {linkContent}
            </Link>
          );
        })}
      </nav>

      {/* Ask AI Button - Hidden on mobile */}
      <div className="hidden lg:flex lg:justify-end">
        <ButtonGroup
          label="Ask AI"
          icon={
            <svg className="size-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          items={aiOptions}
          variant="outline"
          size="sm"
        />
      </div>
    </div>
  );
}

