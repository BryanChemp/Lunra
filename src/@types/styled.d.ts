import 'styled-components';
import type { ThemeInterface } from '../constants/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeInterface {
    type: string
  }
}
