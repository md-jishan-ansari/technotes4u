"use client";
import React, { useEffect } from 'react'

const FroalaBlog = ({blogContent}: {blogContent: string, slug?: string}) => {

    useEffect(() => {
        // Load CSS and plugins only on the client side
        import('froala-editor/css/froala_style.min.css');
        import('froala-editor/css/froala_editor.pkgd.min.css');
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
