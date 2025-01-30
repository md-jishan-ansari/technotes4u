import { renderMDX } from '@/src/mdx/lib/mdx';
import { getAllPosts, getPostBySlug } from '@/src/mdx/lib/posts';
import { generateTOC } from '@/src/mdx/lib/toc';
import BigBlogContent from '../BigBlogContent';

export async function generateStaticParams() {
  const posts = getAllPosts('content/blogs');
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug, 'content/blogs');
  const mdxSource = await renderMDX(post.content);
  const toc = generateTOC(post.content);

  return <BigBlogContent
    mdxSource={mdxSource}
    toc={toc}
    slug={params.slug}
    isdraft={false}
  />;
}



