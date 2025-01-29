import fs from 'fs';
import path from 'path';
import { NextResponse } from "next/server";

export async function DELETE(request: any) {
  const { slug } = await request.json();

  if (!slug) {
    return NextResponse.json({ result: "slug not found" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'content/blogs', `${slug}.mdx`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ result: "file deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ result: "file not found" }, { status: 404 });
    }

  } catch (err) {
    console.error('Error deleting file:', err);
    return NextResponse.json({ result: err }, { status: 500 });
  }
}
