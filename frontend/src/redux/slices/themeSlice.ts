
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const applyTheme = (theme: string) => {
  if (theme === "dark") {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: "light",
  },
  reducers: {
    changeTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem('theme', state.theme);

      applyTheme(state.theme);
    },
    setThemeFromLocalStorage: (state) => {
      const theme = localStorage.getItem('theme');
      if (theme) {
        state.theme = theme;
        applyTheme(state.theme);
      }
    }
  },
});

export const { changeTheme, setThemeFromLocalStorage } = themeSlice.actions;
export default themeSlice.reducer;
