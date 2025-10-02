import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sampleID = searchParams.get('sampleID');

    // Forward the request to the FastAPI backend
    const backendUrl = new URL('http://localhost:8000/api/history');
    if (sampleID) {
      backendUrl.searchParams.set('sampleID', sampleID);
    }

    const backendResponse = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': request.headers.get('authorization') || '',
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error forwarding to backend:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
