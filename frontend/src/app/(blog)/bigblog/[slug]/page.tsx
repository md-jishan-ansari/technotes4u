import TOC from '@/src/mdx/components/TOC';
import { renderMDX } from '@/src/mdx/lib/mdx';
import { getAllPosts, getPostBySlug } from '@/src/mdx/lib/posts';
import { generateTOC } from '@/src/mdx/lib/toc';
import dynamic from 'next/dynamic';


// Import the client component wrapper
const ClientMDXRemote = dynamic(() => import('@/src/mdx/components/ClientMDXRemote'), {
  ssr: false
});

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

  return (
    <article className="prose dark:prose-invert max-w-none">

      <TOC toc={toc} />
      <div className="mdx-content p-4">
        <div  className='col-span-12  lg:col-span-8 font-in prose max-w-max
          prose-lg //to make font large
          prose-blockquote:bg-accent/20
          prose-blockquote:p-2
          prose-blockquote:px-6
          prose-blockquote:border-accent
          prose-blockquote:not-italic
          prose-blockquote:rounded-r-lg

          prose-li:marker:text-accent


        '>
          <ClientMDXRemote source={mdxSource} />

        </div>
      </div>
    </article>
  );
}



