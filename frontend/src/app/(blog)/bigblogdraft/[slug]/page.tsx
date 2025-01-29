"use client"
import TOC from '@/src/mdx/components/TOC';
import { useAppDispatch } from '@/src/redux/hooks';
import { fetchSingleBlog } from '@/src/redux/slices/blogSlice';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';


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
    blog &&
    <article className="prose dark:prose-invert max-w-none">
      {toc && <TOC toc={toc} />}
      <div className="mdx-content p-4">
        <div className='col-span-12  lg:col-span-8 font-in prose max-w-max
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



export default BlogPost;