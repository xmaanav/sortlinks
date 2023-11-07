"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{
    theme: Theme;
    toggle: () => void;
}>({ theme: "light", toggle: () => { } });

export function useTheme() {
    return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);


    useEffect(() => {
        const stored = localStorage.getItem("theme") as Theme | null;
        const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const initial: Theme = stored ?? preferred;
        setTheme(initial);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme, mounted]);


    const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}
