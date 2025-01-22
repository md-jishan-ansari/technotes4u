"use client";
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const FroalaBlog = ({blogtype, slug}: {blogtype: string, slug?: string}) => {
    const [blog, setBlog] = useState<any>();

    useEffect(() => {
        require('froala-editor/css/froala_style.min.css');
        require('froala-editor/css/froala_editor.pkgd.min.css');
    }, []);

    useEffect(() => {
        if(slug) {
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/getblog?slug=${slug}`)
            .then((res) => {
                setBlog(res.data.blog);
            })
        }
    }, [slug])

    return (
        <div className="prose dark:prose-invert lg:prose-xl mx-auto p-4 w-full max-w-full">
            <h1>{blog?.name}</h1>
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
