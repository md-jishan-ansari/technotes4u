import React from 'react'
import BlogCategoriesWrapper from './BlogCategoriesWrapper'

interface Props {
    children: React.ReactNode
}
const Layout:React.FC<Props> = ({children}) => {

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
