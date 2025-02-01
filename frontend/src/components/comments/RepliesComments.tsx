import React, { useEffect, useState } from 'react'
import CommentsList from './CommentsList'
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { repliesComments } from '@/src/redux/slices/commentSlice';
import Button from '../Button';
import AddComment from './AddComment';

const RepliesComments = ({ commentId, blogId }: { commentId: string, blogId: string }) => {
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const comments = useAppSelector(state => state.comment.repliesComments[commentId]);
  const dispatch = useAppDispatch();

  console.log("replies", { comments });

  const handleShowEditor = () => {
    setShowEditor(!showEditor);
  }

  useEffect(() => {
    dispatch(repliesComments(commentId));
  }, [commentId, dispatch]);

  return (
    <div>
      <div className='mb-4'>
        <Button variant="primaryGhost" rounded="rounded-[20px]" size="xs" onClick={handleShowEditor} >Reply</Button>
        {showEditor && <AddComment blogId={blogId} parentId={commentId} handleShowEditor={handleShowEditor} />}
      </div>
      <CommentsList comments={comments} isparent={false} />
    </div>
  )
}

export default RepliesComments
