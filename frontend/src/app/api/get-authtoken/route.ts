import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const cookieStore = cookies();
    const authtoken = cookieStore.get('authtoken');

    return NextResponse.json({ authtoken });
}