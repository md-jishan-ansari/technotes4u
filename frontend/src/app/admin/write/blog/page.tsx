"use client";
import Button from '@/src/components/Button'
import Container from '@/src/components/Container'
import FroalaEditor from '@/src/components/froalaEditor/FroalaEditor'
import { Blog, Editor } from '@/src/types/types'
import { blogApi } from '@/src/redux/actions/services/api'
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useCallback  } from 'react'
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/src/redux/hooks';
import { fetchSingleBlog } from '@/src/redux/slices/blogSlice';
import Link from 'next/link';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/src/componentsSadcn/ui/select"

interface ApiErrorResponse {
    message: string;
}

interface BlogContext {
    editor: Editor;
    draftContent?: string;
    content?: string;
    isPublished?: boolean;
}


const WriteBlogPage = () => {
    const [editor, setEditor] = useState<Editor>(Editor.RichEditor);
    const [blog, setBlog] = useState<Blog | null>(null);
    const [blogContent, setBlogContent] = React.useState('');
    const searchParams = useSearchParams()
    let [slug, setSlug] = useState<string | null>(searchParams.get('slug'));
    const dispatch = useAppDispatch();

    useEffect(() => {
        setSlug(searchParams.get('slug'));
    }, [searchParams])

    // Add this handler function
    const handleSelectEditor = (value: string) => {
        setEditor(value as Editor);
    };


    const handleblog = useCallback(async (action: 'save-to-draft' | 'publish-draft' | 'unpublish-blog') => {
        if (!slug) return;

        try {
            let response;
            let blogContext:BlogContext = {
                editor,
            };
            switch (action) {
                case 'save-to-draft':
                    blogContext["draftContent"] = blogContent;
                    break;
                case 'publish-draft':
                    blogContext["draftContent"] = blogContent;
                    blogContext["content"] = blogContent;
                    break;
                case 'unpublish-blog':
                    blogContext["isPublished"] = false;
                    break;
            }

            response = await blogApi.updateBlog(slug, blogContext);

            toast.success('Action completed successfully');
        } catch (error: any) {
            toast.error(error.message);
            console.error('Error handling blog:', error);
        }
    }, [slug, blogContent]);

    const fetchBlogContent = useCallback(async () => {
        if (!slug) return;

        try {

            dispatch(fetchSingleBlog(slug))
                    .unwrap()
                    .then((blogData) => {
                        setEditor(blogData.editor);
                        setBlog(blogData);
                        setBlogContent(blogData.draftContent);
                    }
                );

        } catch (error) {
            toast.error('Failed to fetch blog content');
            console.error('Error fetching blog:', error);
        }
    }, [slug]);

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
                        <Link target="_blank" href={`/blogdraft/${slug}`}>
                            <Button variant="primaryGhost" size="sm" >
                                Preview Draft
                            </Button>
                        </Link>
                        <Button variant="primary" size="sm" onClick={() => handleblog("save-to-draft")} > Save to Draft </Button>
                        <Button variant="primary" size="sm" onClick={() => handleblog("publish-draft")} > Publish </Button>
                        <Button variant="danger" size="sm" onClick={() => handleblog("unpublish-blog")} > Unpublish </Button>
                    </div>
                </nav>
            </Container>
        </div>
        <div className="prose dark:prose-invert lg:prose-xl fixed top-[110px] left-0 w-full overflow-auto max-w-full">
            <Container>
                {editor === Editor.RichEditor ? (
                    <FroalaEditor blogContent={blogContent} setBlogContent={setBlogContent} />
                ) : (
                    <div>MDX Editor</div>
                )}
            </Container>
        </div>
    </div>
  )
}

export default WriteBlogPage
