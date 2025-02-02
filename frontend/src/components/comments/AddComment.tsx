"use client"
import { useEffect, useState } from 'react'
import FroalaSmallEditor from '../froalaEditor/FroalaSmallEditor'
import Avatar from '../Avatar';
import Button from '../Button';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { addCommnet, editComment } from '@/src/redux/slices/commentSlice';
import { Comment, User } from '@/src/types/types';
import axios from 'axios';
import { getUser } from '@/src/redux/slices/generalSlice';
const AddComment = ({ blogId, existingComment=null, parentId = null, handleShowEditor }: { blogId: string, existingComment?: Comment | null, parentId?: string | null, handleShowEditor?: any }) => {

    const [comment, setComment] = useState<string>("");
    const [isCommentEdited, setIsCommentEdited] = useState(false);
    const safeUser = useAppSelector(state => state.general.safeUser);
    const dispatch = useAppDispatch();

    useEffect( () => {
        dispatch(getUser());
    }, [])

    const handleComment = () => {
        if (!comment.trim()) return;

        if (isCommentEdited && existingComment) {
            dispatch(editComment({
                commentId: existingComment.id,
                content: comment,
                blogId
            }));
        } else {
            const commentContext: { content: string, blogId: string, parentId?: string | null } = {
                content: comment,
                blogId,
                ...(parentId && { parentId })
            };
            dispatch(addCommnet(commentContext));
        }

        setComment("");
        handleShowEditor?.();
    }

    useEffect(() => {
        if (existingComment) {
            setComment(existingComment.content);
            setIsCommentEdited(true);
        } else {
            setComment("");
            setIsCommentEdited(false);
        }
    }, [existingComment]);

    return (
        <div className='flex gap-4 items-start mt-3'>
            {!isCommentEdited &&
                <div className="w-[48px]">
                    <Avatar image={safeUser?.image} size={48} />
                </div>
            }
            <div style={{width: isCommentEdited ? "100%" : "calc(100% - 48px)"}} className='flex-grow'>
                <FroalaSmallEditor
                    setContent={setComment}
                    content={comment}
                    placeholderText="Write a comment..."
                />
                <div className="flex gap-2 mt-2">
                    <Button
                        variant='dark'
                        size='sm'
                        className='mt-2'
                        onClick={handleComment}
                    >
                        {isCommentEdited ? "Save" : "Comment"}
                    </Button>

                    {parentId && (
                        <Button
                            variant='primaryOutline'
                            size='sm'
                            className='mt-2'
                            onClick={handleShowEditor}
                        >
                            Cancle
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AddComment