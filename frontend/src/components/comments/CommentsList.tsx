import React, { useState } from 'react'

import Comment from './Comment';

const CommentsList = ({ comments, depth=1, blogId }: { comments: any, depth?: number, blogId: string }) => {

  return (
    comments && comments.length > 0 &&
    comments.map((comment: any) => (
      <Comment comment={comment} depth={depth} blogId={blogId} />
    ))
  )
}

export default CommentsList
