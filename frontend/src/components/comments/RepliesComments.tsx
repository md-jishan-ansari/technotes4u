import React, { useEffect, useState } from 'react'
import CommentsList from './CommentsList'
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { repliesComments } from '@/src/redux/slices/commentSlice';
import Button from '../Button';
import AddComment from './AddComment';

const RepliesComments = ({ commentId, blogId, depth }: { commentId: string, blogId: string, depth: number }) => {

  const comments = useAppSelector(state => state.comment.repliesComments[commentId]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(repliesComments(commentId));
  }, [commentId, dispatch]);

  return (
    <div>
      <CommentsList comments={comments} depth={depth+1} blogId={blogId} />
    </div>
  )
}

export default RepliesComments
