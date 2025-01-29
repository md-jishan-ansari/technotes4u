import React from 'react'
import BlogContent from '../../blog/BlogContent'

const Blog = ({params}: {params: {slug: string}}) => {

  return (
    <BlogContent slug={params.slug} isdraft={true} />
  )
}

export default Blog
