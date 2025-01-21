"use client";
import React, { useEffect, useState } from 'react'

const FroalaPage = () => {
    const [content, setContent] = useState('');

    useEffect(() => {
        const savedContent = localStorage.getItem('froalaContent');
        setContent(savedContent || '');

        require('froala-editor/css/froala_style.min.css');
        require('froala-editor/css/froala_editor.pkgd.min.css');


        require('froala-editor/js/plugins/paragraph_format.min.js');
        require('froala-editor/js/plugins/line_height.min.js');
        require('froala-editor/js/plugins/word_paste.min.js');
        require('froala-editor/js/plugins/fullscreen.min.js');
        require('froala-editor/js/plugins/inline_style.min.js');
        require('froala-editor/js/plugins/video.min.js');

        require('froala-editor/js/plugins/font_family.min.js');
        require('froala-editor/js/plugins/font_size.min.js');
        require('froala-editor/js/plugins/colors.min.js');
        require('froala-editor/js/plugins/image.min.js');
        require('froala-editor/js/plugins/link.min.js');
        require('froala-editor/js/plugins/lists.min.js');
        require('froala-editor/js/plugins/align.min.js');
        require('froala-editor/js/plugins/file.min.js');
        require('froala-editor/js/plugins/table.min.js');
    }, []);

    return (
        <div className="container mx-auto p-4">
            {/* Use dangerouslySetInnerHTML to render HTML content */}
            <div
                className="prose max-w-none fr-view"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    )
}

export default FroalaPage
