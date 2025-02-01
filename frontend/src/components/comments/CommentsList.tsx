import React, { useState } from 'react'

import CommentItem  from './CommentItem';
import { Comment } from '@/src/types/types';

const CommentsList = ({ comments, depth=1, blogId }: { comments: Comment[], depth?: number, blogId: string }) => {
  if (!comments?.length) return null;

  return (
    <div className="space-y-4">
      {comments.map((comment: Comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          depth={depth}
          blogId={blogId}
        />
      ))}
    </div>
  );
}

export default CommentsList
