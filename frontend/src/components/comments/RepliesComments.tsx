import { useEffect } from 'react';
import CommentsList from './CommentsList'
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { repliesComments } from '@/src/redux/slices/commentSlice';

const RepliesComments = ({ commentId, blogId, depth }: { commentId: string, blogId: string, depth: number }) => {

  const comments = useAppSelector(state => state.comment.repliesComments[commentId]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(repliesComments(commentId));
  }, [commentId, dispatch]);

  if (!comments?.length) return null;

  return (
    <div className="mt-4">
      <CommentsList
        comments={comments}
        depth={depth+1}
        blogId={blogId}
      />
    </div>
  )
}

export default RepliesComments
