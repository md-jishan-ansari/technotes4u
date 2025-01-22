"use client";
import Button from '@/src/components/Button'
import Container from '@/src/components/Container'
import FroalaEditor from '@/src/components/froalaEditor/FroalaEditor'
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
    const [blogContent, setBlogContent] = React.useState('');
    const searchParams = useSearchParams()
    let [blogId, setblogId] = useState(searchParams.get('blogid'));

    const handleblog = async (action: string) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/${action}/?blogId=${blogId}`, {
                content: blogContent,
            });
            console.log('Saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving blog:', error);
        }
    };

    useEffect(() => {
        if(blogId) {
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/getblog?blogId=${blogId}`)
            .then((res) => {
                setBlogContent(res.data.blog.draftContent);
            })
        }
    }, [blogId])

  return (
    <div>
        <div className="sticky top-0 left-0 flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-secondary text-sm">
            <Container>
                <nav className="w-full mx-auto sm:flex sm:items-center sm:justify-between">
                    <a className="flex-none font-semibold text-xl text-black focus:outline-none focus:opacity-80 dark:text-white" href="#" aria-label="Brand">Brand</a>
                    <div className="flex flex-row items-center gap-5 mt-5 pb-2 overflow-x-auto sm:justify-end sm:mt-0 sm:ps-5 sm:pb-0 sm:overflow-x-visible [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                        <Button variant="primary" size="sm" onClick={() => handleblog("save-to-draft")} > Save to Draft </Button>
                        <Button variant="primary" size="sm" onClick={() => handleblog("publish-draft")} > Publish </Button>
                        <Button variant="primary" size="sm" onClick={() => handleblog("unpublish-blog")} > Unpublish </Button>
                    </div>
                </nav>
            </Container>
        </div>
        <div className="prose dark:prose-invert lg:prose-xl fixed top-[110px] left-0 w-full overflow-auto max-w-full">
            <Container>
                <FroalaEditor blogContent={blogContent} setBlogContent={setBlogContent} />
            </Container>
        </div>
    </div>
  )
}

export default page
