"use client"
import React, { useEffect, useState } from 'react'
import FroalaSmallEditor from '../froalaEditor/FroalaSmallEditor'
import Avatar from '../Avatar';
import Button from '../Button';
import { Category } from '@/src/types/types';
import { useAppDispatch } from '@/src/redux/hooks';
import { addCommnet } from '@/src/redux/slices/commentSlice';
import FroalaEditor from '../froalaEditor/FroalaEditor';

const AddComment = ({ blog }: { blog: Category }) => {
    const [comment, setComment] = useState<string>("");
    const [isEditorLoaded, setIsEditorLoaded] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setTimeout(() => {
            setIsEditorLoaded(true);
        }, 2000)
    }, []);

    const handleComment = () => {
        const commentContext:{content: string, blogId: string} = {
            content: comment,
            blogId: blog.id,
        }

        dispatch(addCommnet(commentContext));
    }

    return (
        <div>
            <h3 className='text-2xl mb-3'> <span className='font-semibold'>239</span> Comments</h3>
            <div className='flex gap-4 items-start'>
                <Avatar size={52} />
                <div className='w-full'>
                    {isEditorLoaded && (
                        <FroalaSmallEditor
                            setContent={setComment}
                            content={comment}
                            placeholderText="Write a comment..."
                        />
                    )}
                    <Button variant='dark' size='sm' className='mt-2' onClick={handleComment}>Comment</Button>
                </div>
            </div>

        </div>
    )
}

export default AddComment