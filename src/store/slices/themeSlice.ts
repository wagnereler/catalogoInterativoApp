import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appearance, ColorSchemeName } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = {
  mode: 'system',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;

      // Aplica no sistema quando possível
      if (action.payload === 'system') {
        Appearance.setColorScheme(null);
      } else {
        Appearance.setColorScheme(action.payload as ColorSchemeName);
      }
    },
  },
});

export const { setThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
