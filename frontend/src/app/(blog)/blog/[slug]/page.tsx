import React from 'react'
import ActiveBlog from '../../ActiveBlog'
import FroalaBlog from '@/src/components/froalaEditor/FroalaBlog'

const Blog = ({params}: {params: {slug: string}}) => {

  return (
    <>
      <ActiveBlog slug={params.slug} /> {/* This is only for setting active blog slug to states or anyting else data which is needed for the blog page */}


      <div className="p-4">
        <FroalaBlog blogtype="blog" slug={params?.slug} />
      </div>
    </>
  )
}

export default Blog
