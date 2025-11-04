'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ButtonGroup } from '@/components/ui';
import { OpenAIIcon, AnthropicIcon, PerplexityIcon, ExternalLinkIcon } from '@/components/icons';

interface PropertyTabsNavProps {
  activeTab?: string;
  bbl: string;
}

export function PropertyTabsNav({ activeTab, bbl }: PropertyTabsNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Default to pluto if no tab is specified
  const currentTab = activeTab || 'pluto';

  const handleTabClick = (value: string) => {
    // Build path-based URL
    let newPath = `/property/${bbl}/${value}`;

    // For DOB, add default subtab
    if (value === 'dob') {
      newPath = `/property/${bbl}/dob/violations`;
    }

    // Preserve search params (like address)
    const params = searchParams.toString();
    const fullPath = params ? `${newPath}?${params}` : newPath;

    // Update URL
    router.push(fullPath, { scroll: false });
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
    { value: 'overview', label: 'Overview' },
    { value: 'pluto', label: 'PLUTO' },
    { value: 'tax', label: 'Tax' },
    { value: 'dob', label: 'DOB' },
    { value: 'hpd', label: 'HPD' },
  ];

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Tabs */}
      <div className="inline-flex h-10 items-center justify-start gap-1 rounded-md bg-foreground/5 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={`
              inline-flex items-center justify-center gap-2
              whitespace-nowrap rounded-sm px-3 py-1.5
              text-sm font-medium transition-all
              cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
              ${currentTab === tab.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-foreground/70 hover:bg-foreground/10 hover:text-foreground'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ask AI Button */}
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
  );
}

