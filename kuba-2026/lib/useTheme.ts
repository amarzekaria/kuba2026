"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("kuba-theme");
    const dark = stored === "light" ? false : true;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("kuba-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  return { isDark, toggle };
}
