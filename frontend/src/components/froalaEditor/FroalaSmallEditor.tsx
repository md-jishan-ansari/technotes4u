"use client";

import { blogApi } from '@/src/lib/actions/services/api';
import dynamic from 'next/dynamic';

const FroalaEditorComponent = dynamic(
  () => import('react-froala-wysiwyg'),
  { ssr: false }
);

import React, { useEffect, useState } from 'react'

const FroalaSmallEditor = ({setContent, content = "", placeholderText}: any) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);

      // Move the imports here since they should only run client-side
      if (typeof window !== 'undefined') {
        import('froala-editor/css/froala_style.min.css');
        import('froala-editor/css/froala_editor.pkgd.min.css');

        import('froala-editor/js/plugins/paragraph_format.min.js');
        import('froala-editor/js/plugins/word_paste.min.js');
        import('froala-editor/js/plugins/video.min.js');
        import('froala-editor/js/plugins/font_size.min.js');
        import('froala-editor/js/plugins/colors.min.js');
        import('froala-editor/js/plugins/image.min.js');
        import('froala-editor/js/plugins/link.min.js');
        import('froala-editor/js/plugins/lists.min.js');
        import('froala-editor/js/plugins/align.min.js');
        import('froala-editor/js/plugins/file.min.js');
        import('froala-editor/js/plugins/table.min.js');
      }
    }, []);

    if (!isClient) return null;

    return (
      <>
        <div className="w-full">
            <FroalaEditorComponent
              tag="textarea"
              config={{
                placeholderText: placeholderText,
                heightMin: 100,
                spellcheck: false,

                fontFamilyDefaultSelection: "Arial",

                // Font Sizes
                fontSize: [
                  "8",
                  "10",
                  "12",
                  "14",
                  "16",
                ],


                // Toolbar Configuration
                toolbarButtons: {
                  moreText: {
                    buttons: [
                      "fontSize",
                      "bold",
                      "italic",
                      "underline",
                      "subscript",
                      "superscript",
                      "textColor",
                      "backgroundColor",
                    ],
                    align: "left",
                    buttonsVisible: 4,
                  },
                  moreParagraph: {
                    buttons: [
                      "alignLeft",
                      "alignCenter",
                      "alignRight",
                      "alignJustify",
                      "formatOL",
                      "formatUL",
                      "outdent",
                      "indent",
                    ],
                    align: "left",
                    buttonsVisible: 4,
                  },
                  moreRich: {
                    buttons: [
                      "insertLink",
                      "insertImage",
                      "insertVideo",
                      "insertTable",
                      "insertHR",
                    ],
                    align: "left",
                    buttonsVisible: 1,
                  },
                },

                // Add paragraphFormatSelection: true to enable format selection
                paragraphFormatSelection: true,
                paragraphDefaultSelection: 'Normal',
                htmlAllowedTags: ['.*'],
                htmlAllowedAttrs: ['.*'],

                // Video configuration
                videoInsertButtons: ["videoByURL", "videoEmbed"],
                videoDefaultWidth: 640,
                videoDefaultHeight: 360,
                videoDefaultDisplay: "block",

                // Basic image upload
                imageUploadURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/upload-image`,
                imageUploadMethod: "POST",
                // Add image deletion handler
                events: {
                  'image.removed': function ($img: any) {
                    const imageUrl = $img.attr('src');

                    blogApi.deleteImage(imageUrl)
                    .then(response => {
                      console.log('Image deleted successfully:', response.data);
                    })
                    .catch(error => {
                      console.error('Error deleting image:', error);
                    });
                  },
                  'paste.beforeCleanup': function (clipboardHTML: string) {
                    if (!clipboardHTML.includes('urn:schemas-microsoft-com:office:')) {
                      // Convert em to px and limit size, then strip colors
                      return clipboardHTML
                        .replace(/font-size:\s*([0-9.]+)em/g, (match, size) => {
                          const pxSize = parseFloat(size) * 16; // convert em to px
                          return `font-size: ${Math.min(pxSize, 16)}px`;
                        })
                        .replace(/font-size:\s*(\d+)px/g, (match, size) => {
                          return parseInt(size) > 16 ? 'font-size: 16px' : match;
                        })
                        .replace(/(?:color|background-color):\s*[^;]+;/g, '');
                    }
                    return clipboardHTML;
                  },
                },

                // Additional Features
                charCounterCount: true,
                attribution: false,
                quickInsertButtons: ["image", "table"],

                pasteDeniedAttrs: ['style', 'color', 'background', 'background-color'],
                wordPasteModal: true,
                pastePlain: false,
                wordPasteKeepFormatting: true

              }}
              model={content}
              onModelChange={setContent}
            />
        </div>
      </>
    );
}

export default FroalaSmallEditor
