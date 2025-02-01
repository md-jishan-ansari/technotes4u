import React, { useState } from 'react'

import { Category } from '@/src/types/types'
import Avatar from '../Avatar';
import FroalaContent from '../froalaEditor/FroalaContent';
import moment from 'moment';
import RepliesComments from './RepliesComments';
import Button from '../Button';
import AddComment from './AddComment';

const Comment = ({ comment, depth = 1, blogId }: any) => {
    const [showEditor, setShowEditor] = useState<boolean>(false);
    console.log({ comment });

    const handleShowEditor = () => {
        setShowEditor(!showEditor);
        console.log("showEditor", showEditor);
    }

    return (
        <div key={comment.id} className="flex gap-4 items-start mb-4">
            <div className="w-[48px]">
                <Avatar image={comment.user.image} size={48} />
            </div>
            <div className="w-[calc(100%-48px)]">
                <div className="flex gap-2 items-center">
                    <p className='text-xl font-semibold'>{comment.user.name}</p>
                    <p className="text-muted-foreground"><em>{moment(comment.updatedAt).fromNow()}</em></p>
                </div>
                <div className="mt-1">
                    <FroalaContent content={comment.content} />

                    {depth <= 2 &&
                        <div className='mb-4'>
                            <Button variant="primaryGhost" rounded="rounded-[20px]" size="xs" onClick={handleShowEditor} >Reply</Button>
                            {showEditor && <AddComment blogId={blogId} parentId={comment.id} handleShowEditor={handleShowEditor} />}
                        </div>}

                    {blogId && <RepliesComments commentId={comment.id} blogId={blogId} depth={depth} />}
                </div>
            </div>

        </div>
    )
}

export default Comment
