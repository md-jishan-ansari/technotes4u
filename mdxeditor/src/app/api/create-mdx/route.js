import fs from 'fs';
import path from 'path';
import { NextResponse } from "next/server";
import GithubSlugger from "github-slugger";

export async function POST(request) {
  const slugger = new GithubSlugger();
  let payload = await request.json();
  let { title, value } = payload;

  if (!title) {
    return NextResponse.json({ result: "request field not found" }, { status: 400 });
  }

  title = slugger.slug(title);

  if (title && value) {
    try {

      // Direct file creation without folder
      const filePath = path.join(process.cwd(), 'content/blog', `${title}.mdx`);
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
