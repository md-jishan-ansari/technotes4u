"use client";
import React, { useEffect, useState } from 'react'

const FroalaBlog = () => {
    const [content, setContent] = useState('');

    useEffect(() => {
        require('froala-editor/css/froala_style.min.css');
        require('froala-editor/css/froala_editor.pkgd.min.css');

        const savedContent = localStorage.getItem('froalaContent');
        setContent(savedContent || '');
    }, []);

    return (
        <div className="mx-auto p-4 w-full">
            <div
                className="prose max-w-none fr-view"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    )
}

export default FroalaBlog
