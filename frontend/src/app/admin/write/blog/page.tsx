"use client";
import React, { useEffect, useState, useCallback  } from 'react'
import dynamic from "next/dynamic";
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

import Button from '@/src/components/Button'
import Container from '@/src/components/Container'
import FroalaEditor from '@/src/components/froalaEditor/FroalaEditor'
import { Blog, Editor } from '@/src/types/types'
import { blogApi } from '@/src/redux/actions/services/api'
import { useAppDispatch } from '@/src/redux/hooks';
import { fetchSingleBlog } from '@/src/redux/slices/blogSlice';
import { MdOutlinePublish, MdOutlineUnpublished, MdDrafts, MdOutlineRemoveRedEye  } from "react-icons/md";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/src/componentsSadcn/ui/select"

const MDEditor = dynamic(
    () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
    {
      ssr: false,
      loading: () => <div>Loading editor...</div> // Add a loading state
    }
  );

const PREVIEW_URLS = {
    [Editor.RichEditor]: '/blogdraft/',
    [Editor.MdxEditor]: '/bigblogdraft/'
}

interface BlogContext {
    editor: Editor;
    draftContent?: string;
    content?: string;
    mdxdraftContent?: string;
    mdxcontent?: string;
    isPublished?: boolean;
}

type BlogAction = 'save-to-draft' | 'publish-draft' | 'unpublish-blog'

const EditorActions = React.memo(({ onAction, isLoading }: {
    onAction: (action: BlogAction) => void
    isLoading: boolean
}) => (
    <div className="flex items-center gap-3">
        <Button variant="primary" size="sm" onClick={() => onAction('save-to-draft')} disabled={isLoading}>
            <MdDrafts size="16" className="mr-1" /> Save to Draft
        </Button>
        <Button variant="primary" size="sm" onClick={() => onAction('publish-draft')} disabled={isLoading}>
            <MdOutlinePublish size="16" className="mr-1" /> Publish
        </Button>
        <Button variant="danger" size="sm" onClick={() => onAction('unpublish-blog')} disabled={isLoading}>
            <MdOutlineUnpublished size="16" className="mr-1" /> Unpublish
        </Button>
    </div>
))
EditorActions.displayName = 'EditorActions'

const WriteBlogPage = () => {
    const [editor, setEditor] = useState<Editor>(Editor.RichEditor);
    const [blog, setBlog] = useState<Blog | null>(null);
    const [blogContent, setBlogContent] = React.useState('');
    const [blogMdxContent, setBlogMdxContent] = React.useState('');
    const [previewUrl, setPreviewUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams()
    const [slug, setSlug] = useState<string | null>(searchParams.get('slug') || "");
    const dispatch = useAppDispatch();

    useEffect(() => {
        setSlug(searchParams.get('slug') || "");
    }, [searchParams])

    useEffect(() => {
        setPreviewUrl(`${PREVIEW_URLS[editor]}${slug}`)
    }, [editor]);


    // Add this handler function
    const handleSelectEditor = useCallback((value: string) => {
        setEditor(value as Editor)
    }, [])

    const debouncedHandleMdxContentChange = useCallback(
        debounce((value: string) => {
            setBlogMdxContent(value)
        }, 300),
        []
    )

    // Separate function to handle MDX publishing
    const handleMdxPublish = async (slug: string, blogMdxContent: string) => {
        const response = await axios.post('/api/create-mdx-blog', {
            slug,
            value: blogMdxContent,
        });
        toast.success('MDX content saved successfully');
        return response;
    };

    // Create blog context based on action
    const createBlogContext = (action: BlogAction, content: string, editor: Editor): BlogContext => {
        const blogContext: BlogContext = { editor };

        switch (action) {
            case 'save-to-draft':
                blogContext.draftContent = content;
                break;
            case 'publish-draft':
                blogContext.draftContent = content;
                blogContext.content = content;
                blogContext.isPublished = true;
                break;
            case 'unpublish-blog':
                blogContext.isPublished = false;
                break;
        }
        return blogContext;
    };

    // Create MDX blog context based on action
    const createMdxBlogContext = (action: BlogAction, mdxContent: string, editor: Editor): BlogContext => {
        const blogContext: BlogContext = { editor };

        switch (action) {
            case 'save-to-draft':
                blogContext.mdxdraftContent = mdxContent;
                break;
            case 'publish-draft':
                blogContext.mdxdraftContent = mdxContent;
                blogContext.mdxcontent = mdxContent;
                blogContext.isPublished = true;
                break;
            case 'unpublish-blog':
                blogContext.isPublished = false;
                break;
        }
        return blogContext;
    };

    // Enhanced mdxEditorSubmit with better error handling
    const mdxEditorSubmit = async (action: BlogAction, slug: string, blogMdxContent: string, editor: Editor) => {
        if (!blogMdxContent) {
            toast.error('No content to save');
            return;
        }

        try {
            if (!slug) return;

            const blogContext = createMdxBlogContext(action, blogMdxContent, editor);
            await blogApi.updateBlog(slug, blogContext);

            if (action === 'publish-draft') {
                await handleMdxPublish(slug, blogMdxContent);
            }
        } catch (error) {
            console.error('Error handling MDX content:', error);
            toast.error('Failed to save MDX content');
            throw error;
        }
    };

    // Enhanced handleblog function
    const handleblog = useCallback(async (action: BlogAction) => {
        if (!slug) return;

        setIsLoading(true);
        try {
            if (editor === Editor.MdxEditor) {
                await mdxEditorSubmit(action, slug, blogMdxContent, editor);
            } else {
                const blogContext = createBlogContext(action, blogContent, editor);
                await blogApi.updateBlog(slug, blogContext);
                toast.success('Action completed successfully');
            }
        } catch (error: any) {
            toast.error(error.message);
            console.error('Error handling blog:', error);
        } finally {
            setIsLoading(false);
        }
    }, [slug, blogContent, blogMdxContent, editor]);

    const fetchBlogContent = useCallback(async () => {
        if (!slug) return

        try {
            const blogData = await dispatch(fetchSingleBlog(slug)).unwrap()
            setEditor(blogData.editor)
            setBlog(blogData)
            setBlogContent(blogData.draftContent)
        } catch (error) {
            toast.error('Failed to fetch blog content')
            console.error('Error fetching blog:', error)
        }
    }, [slug, dispatch])

    useEffect(() => {
        fetchBlogContent()
    }, [fetchBlogContent])

  return (
    <div>
        <div className="sticky top-0 left-0 flex flex-wrap sm:justify-start sm:flex-nowrap w-full text-sm">
            <Container>
                <nav className="w-full mx-auto sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <p className='text-lg font-semibold max-w-[500px] line-clamp-1'>{blog?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Select onValueChange={handleSelectEditor} value={editor}>
                            <SelectTrigger className="w-[180px] border-black dark:border-white">
                                <SelectValue placeholder="Select Editor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Editors</SelectLabel>
                                    <SelectItem value={Editor.RichEditor}>Rich Editor</SelectItem>
                                    <SelectItem value={Editor.MdxEditor}>MDX Editor</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Link target="_blank" href={previewUrl}>
                            <Button variant="primaryGhost" size="sm" >
                                <MdOutlineRemoveRedEye size="16" className="mr-1" />
                                Preview Draft
                            </Button>
                        </Link>
                        <EditorActions onAction={handleblog} isLoading={isLoading} />
                    </div>
                </nav>
            </Container>
        </div>
        <div className="prose dark:prose-invert lg:prose-xl fixed top-[110px] left-0 w-full overflow-auto max-w-full">
            <Container>
                {editor === Editor.RichEditor ? (
                    <FroalaEditor blogContent={blogContent} setBlogContent={setBlogContent} />
                ) : (
                    <MDEditor
                        value={blogMdxContent}
                        enablePreview={false}
                        onChange={debouncedHandleMdxContentChange}
                        style={{ width: "100%", height: "80vh" }}
                    />
                )}
            </Container>
        </div>
    </div>
  )
}

export default WriteBlogPage


// The debounce function in this code is used to optimize performance when handling changes to the MDX editor content. Here's what it does:

// The debouncedHandleMdxContentChange callback wraps the setBlogMdxContent state update in a debounce function with a 300ms delay. This means:

    //1. When a user types in the MDX editor, instead of updating the state on every single keystroke
    //2. It waits until the user stops typing for 300 milliseconds
    //3. Only then does it update the blogMdxContent state with the latest value