"use client";
import FroalaBlog from '@/src/components/froalaEditor/FroalaBlog';
import { useAppDispatch } from '@/src/redux/hooks';
import { fetchSingleBlog, setActiveSlug } from '@/src/redux/slices/blogSlice';
import React, { useEffect, useState } from 'react'

const BlogDraftContent = ({slug}: {slug: string}) => {
    const [blog, setBlog] = useState<any>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setActiveSlug({slug}));
    }, []);

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
        <div className="p-4">
            <FroalaBlog blogContent={blog?.draftContent} slug={slug} />
        </div>
    )
}

export default BlogDraftContent
