"use client";
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAppDispatch } from '@/src/redux/hooks';
import { fetchSingleBlog } from '@/src/redux/slices/blogSlice';
import { CategoryIcon } from './BlogCategories';
import Link from 'next/link';
import Button from '@/src/components/Button';
import { Eye, Pencil } from 'lucide-react';
import { MdOutlinePublish } from 'react-icons/md';
import { Blog, Editor } from '@/src/types/types';
import { blogApi } from '@/src/lib/actions/services/api';
import { toast } from 'react-toastify';

const PREVIEW_URLS: Record<Editor, string> = {
    [Editor.RichEditor]: '/blogdraft/',
    [Editor.MdxEditor]: '/bigblogdraft/'
}
const BLOGS_URLS: Record<Editor, string> = {
    [Editor.RichEditor]: '/blog/',
    [Editor.MdxEditor]: '/bigblog/'
}

const BlogHeader = ({isdraft = false}: {isdraft?: boolean}) => {
    const params = useParams()
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [blogUrl, setBlogUrl] = useState<string>("");
    const [activeSlug, setActiveSlug] = useState<string | null>(
        typeof params.slug === 'string' ? params.slug : null
    );

    const [blog, setBlog] = useState<Blog | null>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        setActiveSlug(typeof params.slug === 'string' ? params.slug : null);
    }, [params])

    useEffect(() => {
        if (activeSlug) {
            dispatch(fetchSingleBlog(activeSlug))
                .unwrap()
                .then((blogData) => {
                    setBlog(blogData);
                });
        }
    }, [params, dispatch]);

    useEffect(() => {
        if(blog) {
            setPreviewUrl(`${PREVIEW_URLS[blog?.editor]}${params.slug}`);
            setBlogUrl(`${BLOGS_URLS[blog?.editor]}${params.slug}`);
        }
    }, [blog]);

    const publishBlog = () => {
        if(activeSlug) {
            blogApi.publishDraft(activeSlug).then(() => {
                toast.success("Blog published successfully!");
            })
        }
    }


    return (
        blog &&
        <div className='flex justify-between items-center mb-7'>
            <div className="flex items-center gap-2">
                {blog.iconImage && <CategoryIcon iconImage={blog.iconImage} size={40} />}
                <h3 className="text-3xl font-bold">
                    {blog.name}
                </h3>
            </div>
            <div className="flex justify-end gap-2">
                {!isdraft &&
                    <Link href={previewUrl} >
                        <Button
                            variant="primaryGhost"
                            size="xs"
                            rounded="rounded-lg"
                        >
                            <Eye className="w-3 h-3 mr-1" />
                            View Draft
                        </Button>
                    </Link>
                }

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

                {isdraft &&
                <>
                    <Link href={blogUrl} >
                        <Button
                            variant="primaryGhost"
                            size="xs"
                            rounded="rounded-lg"
                        >
                            <Eye className="w-3 h-3 mr-1" />
                            View Blog
                        </Button>
                    </Link>
                    <Button variant="primary" size="xs" onClick={publishBlog}>
                        <MdOutlinePublish size="16" className="mr-1" /> Publish
                    </Button>
                </>
                }
            </div>
        </div>
    )
}

export default BlogHeader
