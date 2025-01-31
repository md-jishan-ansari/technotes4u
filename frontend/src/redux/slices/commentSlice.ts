
import { createSlice, createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { blogApi } from '@/src/lib/actions/services/api';

interface CommentState {
    blogComments: {
        [blogId: string]: any;
    };
    repliesComments: {
        [commentId: string]: any;
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
            const response = await blogApi.getComments(blogId);
            return response.data.comments;
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
                state.blogComments[action.meta.arg] = action.payload; // Fixed to use comments array
                state.error = null;
            })
            .addCase(commnetsFeature.thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch comments'; // Updated error message
            });
    }
};

const addCommnetFeature = {
    thunk: createAsyncThunk(
        'comments/addComment',  // Fixed action type name
        async ({ blogId, content }: { blogId: string, content: string }, { getState }) => {
            const response = await blogApi.addComment({ blogId, content });
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
                const { blogId } = action.meta.arg;

                if (!state.blogComments[blogId]) {
                    state.blogComments[blogId] = [];
                }
                state.blogComments[blogId].unshift(action.payload);
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
        addCommnetFeature.reducers(builder);
    },
});

export const fetchCommnets = commnetsFeature.thunk;
export const addCommnet = addCommnetFeature.thunk;

export const { } = commentSlice.actions;

export default commentSlice.reducer;
