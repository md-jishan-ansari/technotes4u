"use client"
import { useAppDispatch } from '@/src/redux/hooks';
import { fetchSingleBlog } from '@/src/redux/slices/blogSlice';
import { useEffect, useState } from 'react';
import BigBlogContent from '../../bigblog/BigBlogContent';

const BlogPost = ({ params }: { params: { slug: string } }) => {
  const [mdxSource, setMdxSource] = useState<any>();
  const [toc, setToc] = useState<any>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (params.slug) {
      dispatch(fetchSingleBlog(params.slug))
        .unwrap()
        .then(async (blogData) => {
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

  return <BigBlogContent
    mdxSource={mdxSource}
    toc={toc}
    slug={params.slug}
    isdraft={true}
  />;
}



export default BlogPost;