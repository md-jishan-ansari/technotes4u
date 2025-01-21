import React from 'react'
import BlogCategoriesWrapper from './BlogCategoriesWrapper'
const Layout = ({children}: {children: React.ReactNode}) => {


  return (
    <div className="flex min-h-[100vh]">
        <BlogCategoriesWrapper />
        <div
          className="w-full
        md:w-[100vw-350px]
        md:ml-[350px]"
        >
            {children}
        </div>
    </div>
  )
}

export default Layout
