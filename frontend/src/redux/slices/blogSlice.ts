
import { createSlice, createAsyncThunk, PayloadAction  } from '@reduxjs/toolkit';
import { Blog, Category } from '@/src/types/types';
import axios from 'axios';
import { blogApi } from '@/src/actions/services/api';

interface BlogState {
  categories: any;
  categorylist: Category[];
  blogs: Blog[];
  activeSlug: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  categories: [],
  categorylist: [],
  blogs: [],
  activeSlug: null,
  loading: false,
  error: null
};

interface CategoriesResponse {
  success: boolean;
  categories: any;
  categorylist: Category[];
}

export const fetchCategories = createAsyncThunk<CategoriesResponse>(
  "fetchCategories",
  async () => {
    const response = await blogApi.getAllCategories();
    return response.data;
  }
);

export const fetchActiveBlog = createAsyncThunk(
  'blog/fetchActiveBlog',
  async (slug: string, { getState }) => {
    const state = getState() as { blog: BlogState };
    const existingBlog = state.blog.blogs.find(blog => blog.slug === slug);

    if (existingBlog) {
      return existingBlog;
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/getblog?slug=${slug}`);
    return response.data.blog;
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setActiveSlug: (state, action: PayloadAction<{ slug: string }>) => {
      state.activeSlug = action.payload.slug;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchCategories.fulfilled, (state, action) => {
      state.loading = false;
        state.categories = action.payload.categories;
        state.categorylist = action.payload.categorylist;
        state.error = null;
    })
    .addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'An error occurred';
    })
    .addCase(fetchActiveBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchActiveBlog.fulfilled, (state, action) => {
      state.loading = false;
      if (!state.blogs.some(blog => blog.slug === action.payload.slug)) {
        state.blogs.push(action.payload);
      }
      state.error = null;
    })
    .addCase(fetchActiveBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch blog';
    });
  },


});

export const {
  setActiveSlug
} = blogSlice.actions;

export default blogSlice.reducer;
