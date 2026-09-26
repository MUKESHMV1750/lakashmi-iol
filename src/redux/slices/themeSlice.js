import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: { theme: 'light' },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    loadThemeFromStorage: (state) => {
      state.theme = localStorage.getItem('theme') || 'light';
    },
  },
});

export const { toggleTheme, loadThemeFromStorage } = themeSlice.actions;
export default themeSlice.reducer;
