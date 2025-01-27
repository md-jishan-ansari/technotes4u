"use client"
import React, { useEffect, useMemo, useState, Suspense, useCallback } from 'react'
import { IoMdClose } from 'react-icons/io'
import { FaArrowRight } from "react-icons/fa";
import Button from '@/src/components/Button';

import { ErrorBoundary } from 'react-error-boundary'
import { useAppSelector } from '@/src/redux/hooks';

import { useParams } from 'next/navigation'

const BlogCategories = React.lazy(() => import('./BlogCategories'))
const MemoizedBlogCategories = React.memo(BlogCategories)

const SIDEBAR_WIDTH = 'md:w-[350px]'
const SIDEBAR_MAX_WIDTH = 'max-w-[450px]'

const sidebarBaseClasses = `
  w-full ${SIDEBAR_WIDTH} ${SIDEBAR_MAX_WIDTH}
  h-[100vh] overflow-y-auto
  bg-background border border-t-0
  dark:border-neutral-700
  fixed z-[100] md:z-40
  top-0 let-0
  pt-0 md:pt-[68px]
  transition-[left] duration-300
  flex flex-col
`

// Error Fallback
const ErrorFallback = () => (
  <div className="text-center text-red-500">Error loading categories</div>
)

// Loading Fallback
const LoadingFallback = () => (
  <div className="text-center">Loading categories...</div>
)


const BlogCategoriesWrapper = () => {
  const params = useParams()
  const [isOpen, setIsOpen] = useState(true);
  const [activeSlug, setActiveSlug] = useState<string | null>(
    typeof params.slug === 'string' ? params.slug : null
  );
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const { categories } = useAppSelector(state => state.blog);

  const activeParentMap = useMemo(() => {
    const parentMap = new Set<string>()

    const buildParentMap = (cats: any[], parentIds: Set<string> = new Set()) => {
      for (const cat of cats) {
        if (cat.slug === activeSlug) {
          parentIds.forEach(id => parentMap.add(id))
          setOpenCategories(prev => [...prev, cat.id])
          return true
        }
        if (cat.children.length) {
          const newParentIds = new Set(parentIds).add(cat.id)
          if (buildParentMap(cat.children, newParentIds)) return true
        }
      }
      return false
    }

    buildParentMap(categories)
    return parentMap
  }, [categories, activeSlug])

  useEffect(() => {
    setActiveSlug(typeof params.slug === 'string' ? params.slug : null);
  }, [params])

  useEffect(() => {
    if (categories) {
      setOpenCategories(prev => {
        const newSet = new Set([...prev, ...Array.from(activeParentMap)])
        return Array.from(newSet)
      })
    }
  }, [categories, activeParentMap])

  const toggleCategorySidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const categoriesContent = useMemo(() => (
    categories.length > 0 && (
      <Suspense fallback={<LoadingFallback />}>
        <MemoizedBlogCategories
          categories={categories}
          activeSlug={activeSlug}
          openCategories={openCategories}
          setOpenCategories={setOpenCategories}
          topLevel={true}
        />
      </Suspense>
    )
  ), [categories, activeSlug, openCategories]);


  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>

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
            onClick={toggleCategorySidebar}
          >
            <FaArrowRight size={16} />
          </Button>

          <div className={`
            ${sidebarBaseClasses}
            ${isOpen ? "left-[0%]" : "left-[-100%] md:left-[0%]"}
          `}>
            <div
              className="
                text-gray-600 hover:text-gray-800
                cursor-pointer md:hidden
                sticky top-[10px] right-[10px]
                ml-auto
              "
              onClick={toggleCategorySidebar}
            >
              <IoMdClose size="20" />
            </div>

            <div className="py-4 px-2">
              {categoriesContent}
            </div>
          </div>
        </>
    </ErrorBoundary>
  )
}

export default React.memo(BlogCategoriesWrapper)


{/* <ErrorBoundary FallbackComponent={ErrorFallback}>
    Error Boundaries act as a JavaScript catch block for React components. When a child component throws an error, instead of crashing the whole app, the ErrorBoundary catches it and displays the FallbackComponent (in this case, our ErrorFallback component that shows "Error loading categories"). */}

// const BlogCategories = React.lazy(() => import('./BlogCategories'))
    // This is code-splitting in action. React.lazy() enables dynamic imports, meaning BlogCategories component will only be loaded when it's actually needed, reducing the initial bundle size. While it's loading, the Suspense component shows the LoadingFallback ("Loading categories...").

// const MemoizedBlogCategories = React.memo(BlogCategories)
    // This is a performance optimization. React.memo() creates a memoized version of BlogCategories that only re-renders when its props change. It's particularly useful for this sidebar component since it prevents unnecessary re-renders when parent components update but the categories data hasn't changed.


// Suspense
    // When MemoizedBlogCategories is loading (remember it's lazily loaded with React.lazy()), Suspense will automatically show the LoadingFallback component ("Loading categories..."). Once the component finishes loading, Suspense seamlessly swaps in the actual MemoizedBlogCategories component with all its props.