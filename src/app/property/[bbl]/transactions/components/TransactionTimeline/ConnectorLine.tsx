import { TIMELINE_CONFIG } from './constants';

interface ConnectorLineProps {
    isDeed: boolean;
}

export function ConnectorLine({ isDeed }: ConnectorLineProps) {
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
                    className={isDeed ? 'text-amber-500/50' : 'text-blue-500/50'}
                />
                {/* Dot at the end of the line where it meets the card */}
                <circle
                    cx={TIMELINE_CONFIG.CONNECTOR_LINE_WIDTH}
                    cy={centerY}
                    r={TIMELINE_CONFIG.CONNECTOR_DOT_RADIUS}
                    fill="currentColor"
                    className={isDeed ? 'text-amber-500' : 'text-blue-500'}
                />
            </svg>
        </div>
    );
}

