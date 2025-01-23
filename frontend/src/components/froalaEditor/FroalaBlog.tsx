"use client";
import { useAppDispatch } from '@/src/redux/hooks';
import { fetchActiveBlog } from '@/src/redux/slices/blogSlice';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const FroalaBlog = ({blogtype, slug}: {blogtype: string, slug?: string}) => {
    const [blog, setBlog] = useState<any>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        require('froala-editor/css/froala_style.min.css');
        require('froala-editor/css/froala_editor.pkgd.min.css');
    }, []);

    useEffect(() => {
        if(slug) {
            dispatch(fetchActiveBlog(slug))
                .unwrap()
                .then((blogData) => {
                    setBlog(blogData);
                });
        }
    }, [slug, dispatch]);

    return (
        <div className="prose dark:prose-invert lg:prose-xl mx-auto p-4 w-full max-w-full">
            <div className="flex">
                    <Link className='ml-auto' href={`/admin/write/blog/?blogid=${blog?.id}`} >Edit</Link>
            </div>
            <div
                className="max-w-none fr-view"
                dangerouslySetInnerHTML={{ __html: blog?.content }}
            />
        </div>
    )
}

export default FroalaBlog
