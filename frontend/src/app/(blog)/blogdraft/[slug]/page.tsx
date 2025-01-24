import React from 'react'
import BlogContent from '../BlogDraftContent'

const Blog = ({params}: {params: {slug: string}}) => {

  return (
    <BlogContent slug={params.slug} />
  )
}

export default Blog
