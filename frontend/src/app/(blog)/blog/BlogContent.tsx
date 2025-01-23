"use client";
import FroalaBlog from '@/src/components/froalaEditor/FroalaBlog';
import { useAppDispatch } from '@/src/redux/hooks';
import { setActiveSlug } from '@/src/redux/slices/blogSlice';
import React, { useEffect } from 'react'

const BlogContent = ({slug}: {slug: string}) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setActiveSlug({slug}));
    }, []);

    return (
        <div className="p-4">
            <FroalaBlog blogtype="blog" slug={slug} />
        </div>
    )
}

export default BlogContent
