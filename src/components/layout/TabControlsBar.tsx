'use client';

import { ButtonGroup, Switch } from '@/components/ui';
import { OpenAIIcon, AnthropicIcon, PerplexityIcon, ExternalLinkIcon } from '@/components/icons';
import { cn } from '@/utils/cn';

interface TabControlsBarProps {
  showAIServices?: boolean;
  showEmptyFieldsToggle?: boolean;
  hideEmptyFields?: boolean;
  onEmptyFieldsChange?: (hide: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}

export function TabControlsBar({
  showAIServices = true,
  showEmptyFieldsToggle = false,
  hideEmptyFields = false,
  onEmptyFieldsChange,
  className,
  children
}: TabControlsBarProps) {
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

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {/* Left side - AI Services or custom children */}
      <div className="flex items-center gap-4">
        {showAIServices && (
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
        )}
        {children}
      </div>

      {/* Right side - Empty Fields Toggle */}
      {showEmptyFieldsToggle && onEmptyFieldsChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground/70">Hide empty fields</span>
          <Switch
            checked={hideEmptyFields}
            onCheckedChange={onEmptyFieldsChange}
          />
        </div>
      )}
    </div>
  );
}
