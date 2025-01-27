
import { createSlice, createAsyncThunk, ActionReducerMapBuilder  } from '@reduxjs/toolkit';
import { Blog, Category } from '@/src/types/types';
import { blogApi } from '@/src/redux/actions/services/api';

interface BlogState {
  categories: any;
  categorylist: Category[];
  blogs: Blog[];
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  categories: [],
  categorylist: [],
  blogs: [],
  loading: false,
  error: null
};

interface CategoriesResponse {
  success: boolean;
  categories: any;
  categorylist: Category[];
}

const categoriesFeature = {
  thunk: createAsyncThunk<CategoriesResponse>(
    "blog/fetchCategories",
    async () => {
      const response = await blogApi.getAllCategories();
      return response.data;
    }
  ),

  reducers: (builder: ActionReducerMapBuilder<BlogState>) => {
    builder
      .addCase(categoriesFeature.thunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(categoriesFeature.thunk.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.categorylist = action.payload.categorylist;
        state.error = null;
      })
      .addCase(categoriesFeature.thunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  }
};

const singleBlogFeature = {
  thunk: createAsyncThunk(
    'blog/fetchSingleBlog',
    async (slug: string, { getState }) => {
      const state = getState() as { blog: BlogState };
      const existingBlog = state.blog.blogs.find(blog => blog.slug === slug);

      if (existingBlog) {
        return existingBlog;
      }

      const response = await blogApi.getSingleBlog({slug});
      return response.data.blog;
    }
  ),

  reducers: (builder: ActionReducerMapBuilder<BlogState>) => {
    builder
      .addCase(singleBlogFeature.thunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(singleBlogFeature.thunk.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.blogs.some(blog => blog.slug === action.payload.slug)) {
          state.blogs.push(action.payload);
        }
        state.error = null;
      })
      .addCase(singleBlogFeature.thunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch blog';
      });
  }
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    categoriesFeature.reducers(builder);

    singleBlogFeature.reducers(builder);
  },
});

export const fetchCategories = categoriesFeature.thunk;
export const fetchSingleBlog = singleBlogFeature.thunk;

export const {} = blogSlice.actions;

export default blogSlice.reducer;
