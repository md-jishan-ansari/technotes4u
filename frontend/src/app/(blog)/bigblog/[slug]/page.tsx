import TOC from '@/src/mdx/components/TOC';
import { renderMDX } from '@/src/mdx/lib/mdx';
import { getAllPosts, getPostBySlug } from '@/src/mdx/lib/posts';
import { generateTOC } from '@/src/mdx/lib/toc';
import dynamic from 'next/dynamic';
import BlogHeader from '../../BlogHeader';
import Container from '@/src/components/Container';


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
    <div className="flex gap-4">
      <article className="w-full mt-[68px]">
        <Container>
          <BlogHeader />
          <div className="mdx-content">
            <div className='prose dark:prose-invert
                    prose-lg //to make font large
                    prose-blockquote:bg-accent/20
                    prose-blockquote:p-2
                    prose-blockquote:px-6
                    prose-blockquote:border-accent
                    prose-blockquote:not-italic
                    prose-blockquote:rounded-r-lg

                    prose-li:marker:text-accent
                    max-w-none
                  '>
              <ClientMDXRemote source={mdxSource} />

            </div>
          </div>
        </Container>
      </article>

      <div className="w-[300px]
                sticky
                top-0
                right-0
                h-[100vh]
                pt-[84px]
            ">
        <TOC toc={toc} />
      </div>
    </div>
  );
}



