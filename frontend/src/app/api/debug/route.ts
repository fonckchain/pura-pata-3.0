import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  });
}
