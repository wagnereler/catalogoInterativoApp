// hooks/use-color-scheme.ts
import { RootState } from '@/src/store';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { useSelector } from 'react-redux';


export type AppColorScheme = 'light' | 'dark';

export function useAppColorScheme(): AppColorScheme {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const systemScheme = useRNColorScheme() ?? 'light';

  if (mode === 'system') return systemScheme;
  return mode;
}
