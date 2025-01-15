import React from 'react'
import ActiveBlog from '../../ActiveBlog'

const Blog = ({params}: {params: {slug: string}}) => {

  return (
    <>
    <ActiveBlog slug={params.slug} />
    <div className="p-4">
    {params.slug}
    </div>
    </>
  )
}

export default Blog
