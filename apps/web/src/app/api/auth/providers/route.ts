import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    google: !!process.env.GOOGLE_CLIENT_ID,
    apple: !!(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET),
  })
}
