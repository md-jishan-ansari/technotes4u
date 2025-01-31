import React from 'react'
import { Category } from '@/src/types/types'
import Avatar from '../Avatar';
import FroalaContent from '../froalaEditor/FroalaContent';
import moment from 'moment';

const CommentsList = ({ comments }: { comments: any }) => {
  console.log({ comments });
  return (
    comments &&
    comments.map((comment: any) => (
      <div key={comment.id} className="flex gap-4 items-start mb-2">
        <div className="w-[52px]">
          <Avatar image={comment.user.image} size={52} />
        </div>
        <div className="w-[calc(100%-52px)]">
          <div className="flex gap-2 items-center">
            <p className='text-xl font-semibold'>{comment.user.name}</p>
            <p className="text-muted-foreground"><em>{moment(comment.updatedAt).fromNow()}</em></p>
          </div>
          <div className="mt-1">
            <FroalaContent content={comment.content} />
          </div>
        </div>

      </div>
    ))
  )
}

export default CommentsList
