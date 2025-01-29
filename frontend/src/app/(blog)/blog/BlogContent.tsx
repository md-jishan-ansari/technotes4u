"use client";
import FroalaBlog from '@/src/components/froalaEditor/FroalaBlog';
import { useAppDispatch } from '@/src/redux/hooks';
import { fetchSingleBlog } from '@/src/redux/slices/blogSlice';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { CategoryIcon } from '../BlogCategories';
import Container from '@/src/components/Container';
import { Pencil, Eye } from 'lucide-react';
import Button from '@/src/components/Button';
import BlogHeader from '../BlogHeader';

const BlogContent = ({slug}: {slug: string}) => {
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
        <Container>

            <BlogHeader />
            <FroalaBlog blogContent={blog?.content} slug={slug} />

        </Container>
    )
}

export default BlogContent
