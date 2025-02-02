
import { SafeUser } from '@/src/types/types';
import { ActionReducerMapBuilder, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

type GeneralState = {
  theme: 'light' | 'dark',
  shownavbar: boolean,
  safeUser: SafeUser | null
};

const applyTheme = (theme: 'light' | 'dark'): void => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

const initialState: GeneralState = {
  theme: 'light',
  shownavbar: true,
  safeUser: null
};

const getUserFeature = {
  thunk: createAsyncThunk(
    'blog/fetchSafeUser',
    async (_, { getState }) => {
      const state = getState() as { general: GeneralState };
      const safeUser = state.general.safeUser;

      if (safeUser) {
        return safeUser;
      }

      const res = await axios.get("/api/auth/getCurrentUser");
      return res.data;
    }
  ),

  reducers: (builder: ActionReducerMapBuilder<GeneralState>) => {
    builder
      .addCase(getUserFeature.thunk.fulfilled, (state, action) => {
        if(action.payload) {
          const safeUser = {
            name: action.payload.name,
            email: action.payload.email,
            image: action.payload.image,
          }
          state.safeUser = safeUser
        }
      })
  }
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
    },
    getSafeUser: (state) => {
      if (!state.safeUser) {

      }
    }
  },
  extraReducers: (builder) => {
    getUserFeature.reducers(builder);
  },
});

export const getUser = getUserFeature.thunk;

export const { changeTheme, setThemeFromLocalStorage, toggleNavbar } = generalSlice.actions;
export default generalSlice.reducer;
