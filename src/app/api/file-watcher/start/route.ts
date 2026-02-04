import { NextResponse } from 'next/server';
import { startWatcher } from '@/services/fileWatcher';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { watchFolder } = body;

    if (!watchFolder) {
      return NextResponse.json(
        { error: 'watchFolder is required' },
        { status: 400 }
      );
    }

    const result = startWatcher(watchFolder);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to start file watcher:', error);
    return NextResponse.json(
      { error: 'Failed to start file watcher', details: String(error) },
      { status: 500 }
    );
  }
}
