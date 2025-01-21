import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(request) {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public folder
    const filePath = path.join(process.cwd(), "public/uploads", file.name);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
        link: `/uploads/${file.name}`
    });
}
