'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Pushes GA4 `login` and `sign_up` events to the dataLayer when
 * the user's auth state transitions from signed-out to signed-in.
 *
 * - Distinguishes sign-up from login by checking whether the Clerk
 *   user was created within the last 60 seconds.
 * - Does NOT fire on page load when the user is already signed in.
 * - Render once inside ClerkProvider (e.g. in RootLayout).
 */
export function AuthEventTracker() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const prevSignedIn = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (!isLoaded) return;

    // Only fire when transitioning from signed-out → signed-in
    if (isSignedIn && prevSignedIn.current === false) {
      const isNewUser =
        user?.createdAt &&
        Date.now() - user.createdAt.getTime() < 60_000;

      window.dataLayer?.push({
        event: isNewUser ? 'sign_up' : 'login',
        method: 'clerk',
      });
    }

    prevSignedIn.current = !!isSignedIn;
  }, [isLoaded, isSignedIn, user]);

  return null;
}
