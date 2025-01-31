"use client";
import React, { useEffect } from 'react'

const FroalaContent = ({ content }: { content: string }) => {

    useEffect(() => {
        // Load CSS and plugins only on the client side
        import('froala-editor/css/froala_style.min.css');
        import('froala-editor/css/froala_editor.pkgd.min.css');
    }, []);

    return (
        <div className='prose dark:prose-invert
                        prose-md //to make font large
                        prose-p:mt-0
                        prose-p:mb-3
                        leading-6
                        prose-blockquote:bg-accent/20
                        prose-blockquote:p-2
                        prose-blockquote:px-6
                        prose-blockquote:border-accent
                        prose-blockquote:not-italic
                        prose-blockquote:rounded-r-lg

                        prose-li:marker:text-accent
                        w-full
                        max-w-none
                      '>
            <div
                className="max-w-none fr-view"
                dangerouslySetInnerHTML={{ __html: content || "" }}
            />
        </div>
    )
}

export default FroalaContent
