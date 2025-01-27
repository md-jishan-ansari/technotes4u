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
            <div className='flex justify-between items-center'>
                <div className="flex items-center gap-2">
                    {blog.iconImage && <CategoryIcon iconImage={blog.iconImage} size={40} />}
                    <h3 className="text-3xl font-bold">
                        {blog.name}
                    </h3>
                </div>
                <div className="flex justify-end gap-2">
                    <Link href={`/blogdraft/${slug}`} >
                        <Button
                            variant="primaryGhost"
                            size="xs"
                            rounded="rounded-lg"
                        >
                            <Eye className="w-3 h-3 mr-1" />
                            View Draft
                        </Button>
                    </Link>
                    <Link href={`/admin/write/blog/?slug=${slug}`} >
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

            <FroalaBlog blogContent={blog?.content} slug={slug} />

        </Container>
    )
}

export default BlogContent
