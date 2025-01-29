
import { createSlice } from '@reduxjs/toolkit';

type GeneralState = {
  theme: 'light' | 'dark',
  shownavbar: boolean
};

const applyTheme = (theme: 'light' | 'dark'): void => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

const initialState: GeneralState = {
  theme: 'light',
  shownavbar: true
};

const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    changeTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem('theme', state.theme);

      applyTheme(state.theme);
    },
    setThemeFromLocalStorage: (state) => {
      const savedTheme = localStorage.getItem('theme') as GeneralState['theme'] | null;
      if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        state.theme = savedTheme;
        applyTheme(state.theme);
      }
    },
    toggleNavbar: (state, action) => {
      state.shownavbar = action.payload.navbarstate;
    }
  },
});

export const { changeTheme, setThemeFromLocalStorage, toggleNavbar } = generalSlice.actions;
export default generalSlice.reducer;
