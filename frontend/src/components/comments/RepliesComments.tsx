import CommentsList from './CommentsList'
import { useAppSelector } from '@/src/redux/hooks';

const RepliesComments = ({ commentId, blogId, depth }: { commentId: string, blogId: string, depth: number }) => {

  const comments = useAppSelector(state => state.comment.repliesComments[commentId]);

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
