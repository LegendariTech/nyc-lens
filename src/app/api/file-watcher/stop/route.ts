import { NextResponse } from 'next/server';
import { stopWatcher } from '@/services/fileWatcher';

export async function POST() {
  try {
    const result = stopWatcher();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to stop file watcher:', error);
    return NextResponse.json(
      { error: 'Failed to stop file watcher', details: String(error) },
      { status: 500 }
    );
  }
}
