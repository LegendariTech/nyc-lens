import { NextResponse } from 'next/server';
import { getWatcherStatus } from '@/services/fileWatcher';

export async function GET() {
  const status = getWatcherStatus();
  return NextResponse.json(status);
}
