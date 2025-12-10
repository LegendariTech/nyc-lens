'use client';

import { Switch } from '@/components/ui';
import { cn } from '@/utils/cn';

interface TabControlsBarProps {
  showEmptyFieldsToggle?: boolean;
  hideEmptyFields?: boolean;
  onEmptyFieldsChange?: (hide: boolean) => void;
  showRawViewToggle?: boolean;
  rawView?: boolean;
  onRawViewChange?: (raw: boolean) => void;
  showTableViewToggle?: boolean;
  tableView?: boolean;
  onTableViewChange?: (table: boolean) => void;
  showNormalizedToggle?: boolean;
  normalized?: boolean;
  onNormalizedChange?: (normalized: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}

export function TabControlsBar({
  showEmptyFieldsToggle = false,
  hideEmptyFields = false,
  onEmptyFieldsChange,
  showRawViewToggle = false,
  rawView = false,
  onRawViewChange,
  showTableViewToggle = false,
  tableView = false,
  onTableViewChange,
  showNormalizedToggle = false,
  normalized = false,
  onNormalizedChange,
  className,
  children
}: TabControlsBarProps) {
  // Check if there are any controls to display
  const hasEmptyFieldsControl = showEmptyFieldsToggle && onEmptyFieldsChange;
  const hasRawViewControl = showRawViewToggle && onRawViewChange;
  const hasTableViewControl = showTableViewToggle && onTableViewChange;
  const hasNormalizedControl = showNormalizedToggle && onNormalizedChange;
  const hasAnyControls = hasEmptyFieldsControl || hasRawViewControl || hasTableViewControl || hasNormalizedControl || children;

  // Return null if there are no controls to display
  if (!hasAnyControls) {
    return null;
  }

  return (
    <div className={cn('flex items-center justify-between h-10', className)}>
      {/* Left side - custom children */}
      <div className="flex items-center gap-4">
        {children}
      </div>

      {/* Right side - Toggles */}
      <div className="flex items-center gap-6">
        {hasTableViewControl && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground/70">Table View</span>
            <Switch
              checked={tableView}
              onCheckedChange={onTableViewChange}
            />
          </div>
        )}

        {hasNormalizedControl && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground/70">Normalized</span>
            <Switch
              checked={normalized}
              onCheckedChange={onNormalizedChange}
            />
          </div>
        )}

        {hasEmptyFieldsControl && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground/70">Hide empty fields</span>
            <Switch
              checked={hideEmptyFields}
              onCheckedChange={onEmptyFieldsChange}
            />
          </div>
        )}

        {hasRawViewControl && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground/70">Raw View</span>
            <Switch
              checked={rawView}
              onCheckedChange={onRawViewChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
