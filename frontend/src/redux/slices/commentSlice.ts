
import { createSlice, createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { blogApi } from '@/src/lib/actions/services/api';
import { Comment } from '@/src/types/types';

interface CommentState {
    blogComments: {
        [blogId: string]: {
            comments: Comment[];
            totalComments: number;
            blogCommentsCount: number;
            start: number;
        }
    };
    repliesComments: {
        [commentId: string]: {
            replies: Comment[];
            start: number;
        }
    };
    latestRepliesComments: {
        [commentId: string]: Comment[];
    },
    limit: number;
    loading: boolean;
    error: string | null;
}

const initialState: CommentState = {
    blogComments: {},
    repliesComments: {},
    latestRepliesComments: {},
    limit: 3,
    loading: false,
    error: null
};

const commnetsFeature = {
    thunk: createAsyncThunk(
        'comments/fetchComments',  // Fixed action type name
        async ({ blogId, start }: { blogId: string, start: number }, { getState }) => {
            const state = getState() as { comment: CommentState };
            const existingBlogComments = state.comment.blogComments[blogId];
            const limit = state.comment.limit;

            // Add new check for same start value
            if (start > 0 && existingBlogComments && start === existingBlogComments.start) {
                return {
                    noNeedToChange: true
                };
            }

            if (start > 0 && existingBlogComments) {
                const response = await blogApi.getComments(blogId, start, limit);
                return {
                    isExisting: true,
                    ...response.data
                };
            }

            const response = await blogApi.getComments(blogId, 0, limit);
            return response.data;
        }
    ),

    reducers: (builder: ActionReducerMapBuilder<CommentState>) => {
        builder
            .addCase(commnetsFeature.thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(commnetsFeature.thunk.fulfilled, (state, action) => {
                state.loading = false;
                const { blogId, start } = action.meta.arg;

                if (!action.payload.noNeedToChange) {

                    if (!action.payload.isExisting) {
                        state.blogComments[blogId] = {
                            comments: action.payload.comments,
                            totalComments: action.payload.totalComments,
                            blogCommentsCount: action.payload.blogCommentsCount,
                            start: 0
                        };
                    } else {
                        // Create a Set of existing comment IDs for O(1) lookup
                        const existingCommentIds = new Set(
                            state.blogComments[blogId].comments.map(comment => comment.id)
                        );

                        // Filter out duplicates from new comments
                        const newUniqueComments = action.payload.comments.filter(
                            (comment: Comment) => !existingCommentIds.has(comment.id)
                        );

                        state.blogComments[blogId] = {
                            ...state.blogComments[blogId],
                            comments: [...state.blogComments[blogId].comments, ...newUniqueComments],
                            start
                        };
                    }

                }


                state.error = null;
            })
            .addCase(commnetsFeature.thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch comments'; // Updated error message
            });
    }
};

const repliesCommentsFeature = {
    thunk: createAsyncThunk(
        'comments/fetchReplies',  // Updated action type name
        async ({ commentId, start }: { commentId: string, start: number }, { getState }) => {

            const state = getState() as { comment: CommentState };
            const existingReplyComments = state.comment.repliesComments[commentId];
            const limit = state.comment.limit;

            // Add new check for same start value
            if (start > 0 && existingReplyComments && start === existingReplyComments.start) {
                return {
                    noNeedToChange: true
                };
            }

            if (start > 0 && existingReplyComments) {
                const response = await blogApi.getReplies(commentId, start, limit);
                return {
                    isExisting: true,
                    ...response.data
                };
            }

            const response = await blogApi.getReplies(commentId, 0, limit);
            return response.data;
        }
    ),

    reducers: (builder: ActionReducerMapBuilder<CommentState>) => {
        builder
            .addCase(repliesCommentsFeature.thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(repliesCommentsFeature.thunk.fulfilled, (state, action) => {
                state.loading = false;
                const { commentId, start } = action.meta.arg;

                if (!action.payload.noNeedToChange) {

                    // Get the IDs of newly fetched replies
                    const fetchedReplyIds = new Set(action.payload.replies.map((reply: Comment) => reply.id));

                    // Remove any matching replies from latestRepliesComments
                    if (state.latestRepliesComments[commentId]) {
                        state.latestRepliesComments[commentId] = state.latestRepliesComments[commentId]
                            .filter(reply => !fetchedReplyIds.has(reply.id));

                        // Clean up empty arrays
                        if (state.latestRepliesComments[commentId].length === 0) {
                            delete state.latestRepliesComments[commentId];
                        }
                    }

                    if (!action.payload.isExisting) {
                        state.repliesComments[commentId] = {
                            replies: action.payload.replies,
                            start: 0
                        };
                    } else {
                        state.repliesComments[commentId] = {
                            ...state.repliesComments[commentId],
                            replies: [...state.repliesComments[commentId].replies, ...action.payload.replies],
                            start
                        };
                    }

                }
                state.error = null;
            })
            .addCase(repliesCommentsFeature.thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch replies';
            });
    }
};

const addCommnetFeature = {
    thunk: createAsyncThunk(
        'comments/addComment',
        async ({ blogId, content, parentId }: { blogId: string, content: string, parentId?: string | null }, { getState }) => {
            const response = await blogApi.addComment({ blogId, content, parentId });
            return response.data.comment;
        }
    ),

    reducers: (builder: ActionReducerMapBuilder<CommentState>) => {
        builder
            .addCase(addCommnetFeature.thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCommnetFeature.thunk.fulfilled, (state, action) => {
                state.loading = false;
                const { blogId, parentId } = action.meta.arg;

                if (parentId) {
                    // Initialize the array if it doesn't exist
                    if (!state.latestRepliesComments[parentId]) {
                        state.latestRepliesComments[parentId] = [];
                    }
                    state.latestRepliesComments[parentId].unshift(action.payload);

                    // Update replies count in parent comment
                    if (state.blogComments[blogId]) {
                        // Check in main comments
                        const parentComment = state.blogComments[blogId].comments.find(c => c.id === parentId);
                        if (parentComment) {
                            parentComment._count.replies++;
                        } else {
                            // Check in replies of all comments
                            Object.values(state.repliesComments).forEach(replyGroup => {
                                const parentReply = replyGroup.replies.find(r => r.id === parentId);
                                if (parentReply) {
                                    parentReply._count.replies++;
                                }
                            });
                        }
                    }
                } else {
                    if (!state.blogComments[blogId]) {
                        state.blogComments[blogId] = {
                            comments: [],
                            totalComments: 0,
                            blogCommentsCount: 0,
                            start: 0
                        };
                    }
                    state.blogComments[blogId].comments.unshift(action.payload);
                    state.blogComments[blogId].blogCommentsCount++;
                }
                state.blogComments[blogId].totalComments++;
                state.error = null;
            })
            .addCase(addCommnetFeature.thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to add comment';
            });
    }
};


const editCommentFeature = {
    thunk: createAsyncThunk(
        'comments/editComment',
        async ({ commentId, content, blogId }: { commentId: string, content: string, blogId: string }, { getState }) => {
            const response = await blogApi.editComment(commentId, { content });
            return { comment: response.data.comment, blogId };
        }
    ),

    reducers: (builder: ActionReducerMapBuilder<CommentState>) => {
        builder
            .addCase(editCommentFeature.thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editCommentFeature.thunk.fulfilled, (state, action) => {
                state.loading = false;
                const { comment, blogId } = action.payload;

                // Update in main comments
                if (state.blogComments[blogId]) {
                    const commentIndex = state.blogComments[blogId].comments.findIndex(c => c.id === comment.id);
                    if (commentIndex !== -1) {
                        state.blogComments[blogId].comments[commentIndex] = comment;
                    }
                }

                // Update in replies
                if (state.repliesComments[comment.parentId]) {
                    const replyIndex = state.repliesComments[comment.parentId].replies.findIndex(r => r.id === comment.id);
                    if (replyIndex !== -1) {
                        state.repliesComments[comment.parentId].replies[replyIndex] = comment;
                    }
                }

                // Update in latest replies
                Object.keys(state.latestRepliesComments).forEach(parentId => {
                    const replyIndex = state.latestRepliesComments[parentId].findIndex(r => r.id === comment.id);
                    if (replyIndex !== -1) {
                        state.latestRepliesComments[parentId][replyIndex] = comment;
                    }
                });

                state.error = null;
            })
            .addCase(editCommentFeature.thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to edit comment';
            });
    }
};

const deleteCommentFeature = {
    thunk: createAsyncThunk(
        'comments/deleteComment',
        async ({ commentId, blogId }: { commentId: string, blogId: string }) => {
            await blogApi.deleteComment(commentId);
            return { commentId, blogId };
        }
    ),

    reducers: (builder: ActionReducerMapBuilder<CommentState>) => {
        builder
            .addCase(deleteCommentFeature.thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCommentFeature.thunk.fulfilled, (state, action) => {
                state.loading = false;
                const { commentId, blogId } = action.payload;

                // Find if this was a reply by checking all comments
                let isReply = false;
                let parentId = null;

                // Check in all reply collections
                for (const pId in state.repliesComments) {
                    const reply = state.repliesComments[pId].replies.find(r => r.id === commentId);
                    if (reply) {
                        isReply = true;
                        parentId = pId;
                        break;
                    }
                }

                // Check in latestRepliesComments first
                let foundInLatest = false;
                for (const pId in state.latestRepliesComments) {
                    const reply = state.latestRepliesComments[pId].find(r => r.id === commentId);
                    if (reply) {
                        isReply = true;
                        foundInLatest = true;
                        parentId = pId;

                    }
                }

                // Update parent comment's reply count if this was a reply
                if (isReply && parentId) {
                    // Check in main comments
                    const parentComment = state.blogComments[blogId]?.comments.find(c => c.id === parentId);
                    if (parentComment) {
                        parentComment._count.replies--;
                    } else {
                        // Check in replies
                        Object.values(state.repliesComments).forEach(replyGroup => {
                            const parentReply = replyGroup.replies.find(r => r.id === parentId);
                            if (parentReply) {
                                parentReply._count.replies--;
                            }
                        });
                    }
                }

                // Remove from main comments and update start
                if (state.blogComments[blogId]) {
                    state.blogComments[blogId].comments = state.blogComments[blogId].comments
                        .filter(c => c.id !== commentId);
                    state.blogComments[blogId].totalComments--;
                    // Only decrement blogCommentsCount if it's a main comment
                    if (!foundInLatest && !isReply) {
                        state.blogComments[blogId].blogCommentsCount--;
                    }
                    if (state.blogComments[blogId].start > 0) {
                        state.blogComments[blogId].start--;
                    }
                }

                // Remove from replies and update their start values
                Object.keys(state.repliesComments).forEach(pId => {
                    const replyGroup = state.repliesComments[pId];
                    replyGroup.replies = replyGroup.replies.filter(r => r.id !== commentId);
                    // Reduce start if comment was in this reply group and start is greater than 0
                    if (replyGroup.start > 0 && replyGroup.replies.length < state.limit) {
                        replyGroup.start--;
                    }
                });

                // Remove from latest replies
                Object.keys(state.latestRepliesComments).forEach(parentId => {
                    state.latestRepliesComments[parentId] = state.latestRepliesComments[parentId]
                        .filter(r => r.id !== commentId);
                });

                state.error = null;
            })
            .addCase(deleteCommentFeature.thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to delete comment';
            });
    }
};



const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        commnetsFeature.reducers(builder);
        repliesCommentsFeature.reducers(builder);
        addCommnetFeature.reducers(builder);
        editCommentFeature.reducers(builder);
        deleteCommentFeature.reducers(builder);
    },
});

export const fetchCommnets = commnetsFeature.thunk;
export const repliesComments = repliesCommentsFeature.thunk;
export const addCommnet = addCommnetFeature.thunk;
export const editComment = editCommentFeature.thunk;
export const deleteComment = deleteCommentFeature.thunk;

export const { } = commentSlice.actions;

export default commentSlice.reducer;
