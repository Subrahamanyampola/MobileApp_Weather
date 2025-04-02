// useTheme.ts
import { useEffect } from "react";

export const useTheme = () => {
  useEffect(() => {
    const saved = localStorage.getItem("app-theme") || "light";
    document.body.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("app-theme", isDark ? "dark" : "light");
  };

  return { toggleTheme };
};
