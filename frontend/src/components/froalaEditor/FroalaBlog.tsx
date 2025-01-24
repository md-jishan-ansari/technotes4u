"use client";
import Link from 'next/link';
import React, { useEffect } from 'react'

const FroalaBlog = ({blogContent, slug}: {blogContent: string, slug?: string}) => {

    useEffect(() => {
        require('froala-editor/css/froala_style.min.css');
        require('froala-editor/css/froala_editor.pkgd.min.css');
    }, []);

    return (
        <div className="prose dark:prose-invert lg:prose-xl w-full max-w-full">
            <div
                className="max-w-none fr-view"
                dangerouslySetInnerHTML={{ __html: blogContent || "" }}
            />
        </div>
    )
}

export default FroalaBlog
