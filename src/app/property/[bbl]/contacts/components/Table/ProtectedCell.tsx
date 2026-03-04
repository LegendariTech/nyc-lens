'use client';

import { useClerk } from '@clerk/nextjs';
import type { ICellRendererParams } from 'ag-grid-community';
import { trackEvent } from '@/utils/trackEvent';
import { EventType } from '@/types/events';
import { EyeIcon } from '@/components/icons';

// Module-level cooldown to prevent re-opening sign-in when dismissing modal
let lastSignInTime = 0;

/**
 * Cell renderer that blurs content and shows a lock icon overlay.
 * Clicking opens the Clerk sign-in modal.
 */
export function ProtectedCell(params: ICellRendererParams) {
    const { openSignUp } = useClerk();
    const displayValue = params.valueFormatted ?? params.value ?? '';

    if (!displayValue) return null;

    const handleClick = () => {
        const now = Date.now();
        if (now - lastSignInTime < 1000) return;
        lastSignInTime = now;
        trackEvent(EventType.SIGN_IN_PROMPT_CLICK, {
            location: 'contacts_table',
            field: params.colDef?.field || '',
            bbl: params.data?.bbl || '',
        });
        openSignUp();
    };

    return (
        <div
            role="button"
            tabIndex={0}
            className="relative w-full h-full cursor-pointer group"
            onClick={handleClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
        >
            <span className="blur-[5px] select-none pointer-events-none whitespace-pre-line">
                {displayValue}
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-foreground/10 group-hover:bg-foreground/20 transition-colors">
                    <EyeIcon className="w-5 h-5 text-foreground/40 group-hover:text-foreground/70 transition-colors" />
                </span>
            </div>
        </div>
    );
}
