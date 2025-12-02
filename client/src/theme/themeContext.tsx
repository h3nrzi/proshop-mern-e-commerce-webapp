import { createContext } from "react";

export interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const themeContext = createContext<ThemeContextType | undefined>(undefined);
export default themeContext;
