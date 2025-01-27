"use client";

import { blogApi } from '@/src/redux/actions/services/api';
import dynamic from 'next/dynamic';

// CSS imports
// import 'froala-editor/css/froala_style.min.css';
// import 'froala-editor/css/froala_editor.pkgd.min.css';

// // Plugin imports
// import 'froala-editor/js/plugins/paragraph_format.min.js';
// import 'froala-editor/js/plugins/line_height.min.js';
// import 'froala-editor/js/plugins/word_paste.min.js';
// import 'froala-editor/js/plugins/fullscreen.min.js';
// import 'froala-editor/js/plugins/inline_style.min.js';
// import 'froala-editor/js/plugins/video.min.js';
// import 'froala-editor/js/plugins/font_family.min.js';
// import 'froala-editor/js/plugins/font_size.min.js';
// import 'froala-editor/js/plugins/colors.min.js';
// import 'froala-editor/js/plugins/image.min.js';
// import 'froala-editor/js/plugins/link.min.js';
// import 'froala-editor/js/plugins/lists.min.js';
// import 'froala-editor/js/plugins/align.min.js';
// import 'froala-editor/js/plugins/file.min.js';
// import 'froala-editor/js/plugins/table.min.js';

const FroalaEditorComponent = dynamic(
  () => import('react-froala-wysiwyg'),
  { ssr: false }
);

import React, { useEffect } from 'react'

const FroalaEditor = ({setBlogContent, blogContent}: any) => {

    useEffect(() => {
        // Load CSS and plugins only on the client side
        import('froala-editor/css/froala_style.min.css');
        import('froala-editor/css/froala_editor.pkgd.min.css');

        import('froala-editor/js/plugins/paragraph_format.min.js');
        import('froala-editor/js/plugins/line_height.min.js');
        import('froala-editor/js/plugins/word_paste.min.js');
        import('froala-editor/js/plugins/fullscreen.min.js');
        import('froala-editor/js/plugins/inline_style.min.js');
        import('froala-editor/js/plugins/video.min.js');
        import('froala-editor/js/plugins/font_family.min.js');
        import('froala-editor/js/plugins/font_size.min.js');
        import('froala-editor/js/plugins/colors.min.js');
        import('froala-editor/js/plugins/image.min.js');
        import('froala-editor/js/plugins/link.min.js');
        import('froala-editor/js/plugins/lists.min.js');
        import('froala-editor/js/plugins/align.min.js');
        import('froala-editor/js/plugins/file.min.js');
        import('froala-editor/js/plugins/table.min.js');

    }, []);

    return (
      <>
        <div className="mx-auto p-4">
          <FroalaEditorComponent
            tag="textarea"
            config={{
              placeholderText: "Start writing your content...",
              heightMin: 500,
              spellcheck: false,

              lineHeights: {
                "1": "1",
                "1.15": "1.15",
                "1.5": "1.5",
                "2": "2",
                "2.5": "2.5",
                "3": "3"
              },

              // Font Families
              fontFamily: {
                Poppins: "Poppins, sans-serif",
                Inter: "Inter",
                Arial: "Arial",
                "Courier New": "Courier New",
                Montserrat: "Montserrat, sans-serif",
                "Source Sans Pro": "Source Sans Pro, sans-serif",
                Lato: "Lato, sans-serif",
                "Fira Code": "Fira Code, monospace",
                Helvetica: "Helvetica",
                "Times New Roman": "Times New Roman",
                Verdana: "Verdana",
                Roboto: "Roboto",
                "Open Sans": "Open Sans",
                "SF Pro Display": "SF Pro Display, sans-serif",
              },
              fontFamilyDefaultSelection: "Arial",

              // Font Sizes
              fontSize: [
                "8",
                "10",
                "12",
                "14",
                "16",
                "18",
                "20",
                "24",
                "30",
                "36",
                "48",
                "60",
                "72",
                "96",
              ],

              // inlineStyles: {
              //   'Medium': 'font-weight: 500',
              //   'Bold': 'font-weight: 700',
              //   'Extra Bold': 'font-weight: 800',
              // },

            // Add paragraphFormat configuration
              paragraphFormat: {
                N: "Normal",
                H1: "Heading 1",
                H2: "Heading 2",
                H3: "Heading 3",
                H4: "Heading 4",
                H5: "Heading 5",
                H6: "Heading 6",
                PRE: 'Code'
              },

              // Toolbar Configuration
              toolbarButtons: {
                moreText: {
                  buttons: [
                    "paragraphFormat",
                    "fontFamily",
                    "fontSize",
                    "bold",
                    'lineHeight',
                    "italic",
                    "underline",
                    "strikeThrough",
                    "subscript",
                    "superscript",
                    "textColor",
                    "backgroundColor",
                    "clearFormatting",
                    "formatPre",
                  ],
                  align: "left",
                  buttonsVisible: 14,
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
                  buttonsVisible: 10,
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
                  buttonsVisible: 5,
                },
                moreMisc: {
                  buttons: ["fullscreen"],
                  align: "right",
                  buttonsVisible: 5,
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
                }
              },

              // Additional Features
              charCounterCount: true,
              attribution: false,
              quickInsertButtons: ["image", "table"],

              wordPasteModal: true,
              pastePlain: false,
              wordPasteKeepFormatting: true

            }}
            model={blogContent}
            onModelChange={setBlogContent}
          />
        </div>
      </>
    );
}

export default FroalaEditor
