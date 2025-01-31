import Container from '@/src/components/Container';
import React from 'react'
import BlogHeader from '../BlogHeader';
import BlogFooter from '../BlogFooter';
import TOC from '@/src/mdx/components/TOC';
import dynamic from 'next/dynamic';
import Comment from '@/src/components/comments/AddComment';

// Import the client component wrapper
const ClientMDXRemote = dynamic(() => import('@/src/mdx/components/ClientMDXRemote'), {
    ssr: false
});

const BigBlogContent = ({ mdxSource, toc, slug, isdraft = false }: { mdxSource: any, toc: any, slug: string, isdraft: boolean }) => {
    return (
        <div className="flex gap-4">
          <article className="w-full mt-[68px]">
            <Container>
                <BlogHeader isdraft={isdraft} />
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
              <BlogFooter slug={slug} isdraft={isdraft} />
            </Container>
          </article>

          <div className="w-[300px]
                    sticky
                    top-0
                    right-0
                    h-[100vh]
                    pt-[84px]
                ">
                    Table of content
            <TOC toc={toc} />
          </div>
        </div>
      );
}

export default BigBlogContent
