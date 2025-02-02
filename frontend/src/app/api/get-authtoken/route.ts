import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = cookies();
    const authtoken = cookieStore.get('authtoken');

    return NextResponse.json({ authtoken });
}