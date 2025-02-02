
import { createSlice, createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { blogApi } from '@/src/lib/actions/services/api';
import { Comment } from '@/src/types/types';

interface CommentState {
    blogComments: {
        [blogId: string]: {
            comments: Comment[];
            totalComments: number;
            blogCommentsCount: number;
        }
    };
    repliesComments: {
        [commentId: string]: {
            replies: Comment[];
            totalReplies: number;
        }
    };
    loading: boolean;
    error: string | null;
}

const initialState: CommentState = {
    blogComments: {},
    repliesComments: {},
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
                    isExisting: true,
                    comments: existingBlogComments
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
                    state.blogComments[action.meta.arg] = {
                        comments: action.payload.comments,
                        totalComments: action.payload.totalComments,
                        blogCommentsCount: action.payload.blogCommentsCount
                    };
                } else {
                    state.blogComments[action.meta.arg] = {
                        ...state.blogComments[action.meta.arg],
                        comments: [...state.blogComments[action.meta.arg].comments, ...action.payload.comments]
                    };
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
                    isExisting: true,
                    replies: existingReplyComments
                };
            }

            const response = await blogApi.getReplies(commentId);
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
                if (!action.payload.isExisting) {
                    state.repliesComments[action.meta.arg] = {
                        replies: action.payload.replies,
                        totalReplies: action.payload.totalReplies
                    };
                } else {
                    state.repliesComments[action.meta.arg] = {
                        ...state.repliesComments[action.meta.arg],
                        replies: [...state.repliesComments[action.meta.arg].replies, ...action.payload.replies]
                    };
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
                    if (!state.repliesComments[parentId]) {
                        state.repliesComments[parentId] = {
                            replies: [],
                            totalReplies: 0
                        };
                    }
                    state.repliesComments[parentId].replies.push(action.payload);
                    state.repliesComments[parentId].totalReplies++;
                } else {
                    if (!state.blogComments[blogId]) {
                        state.blogComments[blogId] = {
                            comments: [],
                            totalComments: 0,
                            blogCommentsCount: 0
                        };
                    }
                    state.blogComments[blogId].comments.unshift(action.payload);
                    state.blogComments[blogId].totalComments++;
                    state.blogComments[blogId].blogCommentsCount++;
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
