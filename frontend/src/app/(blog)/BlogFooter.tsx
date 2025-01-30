"use client";
import Button from '@/src/components/Button'
import { useAppSelector } from '@/src/redux/hooks';
import { Blog, Category, Editor } from '@/src/types/types';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const BLOGS_URLS: Record<Editor, string> = {
    [Editor.RichEditor]: '/blog/',
    [Editor.MdxEditor]: '/bigblog/'
}

const BlogFooter = ({ slug }: { slug: string }) => {
  const [nextBlog, setNextBlog] = useState<Category | null>(null);
  const [previousBlog, setPreviousBlog] = useState<Category | null>(null);
  const { categorylist } = useAppSelector(state => state.blog);

  useEffect(() => {
    const currentBlogIndex = categorylist.findIndex((blog: Category) => blog.slug === slug);

    if (currentBlogIndex !== -1) {
      setNextBlog(categorylist[currentBlogIndex + 1] || null);

      if (currentBlogIndex > 1)
        setPreviousBlog(categorylist[currentBlogIndex - 1] || null);
    }
  }, [slug]);

  return (
    <div>
      <div className="flex gap-4 items-center mt-8">

        {previousBlog &&
          <Link href={`${BLOGS_URLS[previousBlog.editor]}${previousBlog.slug}`} className="w-[50%]">
            <Button
              variant='secondaryOutline'
              fullWidth
              size="lg"
            >
              <div className="flex gap-2 items-center justify-between w-full">
                <div className='w-[24px]'>
                  <FaChevronLeft />
                </div>
                <div className="text-sm text-right">
                  <p className='text-xs m-0'>Previous</p>
                  <p className='text-xl m-0 leading-7 line-clamp-1'>{previousBlog.name}</p>
                </div>
              </div>

            </Button>
          </Link>
        }


        {nextBlog &&
          <Link href={`${BLOGS_URLS[nextBlog.editor]}${nextBlog.slug}`}  className="w-[50%] ml-auto">
            <Button
              variant='secondaryOutline'
              fullWidth
              size="lg"
            >
              <div className="flex gap-2 items-center justify-between w-full">
                <div className="text-sm text-left">
                  <p className='text-xs m-0'>Next</p>
                  <p className='text-xl m-0 leading-7 line-clamp-1'>{nextBlog.name}</p>
                </div>
                <div className='w-[24px]'>
                  <FaChevronRight />
                </div>
              </div>
            </Button>
          </Link>
        }

      </div>
    </div>
  )
}

export default BlogFooter