import { useState } from 'react'

import Avatar from '../Avatar';
import FroalaContent from '../froalaEditor/FroalaContent';
import moment from 'moment';
import RepliesComments from './RepliesComments';
import Button from '../Button';
import AddComment from './AddComment';
import { Comment } from '@/src/types/types';

const CommentItem = ({ comment, depth = 1, blogId }: {comment: Comment, depth?: number, blogId: string}) => {
    const [showReplyEditor, setShowReplyEditor] = useState(false);

    const toggleReplyEditor = () => setShowReplyEditor(prev => !prev);

    return (
        <div className="flex gap-4 items-start mb-4">

            <div className="w-[48px]">
                <Avatar image={comment.user.image} size={48} />
            </div>

            <div className="flex-grow w-[calc(100%-48px)]">
                <div className="flex gap-2 items-center">
                    <p className='text-xl font-semibold'>{comment.user.name}</p>
                    <p className="text-muted-foreground">
                        <em>{moment(comment.updatedAt).fromNow()}</em>
                    </p>
                </div>
                <div className="mt-1 space-y-3">
                    <FroalaContent content={comment.content} />

                    {depth <= 2 && (
                        <div>
                            <Button
                                variant="primaryGhost"
                                rounded="rounded-[20px]"
                                size="xs"
                                onClick={toggleReplyEditor}
                            >
                                Reply
                            </Button>

                            {showReplyEditor && (
                                <AddComment
                                    blogId={blogId}
                                    parentId={comment.id}
                                    handleShowEditor={toggleReplyEditor}
                                />
                            )}
                        </div>
                    )}

                    <RepliesComments
                        commentId={comment.id}
                        blogId={blogId}
                        depth={depth}
                    />
                </div>
            </div>
        </div>
    )
}

export default CommentItem
