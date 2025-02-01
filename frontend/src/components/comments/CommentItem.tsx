import { useState } from 'react'

import Avatar from '../Avatar';
import FroalaContent from '../froalaEditor/FroalaContent';
import moment from 'moment';
import RepliesComments from './RepliesComments';
import Button from '../Button';
import AddComment from './AddComment';
import { Comment } from '@/src/types/types';
import { FaAngleDown } from "react-icons/fa6";
import { useAppDispatch } from '@/src/redux/hooks';
import { repliesComments } from '@/src/redux/slices/commentSlice';
import { Accordion, AccordionContent, AccordionItem } from '@/src/componentsSadcn/ui/accordion';

const CommentItem = ({ comment, depth = 1, blogId }: { comment: Comment, depth?: number, blogId: string }) => {
    const [showReplyEditor, setShowReplyEditor] = useState(false);
    const [isRepliesOpen, setIsRepliesOpen] = useState(false);
    const dispatch = useAppDispatch();

    const toggleReplyEditor = () => setShowReplyEditor(prev => !prev);

    const handleRepliesClick = (commentId: string) => {
        if (!isRepliesOpen) {
            dispatch(repliesComments(commentId));
        }
        setIsRepliesOpen(!isRepliesOpen);
    };

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

                            <div className="flex gap-2 items-center">
                                <Button
                                    variant="primaryGhost"
                                    rounded="rounded-[20px]"
                                    size="xs"
                                    onClick={() => handleRepliesClick(comment.id)}
                                >
                                    <FaAngleDown
                                        size="16"
                                        className={`mr-1 transition-transform duration-200 ${isRepliesOpen ? 'rotate-180' : ''}`}
                                    />
                                    {comment._count.replies} Replies
                                </Button>

                                <Button
                                    variant="primaryGhost"
                                    rounded="rounded-[20px]"
                                    size="xs"
                                    onClick={toggleReplyEditor}
                                >
                                    Reply
                                </Button>
                            </div>

                            {showReplyEditor && (
                                <AddComment
                                    blogId={blogId}
                                    parentId={comment.id}
                                    handleShowEditor={toggleReplyEditor}
                                />
                            )}
                        </div>
                    )}

                    <Accordion type="single" collapsible value={isRepliesOpen ? comment.id : ""} className="border-none">
                        <AccordionItem value={comment.id} className="border-none">
                            <AccordionContent>
                                <RepliesComments
                                    commentId={comment.id}
                                    blogId={blogId}
                                    depth={depth}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    )
}

export default CommentItem
