import React, { createContext, useState, useMemo, useEffect } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "../../styles/global";
import type { ThemeType } from "../../theme/theme";
import { useDataStore } from "../data-store/data-store-provider";

// Contexts
export const StyleContext = createContext<ThemeType>(lightTheme);

export const ThemeToggleContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

function GlobalStyleProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme(); // "light" | "dark"
  const { getItem, setItem } = useDataStore();

  const [themeMode, setThemeMode] = useState<"light" | "dark">(systemScheme ?? "light");

  const isDark = themeMode === "dark";

  const styles = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  // Load stored theme ONCE at app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await getItem("THEME_MODE"); // "light", "dark", or null
        if (savedTheme === "light" || savedTheme === "dark") {
          setThemeMode(savedTheme);
        } else {
          // First time user -> use system theme
          await setItem("THEME_MODE", systemScheme ?? "light");
          setThemeMode(systemScheme ?? "light");
        }
      } catch (e) {
        console.log("Error loading theme:", e);
      }
    };

    loadTheme();
  }, []);

  // Toggle theme & persist into AsyncStorage
  const toggleTheme = async () => {
    const newMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(newMode);
    await setItem("THEME_MODE", newMode);
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
