'use client';

import { useEffect } from 'react';

export function LocatorInit() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@locator/runtime').then((locator) => {
        // @ts-expect-error - 'cursor' is a valid adapter, but not in the package types
        locator.default({ adapter: 'cursor' });
      });
    }
  }, []);

  return null;
}

