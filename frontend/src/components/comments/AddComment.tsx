"use client"
import React, { useState } from 'react'
import FroalaSmallEditor from '../froalaEditor/FroalaSmallEditor'
import Avatar from '../Avatar';
import Button from '../Button';
import { Category } from '@/src/types/types';
import { useAppDispatch } from '@/src/redux/hooks';
import { addCommnet } from '@/src/redux/slices/commentSlice';
const AddComment = ({ blogId, parentId=null, handleShowEditor }: { blogId: string, parentId?: string | null, handleShowEditor?: any }) => {
    const [comment, setComment] = useState<string>("");
    const dispatch = useAppDispatch();

    const handleComment = () => {
        const commentContext: { content: string, blogId: string, parentId?: string | null } = {
            content: comment,
            blogId: blogId,
        }

        if(parentId) {
            commentContext.parentId = parentId;
        }

        dispatch(addCommnet(commentContext));

        setComment("");
    }

    return (
        <div>
            <div className='flex gap-4 items-start'>
                <Avatar size={52} />
                <div className='w-full'>
                    <FroalaSmallEditor
                        setContent={setComment}
                        content={comment}
                        placeholderText="Write a comment..."
                    />
                    <div className="flex gap-2">
                        <Button variant='dark' size='sm' className='mt-2' onClick={handleComment}>Comment</Button>
                        {parentId && <Button variant='primaryOutline' size='sm' className='mt-2' onClick={handleShowEditor}>Cancle</Button>}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AddComment