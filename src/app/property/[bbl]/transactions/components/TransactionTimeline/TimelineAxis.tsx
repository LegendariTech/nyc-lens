import { TIMELINE_CONFIG } from './constants';

export function TimelineAxis() {
  return (
    <div 
      className="absolute top-0 bottom-0 w-0.5 bg-foreground/20" 
      style={{ left: `${TIMELINE_CONFIG.TIMELINE_AXIS_OFFSET}px` }}
    />
  );
}

