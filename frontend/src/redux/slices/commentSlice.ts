
import { createSlice, createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { blogApi } from '@/src/lib/actions/services/api';
import { Comment } from '@/src/types/types';

interface CommentState {
    blogComments: {
        [blogId: string]: Comment[];
    };
    repliesComments: {
        [commentId: string]: Comment[];
    };
    totalComments: number;
    blogCommentsCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: CommentState = {
    blogComments: {},
    repliesComments: {},
    totalComments: 0,
    blogCommentsCount: 0,
    loading: false,
    error: null
};

const commnetsFeature = {
    thunk: createAsyncThunk(
        'comments/fetchComments',  // Fixed action type name
        async (blogId: string, { getState }) => {
            const state = getState() as { comment: CommentState };
            const existingBlogComments = state.comment.blogComments[blogId];

            if (existingBlogComments) {
                return {
                    isExisting: true
                };
            }

            const response = await blogApi.getComments(blogId);
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
                if (!action.payload.isExisting) {
                    state.blogComments[action.meta.arg] = action.payload.comments; // Fixed to use comments array
                    state.totalComments = action.payload.totalComments;
                    state.blogCommentsCount = action.payload.blogCommentsCount;
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
        async (commentId: string, { getState }) => {

            const state = getState() as { comment: CommentState };
            const existingReplyComments = state.comment.repliesComments[commentId];

            if (existingReplyComments) {
                return {
                    isExisting: true
                };
            }

            const response = await blogApi.getReplies(commentId);
            return response.data.replies;
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
                if (!action.payload.isExisting) {
                    state.repliesComments[action.meta.arg] = action.payload; // Store replies by commentId
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
        'comments/addComment',  // Fixed action type name
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
                    // Handle reply
                    if (!state.repliesComments[parentId]) {
                        state.repliesComments[parentId] = [];
                    }
                    state.repliesComments[parentId].push(action.payload);
                } else {
                    // Handle regular comment
                    if (!state.blogComments[blogId]) {
                        state.blogComments[blogId] = [];
                    }
                    state.blogComments[blogId].unshift(action.payload);
                }
                state.error = null;
            })
            .addCase(addCommnetFeature.thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch comments'; // Updated error message
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
