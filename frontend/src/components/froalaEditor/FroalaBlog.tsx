"use client";
import { Blog } from '@/src/types/types';
import Link from 'next/link';
import React, { useEffect } from 'react'

const FroalaBlog = ({blog, slug}: {blog: Blog, slug?: string}) => {

    useEffect(() => {
        require('froala-editor/css/froala_style.min.css');
        require('froala-editor/css/froala_editor.pkgd.min.css');
    }, []);

    return (
        <div className="prose dark:prose-invert lg:prose-xl mx-auto p-4 w-full max-w-full">
            <div className="flex">
                    <Link className='ml-auto' href={`/admin/write/blog/?slug=${blog?.slug}`} >Edit</Link>
            </div>
            <div
                className="max-w-none fr-view"
                dangerouslySetInnerHTML={{ __html: blog?.content || "" }}
            />
        </div>
    )
}

export default FroalaBlog
