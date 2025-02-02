import { useState } from 'react'

import Avatar from '../Avatar';
import FroalaContent from '../froalaEditor/FroalaContent';
import moment from 'moment';
import RepliesComments from './RepliesComments';
import Button from '../Button';
import AddComment from './AddComment';
import { Comment } from '@/src/types/types';
import { FaAngleDown } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { repliesComments } from '@/src/redux/slices/commentSlice';
import { Accordion, AccordionContent, AccordionItem } from '@/src/componentsSadcn/ui/accordion';
import LatestRepliesComments from './LatestRepliesComments';

const CommentItem = ({ comment, depth = 1, blogId }: { comment: Comment, depth?: number, blogId: string }) => {
    const [showReplyEditor, setShowReplyEditor] = useState(false);
    const [isRepliesOpen, setIsRepliesOpen] = useState(false);

    const repliesData = useAppSelector(state => state.comment.repliesComments[comment.id]);
    const dispatch = useAppDispatch();

    const toggleReplyEditor = () => setShowReplyEditor(prev => !prev);

    // Update this function
    const handleRepliesClick = async (commentId: string) => {
        if (!isRepliesOpen) {
            const start = repliesData?.start || 0;
            await dispatch(repliesComments({ commentId, start }));
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

                    <LatestRepliesComments
                        commentId={comment.id}
                        blogId={blogId}
                    />


                    {comment._count.replies > 0 && (
                        <Accordion
                            type="single"
                            collapsible
                            value={isRepliesOpen ? comment.id : ""}
                            className="border-none"
                            key={`accordion-${comment.id}`}
                        >
                            <AccordionItem
                                value={comment.id}
                                className="border-none"
                            >
                                <AccordionContent forceMount={isRepliesOpen ? true : undefined}>
                                    <div
                                        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out`}
                                        style={{
                                            maxHeight: isRepliesOpen && repliesData?.replies ? '9999px' : '0'
                                        }}
                                    >
                                        <RepliesComments
                                            commentId={comment.id}
                                            blogId={blogId}
                                            depth={depth}
                                            isMoreButtonVisible={comment._count.replies > repliesData?.replies?.length}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    )}


                </div>
            </div>
        </div>
    )
}

export default CommentItem
