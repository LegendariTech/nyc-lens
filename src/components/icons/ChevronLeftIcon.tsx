import React, { type SVGProps } from 'react';

export function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M10.0293 3.02929C10.2566 2.80202 10.6081 2.77382 10.8662 2.94433L10.9707 3.02929C11.198 3.25656 11.2262 3.60807 11.0557 3.8662L10.9707 3.9707L6.94142 7.99999L10.9707 12.0293C11.198 12.2566 11.2262 12.6081 11.0557 12.8662L10.9707 12.9707C10.7434 13.198 10.3919 13.2262 10.1338 13.0557L10.0293 12.9707L5.52929 8.4707C5.30202 8.24344 5.27382 7.89193 5.44433 7.6338L5.52929 7.52929L10.0293 3.02929Z" />
    </svg>
  );
}

