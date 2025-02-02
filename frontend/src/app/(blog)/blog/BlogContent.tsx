"use client";

import { useAppDispatch } from '@/src/redux/hooks';
import { fetchSingleBlog } from '@/src/redux/slices/blogSlice';
import React, { useEffect, useState } from 'react'
import Container from '@/src/components/Container';
import BlogHeader from '../BlogHeader';
import BlogFooter from '../BlogFooter';
import FroalaContent from '@/src/components/froalaEditor/FroalaContent';

const BlogContent = ({slug, isdraft = false}: {slug: string, isdraft?: boolean}) => {
    const [blog, setBlog] = useState<any>();
    const dispatch = useAppDispatch();

    useEffect(() => {

        if(slug) {
            dispatch(fetchSingleBlog(slug))
                .unwrap()
                .then((blogData) => {
                    setBlog(blogData);
                });
        }
    }, [slug, dispatch]);

    return (
        blog &&
        <div className="flex gap-4">
            <div className="w-full mt-[68px]">
                <Container>
                    <BlogHeader isdraft={isdraft} />
                    <FroalaContent content={isdraft ? blog?.draftContent : blog?.content} />
                    <BlogFooter slug={slug} isdraft={isdraft} />
                </Container>
            </div>

            <div className="w-[300px]
                sticky
                top-0
                right-0
                h-[100vh]
                pt-[84px]
            ">
                Like button
            </div>
        </div>
    )
}

export default BlogContent
