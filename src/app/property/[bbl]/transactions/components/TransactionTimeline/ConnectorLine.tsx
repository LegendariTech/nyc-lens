import { TIMELINE_CONFIG } from './constants';
import type { CategoryMetadata, DocumentCategory } from './types';

interface ConnectorLineProps {
    categoryMetadata: CategoryMetadata;
}

const lineColorStyles: Record<DocumentCategory, string> = {
    deed: 'text-amber-500/50',
    mortgage: 'text-blue-500/50',
    'ucc-lien': 'text-red-500/50',
    other: 'text-gray-500/50',
};

const dotColorStyles: Record<DocumentCategory, string> = {
    deed: 'text-amber-500',
    mortgage: 'text-blue-500',
    'ucc-lien': 'text-red-500',
    other: 'text-gray-500',
};

export function ConnectorLine({ categoryMetadata }: ConnectorLineProps) {
    const centerY = TIMELINE_CONFIG.CONNECTOR_LINE_HEIGHT / 2;

    return (
        <div className="flex items-center shrink-0">
            <svg
                className="block"
                style={{
                    width: `${TIMELINE_CONFIG.CONNECTOR_LINE_WIDTH}px`,
                    height: `${TIMELINE_CONFIG.CONNECTOR_LINE_HEIGHT}px`
                }}
            >
                <line
                    x1="0"
                    y1={centerY}
                    x2={TIMELINE_CONFIG.CONNECTOR_LINE_WIDTH}
                    y2={centerY}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className={lineColorStyles[categoryMetadata.key]}
                />
                {/* Dot at the end of the line where it meets the card */}
                <circle
                    cx={TIMELINE_CONFIG.CONNECTOR_LINE_WIDTH}
                    cy={centerY}
                    r={TIMELINE_CONFIG.CONNECTOR_DOT_RADIUS}
                    fill="currentColor"
                    className={dotColorStyles[categoryMetadata.key]}
                />
            </svg>
        </div>
    );
}

