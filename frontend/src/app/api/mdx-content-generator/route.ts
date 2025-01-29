import { renderMDX } from '@/src/mdx/lib/mdx';
import { generateTOC } from '@/src/mdx/lib/toc';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { content } = await request.json();

  const mdxSource = await renderMDX(content);
  const toc = generateTOC(content);

  return NextResponse.json({ mdxSource, toc });
}