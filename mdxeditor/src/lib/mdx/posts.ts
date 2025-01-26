import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

// const BLOGS_PATH = path.join(process.cwd(), 'content/blog');

interface PostMeta {
  readingTime?: ReturnType<typeof readingTime>;
}

export interface Post {
  slug: string;
  meta: PostMeta;
  content: string;
}

export function getPostSlugs(folderPath: string): string[] {
  return fs.readdirSync(folderPath).filter((file) => file.endsWith('.mdx'));
}

export function getPostBySlug(slug: string, folderPath: string): Post {
  const filePath = path.join(process.cwd(), folderPath, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(fileContents);

  return {
    slug,
    meta: {
      readingTime: readingTime(content)
    },
    content
  };
}

export function getAllPosts(folderPath: string): Post[] {
  const slugs = getPostSlugs(path.join(process.cwd(), folderPath));
  return slugs.map(slug => getPostBySlug(slug.replace(/\.mdx$/, ''), folderPath));
}

