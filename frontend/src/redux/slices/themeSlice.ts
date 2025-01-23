
import { createSlice } from '@reduxjs/toolkit';

type ThemeState = {
  theme: 'light' | 'dark'
};

const applyTheme = (theme: 'light' | 'dark'): void => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

const initialState: ThemeState = {
  theme: 'light'
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem('theme', state.theme);

      applyTheme(state.theme);
    },
    setThemeFromLocalStorage: (state) => {
      const savedTheme = localStorage.getItem('theme') as ThemeState['theme'] | null;
      if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        state.theme = savedTheme;
        applyTheme(state.theme);
      }
    }
  },
});

export const { changeTheme, setThemeFromLocalStorage } = themeSlice.actions;
export default themeSlice.reducer;
