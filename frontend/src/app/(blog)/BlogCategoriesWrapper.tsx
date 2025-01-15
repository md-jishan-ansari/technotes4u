"use client"
import React, { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { FaArrowRight } from "react-icons/fa";
import Button from '@/src/components/Button';
import BlogCategories from './BlogCategories';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '@/src/redux/slices/blogSlice';

const BlogCategoriesWrapper = () => {
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useDispatch();

  const { categories, loading, activeSlug } = useSelector((state: any) => state.blog);


  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center">Loading categories...</div>;
  }

  console.log({ categories });

  const toggelCategorySidebar = () => {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <Button
        variant="secondary"
        className="
          fixed
          top-[75px]
          left-[-4px]
          z-5
          opacity-50
          md:hidden
        "
        onClick={toggelCategorySidebar}
      >
        <FaArrowRight size={24} />
      </Button>


      <div className={`
        w-full
        md:min-w-[300px]
        md:max-w-[350px]
        md:sticky top-[68px]
        h-[calc(100vh-68px)]

        overflow-y-auto
        border
        border-t-0
        dark:border-neutral-700

        fixed
        transition-[left]
        duration-300
        max-w-[450px]

        flex
        flex-col

        ${isOpen ?
          " left-[0%]"
          : "left-[-100%]"
        }

    `}>
        <div className="
          text-gray-600 hover:text-gray-800 cursor-pointer md:hidden
          sticky
          top-[10px]
          right-[10px]
          ml-auto
          "
          onClick={toggelCategorySidebar}
        >
          <IoMdClose size="24" />
        </div>

        <div className="py-4 px-2">
          {categories.length > 0 && <BlogCategories categories={categories} activeSlug={activeSlug} topLevel={true} />}
        </div>
      </div>
    </>
  )
}

export default BlogCategoriesWrapper
