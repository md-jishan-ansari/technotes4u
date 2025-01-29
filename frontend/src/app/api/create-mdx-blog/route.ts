import fs from 'fs';
import path from 'path';
import { NextResponse } from "next/server";

export async function POST(request: any) {
  let payload = await request.json();
  let { slug, value } = payload;

  if (!slug) {
    return NextResponse.json({ result: "request field not found" }, { status: 400 });
  }

  console.log('slug:', slug);
  console.log('slug:', value);

  if (slug && value) {
    try {

      // Direct file creation without folder
      const filePath = path.join(process.cwd(), 'content/blogs', `${slug}.mdx`);
      fs.writeFileSync(filePath, value);

      return NextResponse.json({ result: "new file added" }, { status: 200 });
    } catch (err) {
      console.error('Error creating file:', err);
      return NextResponse.json({ result: err }, { status: 200 });
    }
  } else {
    return NextResponse.json({ result: "file not found" }, { status: 200 });
  }
}
