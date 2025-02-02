import { LuCornerDownRight } from 'react-icons/lu';
import Button from '../Button';
import CommentsList from './CommentsList'
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { repliesComments } from '@/src/redux/slices/commentSlice';

const RepliesComments = ({ commentId, blogId, depth }: { commentId: string, blogId: string, depth: number }) => {
  const dispatch = useAppDispatch();
  const repliesData = useAppSelector(state => state.comment.repliesComments[commentId]);

  if (!repliesData?.replies) return null;

  const handleShowMore = () => {
    const nextStart = repliesData.start + 3;
    dispatch(repliesComments({ commentId, start: nextStart }));
  };

  return (
    <div className="mt-4">
      <CommentsList
        comments={repliesData.replies}
        depth={depth+1}
        blogId={blogId}
      />

      <Button
          variant='primaryGhost'
          size="xs"
          rounded="rounded-full"
          onClick={handleShowMore}
        >
        <LuCornerDownRight className='mr-1' /> Show more comments
      </Button>
    </div>
  )
}

export default RepliesComments
