import CommentsList from './CommentsList'
import { useAppSelector } from '@/src/redux/hooks';

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
