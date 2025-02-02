import getCurrentUser from "@/src/lib/actions/getCurrentUser";
import { NextResponse } from "next/server";


export async function GET() {
    const currentUser = await getCurrentUser();

    return NextResponse.json(currentUser);
}