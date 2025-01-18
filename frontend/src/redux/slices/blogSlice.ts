
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCategories = createAsyncThunk("fetchCategories", async () => {
  const response = await fetch("http://localhost:9000/api/blog/getallcategories");
  const data = await response.json();
  return data;
});

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    categories: [],
    categorylist: [],
    activeSlug: null,
    loading: false,
    error: null
  },
  reducers: {
    setActiveSlug: (state, action) => {
      state.activeSlug = action.payload.slug;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload?.categories;
      state.categorylist = action.payload?.categorylist;
    })
    .addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
}
});

export const { setActiveSlug } = blogSlice.actions;
export default blogSlice.reducer;
