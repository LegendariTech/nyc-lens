'use client';

import { useTheme } from './ThemeProvider';
import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="h-9 w-16 rounded-full bg-slate-700 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex h-9 w-16 items-center rounded-full transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        theme === 'light'
          ? 'bg-blue-500'
          : 'bg-slate-700'
      )}
      aria-label="Toggle theme"
    >
      {/* Toggle slider */}
      <span
        className={cn(
          'inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-transform',
          theme === 'light' ? 'translate-x-8' : 'translate-x-1'
        )}
      >
        {/* Icon inside slider */}
        <span className="flex h-full w-full items-center justify-center">
          {theme === 'light' ? (
            // Sun icon
            <svg
              className="h-4 w-4 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            // Moon icon
            <svg
              className="h-4 w-4 text-slate-700"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}

