import React from 'react'
import { Category } from '@/src/types/types'
import Avatar from '../Avatar';
import FroalaContent from '../froalaEditor/FroalaContent';
import moment from 'moment';
import RepliesComments from './RepliesComments';

const CommentsList = ({ comments, isparent=true, blogId }: { comments: any, isparent?: boolean, blogId?: string }) => {
  console.log({ comments });
  return (
    comments && comments.length > 0 &&
    comments.map((comment: any) => (
      <div key={comment.id} className="flex gap-4 items-start mb-4">
        <div className="w-[48px]">
          <Avatar image={comment.user.image} size={48} />
        </div>
        <div className="w-[calc(100%-48px)]">
          <div className="flex gap-2 items-center">
            <p className='text-xl font-semibold'>{comment.user.name}</p>
            <p className="text-muted-foreground"><em>{moment(comment.updatedAt).fromNow()}</em></p>
          </div>
          <div className="mt-1">
            <FroalaContent content={comment.content} />

            {isparent && blogId && <RepliesComments commentId={comment.id} blogId={blogId} />}
          </div>
        </div>

      </div>
    ))
  )
}

export default CommentsList
