import React from 'react'
import BlogContent from '../BlogContent'

const Blog = ({params}: {params: {slug: string}}) => {

  return (
    <BlogContent slug={params.slug} />
  )
}

export default Blog

