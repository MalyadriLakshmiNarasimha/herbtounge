import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const samples = await request.json();

    // Forward the request to the FastAPI backend
    const backendResponse = await fetch('http://localhost:8000/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
      },
      body: JSON.stringify(samples),
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
