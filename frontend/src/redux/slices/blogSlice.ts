
import { createSlice, createAsyncThunk, PayloadAction, ActionReducerMapBuilder  } from '@reduxjs/toolkit';
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
  "blog/fetchCategories",
  async () => {
    const response = await blogApi.getAllCategories();
    return response.data;
  }
);

const fetchCategoriesExtraReducers = (builder: ActionReducerMapBuilder<BlogState>) => {
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
  });
};

export const fetchSingleBlog = createAsyncThunk(
  'blog/fetchSingleBlog',
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

const fetchSingleBlogExtraReducers = (builder: ActionReducerMapBuilder<BlogState>) => {
  builder
    .addCase(fetchSingleBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchSingleBlog.fulfilled, (state, action) => {
      state.loading = false;
      if (!state.blogs.some(blog => blog.slug === action.payload.slug)) {
        state.blogs.push(action.payload);
      }
      state.error = null;
    })
    .addCase(fetchSingleBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to fetch blog';
    });
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setActiveSlug: (state, action: PayloadAction<{ slug: string }>) => {
      state.activeSlug = action.payload.slug;
    },
  },
  extraReducers: (builder) => {
    fetchCategoriesExtraReducers(builder);

    fetchSingleBlogExtraReducers(builder);
  },
});

export const {
  setActiveSlug
} = blogSlice.actions;

export default blogSlice.reducer;
