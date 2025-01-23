"use client";
import Button from '@/src/components/Button'
import Container from '@/src/components/Container'
import FroalaEditor from '@/src/components/froalaEditor/FroalaEditor'
import { Blog } from '@/src/types/types'
import { blogApi } from '@/src/redux/actions/services/api'
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useCallback  } from 'react'
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/src/redux/hooks';
import { fetchSingleBlog } from '@/src/redux/slices/blogSlice';

interface ApiErrorResponse {
    message: string;
}

const WriteBlogPage = () => {
    const [blogContent, setBlogContent] = React.useState('');
    const searchParams = useSearchParams()
    let [slug, setSlug] = useState<string | null>(searchParams.get('slug'));
    const dispatch = useAppDispatch();


    const handleblog = useCallback(async (action: 'save-to-draft' | 'publish-draft' | 'unpublish-blog') => {
        if (!slug) return;

        try {
            let response;
            switch (action) {
                case 'save-to-draft':
                    response = await blogApi.saveToDraft(slug, blogContent);
                    break;
                case 'publish-draft':
                    response = await blogApi.publishDraft(slug, blogContent);
                    break;
                case 'unpublish-blog':
                    response = await blogApi.unpublishBlog(slug, blogContent);
                    break;
            }
            toast.success('Action completed successfully');
        } catch (error) {
            toast.error('Failed to perform action');
            console.error('Error handling blog:', error);
        }
    }, [slug, blogContent]);

    const fetchBlogContent = useCallback(async () => {
        if (!slug) return;

        try {

            dispatch(fetchSingleBlog(slug))
                    .unwrap()
                    .then((blogData) => {
                        setBlogContent(blogData.draftContent);
                    }
                );

        } catch (error) {
            toast.error('Failed to fetch blog content');
            console.error('Error fetching blog:', error);
        }
    }, [slug]);

    useEffect(() => {
        fetchBlogContent()
    }, [fetchBlogContent])

  return (
    <div>
        <div className="sticky top-0 left-0 flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-secondary text-sm">
            <Container>
                <nav className="w-full mx-auto sm:flex sm:items-center sm:justify-between">
                    <a className="flex-none font-semibold text-xl text-black focus:outline-none focus:opacity-80 dark:text-white" href="#" aria-label="Brand">Brand</a>
                    <div className="flex flex-row items-center gap-5 mt-5 pb-2 overflow-x-auto sm:justify-end sm:mt-0 sm:ps-5 sm:pb-0 sm:overflow-x-visible [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                        <Button variant="primary" size="sm" onClick={() => handleblog("save-to-draft")} > Save to Draft </Button>
                        <Button variant="primary" size="sm" onClick={() => handleblog("publish-draft")} > Publish </Button>
                        <Button variant="primary" size="sm" onClick={() => handleblog("unpublish-blog")} > Unpublish </Button>
                    </div>
                </nav>
            </Container>
        </div>
        <div className="prose dark:prose-invert lg:prose-xl fixed top-[110px] left-0 w-full overflow-auto max-w-full">
            <Container>
                <FroalaEditor blogContent={blogContent} setBlogContent={setBlogContent} />
            </Container>
        </div>
    </div>
  )
}

export default WriteBlogPage
