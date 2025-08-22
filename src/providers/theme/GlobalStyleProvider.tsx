import React, { createContext, useState, useMemo } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "../../styles/global";
import type { ThemeType } from "../../theme/theme"

// 👇 tell TS what type the context will hold
export const StyleContext = createContext<ThemeType>(lightTheme);

export const ThemeToggleContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

function GlobalStyleProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme(); // 'light' or 'dark'
  console.log("System theme:", systemScheme);
  const [themeMode, setThemeMode] = useState(systemScheme);

  // const isDark = themeMode === "dark";
  const isDark=false
  const styles = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <StyleContext.Provider value={styles}>
      <ThemeToggleContext.Provider value={{ isDark, toggleTheme }}>
        {children}
      </ThemeToggleContext.Provider>
    </StyleContext.Provider>
  );
}

export default GlobalStyleProvider;
