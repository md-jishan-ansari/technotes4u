"use client";
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAppDispatch } from '@/src/redux/hooks';
import { fetchSingleBlog } from '@/src/redux/slices/blogSlice';
import { CategoryIcon } from './BlogCategories';
import Link from 'next/link';
import Button from '@/src/components/Button';
import { Eye, Pencil } from 'lucide-react';

const BlogHeader = () => {
    const params = useParams()
    const [activeSlug, setActiveSlug] = useState<string | null>(
        typeof params.slug === 'string' ? params.slug : null
    );

    const [blog, setBlog] = useState<any>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (activeSlug) {
            dispatch(fetchSingleBlog(activeSlug))
                .unwrap()
                .then((blogData) => {
                    setBlog(blogData);
                });
        }
    }, [params, dispatch]);


    return (
        blog &&
        <div className='flex justify-between items-center'>
            <div className="flex items-center gap-2">
                {blog.iconImage && <CategoryIcon iconImage={blog.iconImage} size={40} />}
                <h3 className="text-3xl font-bold">
                    {blog.name}
                </h3>
            </div>
            <div className="flex justify-end gap-2">
                <Link href={`/blogdraft/${blog.slug}`} >
                    <Button
                        variant="primaryGhost"
                        size="xs"
                        rounded="rounded-lg"
                    >
                        <Eye className="w-3 h-3 mr-1" />
                        View Draft
                    </Button>
                </Link>
                <Link href={`/admin/write/blog/?slug=${blog.slug}`} >
                    <Button
                        variant="primaryGhost"
                        size="xs"
                        rounded="rounded-lg"
                    >
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default BlogHeader
