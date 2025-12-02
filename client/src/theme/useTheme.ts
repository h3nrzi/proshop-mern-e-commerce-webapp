import { useContext } from "react";
import themeContext, { ThemeContextType } from "./themeContext";

const useTheme = (): ThemeContextType => useContext(themeContext)!;
export default useTheme;
