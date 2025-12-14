import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Retorna o tema efetivo aplicado no app
export function useAppTheme(): 'light' | 'dark' {
  const mode = useSelector((state: RootState) => state.theme.mode); // 'light' | 'dark' | 'system'
  const system = useColorScheme() ?? 'light';

  if (mode === 'system') return system;
  return mode;
}
