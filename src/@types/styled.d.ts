import 'styled-components';
import type { ThemeInterface } from '../preferences/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeInterface {
    type: string
  }
}
