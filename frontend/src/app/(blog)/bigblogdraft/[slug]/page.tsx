"use client"
import Container from '@/src/components/Container';
import TOC from '@/src/mdx/components/TOC';
import { useAppDispatch } from '@/src/redux/hooks';
import { fetchSingleBlog } from '@/src/redux/slices/blogSlice';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import BlogHeader from '../../BlogHeader';


// Import the client component wrapper
const ClientMDXRemote = dynamic(() => import('@/src/mdx/components/ClientMDXRemote'), {
  ssr: false
});

const BlogPost = ({ params }: { params: { slug: string } }) => {
  const [blog, setBlog] = useState<any>();
  const [mdxSource, setMdxSource] = useState<any>();
  const [toc, setToc] = useState<any>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (params.slug) {
      dispatch(fetchSingleBlog(params.slug))
        .unwrap()
        .then(async (blogData) => {
          setBlog(blogData);
          const response = await fetch('/api/mdx-content-generator', {
            method: 'POST',
            body: JSON.stringify({ content: blogData.mdxdraftContent }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const { mdxSource, toc } = await response.json();
          setMdxSource(mdxSource);
          setToc(toc);
        });
    }
  }, [params.slug, dispatch]);

  if (!mdxSource) return null;

  return (
    <div className="flex gap-4">
      <article className="w-full mt-[68px]">
        <Container>
          <BlogHeader isdraft={true} />
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
              Table of content
        <TOC toc={toc} />
      </div>
    </div>
  );
}



export default BlogPost;