'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const [isWatcherActive, setIsWatcherActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchFolder, setWatchFolder] = useState('/Users/wice/www/nyc-lens/acris-pdfs');

  // Check watcher status on mount (no auto-start, that happens on server startup)
  useEffect(() => {
    checkWatcherStatus();
  }, []);

  const checkWatcherStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/file-watcher/status');
      const data = await response.json();
      setIsWatcherActive(data.isActive);
      if (data.watchFolder) {
        setWatchFolder(data.watchFolder);
      }
    } catch (err) {
      console.error('Failed to check watcher status:', err);
      setError('Failed to check watcher status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleWatcher = async (checked: boolean) => {
    try {
      setError(null);
      const endpoint = checked ? '/api/file-watcher/start' : '/api/file-watcher/stop';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ watchFolder }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle watcher');
      }

      const data = await response.json();
      setIsWatcherActive(data.isActive);
      if (data.watchFolder) {
        setWatchFolder(data.watchFolder);
      }
    } catch (err) {
      console.error('Failed to toggle watcher:', err);
      setError('Failed to toggle watcher');
      // Revert the toggle
      setIsWatcherActive(!checked);
    }
  };

  const handleRefreshStatus = () => {
    checkWatcherStatus();
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-b border-foreground/20 bg-background px-6 py-4">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* File Watcher Section */}
          <div className="rounded-lg border border-foreground/20 bg-background p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">File Watcher Daemon</h2>

            {error && (
              <div className="mb-4 rounded-md bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground">
                      Daemon Status
                    </label>
                    {isLoading ? (
                      <span className="text-xs text-foreground/50">Loading...</span>
                    ) : (
                      <span className={`text-xs ${isWatcherActive ? 'text-green-400' : 'text-foreground/50'}`}>
                        {isWatcherActive ? 'Running' : 'Stopped'}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-foreground/70">
                    Monitor a folder for new files and log to console when files are added
                  </p>
                </div>
                <Switch
                  checked={isWatcherActive}
                  onCheckedChange={handleToggleWatcher}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Watch Folder</label>
                <input
                  type="text"
                  value={watchFolder}
                  onChange={(e) => setWatchFolder(e.target.value)}
                  disabled={isWatcherActive}
                  className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/50 focus:border-foreground/40 focus:outline-none disabled:opacity-50"
                  placeholder="/path/to/watch/folder"
                />
                <p className="text-xs text-foreground/50">
                  The folder path to monitor for new files. Stop the daemon to change this path.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleRefreshStatus}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                >
                  Refresh Status
                </Button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded-lg border border-foreground/20 bg-background/50 p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">How it works</h3>
            <ul className="space-y-1 text-sm text-foreground/70">
              <li>• Enable the daemon to start monitoring the specified folder</li>
              <li>• When a file is added to the folder, the event will be logged to the server console</li>
              <li>• Check your server logs (terminal running the dev server) to see the output</li>
              <li>• The daemon will continue running until you disable it or restart the server</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
