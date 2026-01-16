'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { ButtonGroup } from '@/components/ui';
import { OpenAIIcon, AnthropicIcon, PerplexityIcon, ExternalLinkIcon } from '@/components/icons';
import { cn } from '@/utils/cn';

interface PropertyTabsNavProps {
  activeTab?: string;
  bbl: string;
}

export function PropertyTabsNav({ activeTab, bbl }: PropertyTabsNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Simple useState with initial value from props
  const [selectedTab, setSelectedTab] = useState(activeTab || 'pluto');

  const handleTabClick = (value: string) => {
    // Immediately update the visual state
    setSelectedTab(value);

    // Build path-based URL
    let newPath = `/property/${bbl}/${value}`;

    // For DOB, add default subtab
    if (value === 'dob') {
      newPath = `/property/${bbl}/dob/jobs-filings`;
    }

    // Preserve search params (like address)
    const params = searchParams.toString();
    const fullPath = params ? `${newPath}?${params}` : newPath;

    startTransition(() => {
      router.push(fullPath, { scroll: false });
    });
  };

  // Function to open AI services with property page URL
  const getCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const openAIService = (service: string, baseUrl: string) => {
    const currentUrl = getCurrentUrl();
    if (currentUrl) {
      const query = `Read from ${currentUrl} so I can ask questions about it.`;
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
      <div className="inline-flex h-10 items-center justify-start gap-1 rounded-md bg-foreground/5 p-1 overflow-x-auto overflow-y-hidden scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.value;
          const isLoading = isPending && isActive && activeTab !== tab.value;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.value}
              onClick={() => !isDisabled && handleTabClick(tab.value)}
              disabled={isDisabled}
              className={cn(
                'inline-flex items-center justify-center gap-2',
                'whitespace-nowrap rounded-sm px-3 py-1.5',
                'text-sm font-medium transition-all',
                'shrink-0',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                isDisabled
                  ? 'cursor-not-allowed opacity-40 text-foreground/50'
                  : 'cursor-pointer',
                !isDisabled && isActive
                  ? 'bg-background text-foreground shadow-sm'
                  : '',
                !isDisabled && !isActive
                  ? 'text-foreground/70 hover:bg-foreground/10 hover:text-foreground'
                  : ''
              )}
            >
              {isLoading && (
                <svg
                  className="size-3 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

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

