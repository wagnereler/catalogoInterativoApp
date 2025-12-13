// hooks/use-theme-color.ts
import { Colors } from '@/constants/theme';
import { useAppColorScheme } from './use-color-scheme';


export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useAppColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) return colorFromProps;
  return Colors[theme][colorName];
}
