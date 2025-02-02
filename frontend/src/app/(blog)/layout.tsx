import React from 'react'
import BlogCategoriesWrapper from './BlogCategoriesWrapper'

interface Props {
    children: React.ReactNode
}
const Layout:React.FC<Props> = ({children}) => {

  return (
    <div className="flex min-h-[100vh]">
        <BlogCategoriesWrapper />
        <div className="w-full md:w-[calc(100vw-70px)]" >
          {children}
        </div>
    </div>
  )
}

export default Layout
