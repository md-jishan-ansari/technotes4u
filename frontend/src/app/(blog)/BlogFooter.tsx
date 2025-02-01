"use client";
import Button from '@/src/components/Button'
import CommentWrapper from '@/src/components/comments/CommentWrapper';
import { useAppSelector } from '@/src/redux/hooks';
import { Category, Editor } from '@/src/types/types';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const BLOGS_URLS: Record<Editor, string> = {
    [Editor.RichEditor]: '/blog/',
    [Editor.MdxEditor]: '/bigblog/'
}

const BlogFooter = ({ slug, isdraft=false }: { slug: string , isdraft?: boolean }) => {
  const [nextBlog, setNextBlog] = useState<Category | null>(null);
  const [blog, setBlog] = useState<Category | null>(null);
  const [previousBlog, setPreviousBlog] = useState<Category | null>(null);
  const { categorylist } = useAppSelector(state => state.blog);

  useEffect(() => {
    if (!categorylist || categorylist.length === 0) return;

    const currentBlogIndex = categorylist.findIndex((blog: Category) => blog.slug === slug);

    if (currentBlogIndex !== -1) {
      setBlog(categorylist[currentBlogIndex]);
      setNextBlog(categorylist[currentBlogIndex + 1] || null);

      if (currentBlogIndex > 1)
        setPreviousBlog(categorylist[currentBlogIndex - 1] || null);
    }

  }, [slug, categorylist]);

  return (
    <div>
      <div className="flex gap-4 items-center my-8">

        {previousBlog &&
          <Link href={`${BLOGS_URLS[previousBlog.editor]}${previousBlog.slug}`} className="w-full group">
            <Button
              variant='secondaryOutline'
              fullWidth
              size="lg"
            >
              <div className="flex gap-2 items-center justify-between w-full">
                <div className='w-[24px]'>
                  <FaChevronLeft className='group-hover:text-blue-600' />
                </div>
                <div className="text-sm text-right">
                  <p className='text-xs m-0'>Previous</p>
                  <p className='text-xl m-0 leading-7 line-clamp-1 group-hover:text-blue-600'>{previousBlog.name}</p>
                </div>
              </div>

            </Button>
          </Link>
        }


        {nextBlog &&
          <Link href={`${BLOGS_URLS[nextBlog.editor]}${nextBlog.slug}`}  className="w-full group">
            <Button
              variant='secondaryOutline'
              fullWidth
              size="lg"
            >
              <div className="flex gap-2 items-center justify-between w-full">
                <div className="text-sm text-left">
                  <p className='text-xs m-0'>Next</p>
                  <p className='text-xl m-0 leading-7 line-clamp-1 group-hover:text-blue-600'>{nextBlog.name}</p>
                </div>
                <div className='w-[24px]'>
                  <FaChevronRight className='group-hover:text-blue-600' />
                </div>
              </div>
            </Button>
          </Link>
        }

      </div>

      {!isdraft && blog && <CommentWrapper blog={blog} />}
    </div>
  )
}

export default BlogFooter