import { LuCornerDownRight } from 'react-icons/lu';
import Button from '../Button';
import CommentsList from './CommentsList'
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { repliesComments } from '@/src/redux/slices/commentSlice';

const LatestRepliesComments = ({ commentId, blogId }: { commentId: string, blogId: string }) => {
    const latestRepliesComments = useAppSelector(state => state.comment.latestRepliesComments[commentId]);

    if (!latestRepliesComments?.length) return null;

    return (
        <div className="mt-4">
            <CommentsList
                comments={latestRepliesComments}
                depth={10}
                blogId={blogId}
            />
        </div>
    )
}

export default LatestRepliesComments
