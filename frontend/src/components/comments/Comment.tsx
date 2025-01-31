"use client";
import { Category } from '@/src/types/types'
import React, { useEffect } from 'react'
import AddComment from './AddComment'
import CommentsList from './CommentsList'
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { fetchCommnets } from '@/src/redux/slices/commentSlice';

const Comments = ({ blog }: { blog: Category }) => {
  const dispatch = useAppDispatch();
  const comments = useAppSelector(state => state.comment.blogComments[blog.id]);

  console.log({comments});

  useEffect(() => {
    dispatch(fetchCommnets(blog.id));
  }, [blog, dispatch]);

  return (
    <div>
      <AddComment blog={blog} />
      <div className="mt-4">
        <CommentsList comments={comments} />
      </div>
    </div>
  )
}

export default Comments
