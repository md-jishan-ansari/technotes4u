
import { createSlice, createAsyncThunk, PayloadAction  } from '@reduxjs/toolkit';
import { Category } from '@/src/types/types';
import axios from 'axios';

interface BlogState {
  categories: any;
  categorylist: Category[];
  activeSlug: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  categories: [],
  categorylist: [],
  activeSlug: null,
  loading: false,
  error: null
};

interface CategoriesResponse {
  success: boolean;
  categories: any;
  categorylist: Category[];
}

export const fetchCategories = createAsyncThunk<CategoriesResponse>("fetchCategories", async () => {
  return axios({
    method: 'get',
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/getallcategories`,
  })
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    throw new Error('Failed to fetch categories');
  });
});

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setActiveSlug: (state, action: PayloadAction<{ slug: string }>) => {
      state.activeSlug = action.payload.slug;
    }
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
    });
  }
});

export const { setActiveSlug } = blogSlice.actions;
export default blogSlice.reducer;
