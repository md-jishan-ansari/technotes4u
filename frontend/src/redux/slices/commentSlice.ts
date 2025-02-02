
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

                if(!action.payload.noNeedToChange) {

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
                            (comment:Comment) => !existingCommentIds.has(comment.id)
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

                if(!action.payload.noNeedToChange) {

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


const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        commnetsFeature.reducers(builder);
        repliesCommentsFeature.reducers(builder);
        addCommnetFeature.reducers(builder);
    },
});

export const fetchCommnets = commnetsFeature.thunk;
export const repliesComments = repliesCommentsFeature.thunk;
export const addCommnet = addCommnetFeature.thunk;

export const { } = commentSlice.actions;

export default commentSlice.reducer;
