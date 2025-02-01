"use client";
import { Category } from '@/src/types/types'
import React, { useEffect } from 'react'
import AddComment from './AddComment'
import CommentsList from './CommentsList'
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { fetchCommnets } from '@/src/redux/slices/commentSlice';

const CommentWrapper = ({ blog }: { blog: Category }) => {
  const dispatch = useAppDispatch();
  const comments = useAppSelector(state => state.comment.blogComments[blog.id]);
  const {totalComments, blogCommentsCount} = useAppSelector(state => state.comment);

  useEffect(() => {
    dispatch(fetchCommnets(blog.id));
  }, [blog.id, dispatch]);

  return (
    <div className="space-y-4">
      <h3 className='text-2xl mb-3'>
        <span className='font-semibold'>{totalComments}</span> Total Comments
      </h3>
      <AddComment blogId={blog.id} />

      <h3 className='text-2xl mb-3'>
        <span className='font-semibold'>{blogCommentsCount}</span> Comments
      </h3>

      <CommentsList comments={comments} blogId={blog.id} />

    </div>
  )
}

export default CommentWrapper
