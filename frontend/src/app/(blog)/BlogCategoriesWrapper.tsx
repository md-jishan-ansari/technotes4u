"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { FaArrowRight } from "react-icons/fa";
import Button from '@/src/components/Button';
import BlogCategories from './BlogCategories';
import { useSelector } from 'react-redux';

const BlogCategoriesWrapper = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openCategories, setOpenCategories] = useState<string[]>([]);


  const { categories, loading, activeSlug } = useSelector((state: any) => state.blog);

  const activeParentMap = useMemo(() => {
    const parentMap = new Set<string>();

    const buildParentMap = (cats: any[], parentIds: string[] = []) => {
      for (const cat of cats) {
        if (cat.slug === activeSlug) {
          parentIds.forEach(id => parentMap.add(id));
          setOpenCategories(prev => [...prev, cat.id]);
          return true; // Found the active category, stop traversing
        }
        if (cat.children.length) {
          const found = buildParentMap(cat.children, [...parentIds, cat.id]);
          if (found) return true; // Propagate the "found" status up the recursion
        }
      }
      return false; // Active category not found in this branch
    };

    buildParentMap(categories);
    return parentMap;
  }, [categories, activeSlug]);

  useEffect(() => {
    if(categories ) {
      setOpenCategories(prev => [...prev, ...Array.from(activeParentMap)]);
    }
  }, [categories]);

  if (loading) {
    return <div className="text-center">Loading categories...</div>;
  }

  const toggelCategorySidebar = () => {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className="
          fixed
          top-[75px]
          z-5
          left-[-4px]
          md:hidden
          bg-opacity-50
          rounded-s-none
        "
        onClick={toggelCategorySidebar}
      >
        <FaArrowRight size={16} />
      </Button>


      <div className={`
        w-full
        md:min-w-[300px]
        md:max-w-[350px]
        h-[100vh]
        md:h-[calc(100vh-68px)]
        overflow-y-auto

        bg-background
        border
        border-t-0
        dark:border-neutral-700

        fixed
        z-[100]
        md:z-40
        md:sticky
        top-0
        md:top-[68px]
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
          <IoMdClose size="20" />
        </div>

        <div className="py-4 px-2">
          {categories.length > 0 &&
          <BlogCategories
            categories={categories}
            activeSlug={activeSlug}
            openCategories={openCategories}
            setOpenCategories={setOpenCategories}
            topLevel={true}
          />}
        </div>
      </div>
    </>
  )
}

export default BlogCategoriesWrapper
