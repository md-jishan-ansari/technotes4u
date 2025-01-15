import React from 'react'
import BlogCategoriesWrapper from './BlogCategoriesWrapper'
const Layout = ({children}: {children: React.ReactNode}) => {


  return (
    <div className="flex min-h-[100vh]">
        <BlogCategoriesWrapper />
        <div className="h-[300vh]">
            {children}
        </div>
    </div>
  )
}

export default Layout
