"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export enum Theme {
    LIGHT = "light",
    DARK = "dark",
}

const storageKey = "theme";

/**
 * Important note: undefined represents an initial uninitialized theme.
 */
type ThemeInfo = { theme: Theme | undefined; setTheme: (theme: Theme) => void };

const ThemeContext = createContext<ThemeInfo | null>(null);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === null) {
        throw Error("No theme provider");
    } else {
        return context;
    }
}

function getThemeFromLocalStorage(): Theme {
    const localTheme = localStorage.getItem(storageKey);
    if (localTheme) {
        return localTheme as Theme;
    } else {
        return Theme.DARK;
    }
}

/**
 * To prevent flashing/flickering when loading the dark theme, this no flash
 * script is necessary. Because it's run in the script tag in head, it's run
 * before anything has rendered. This is essentially the only way to solve the
 * issue.
 *
 * https://github.com/vercel/next.js/discussions/12533
 */
export function ThemedPage(props: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme | undefined>(undefined);

    useEffect(() => {
        if (!theme) {
            setTheme(getThemeFromLocalStorage());
        } else {
            localStorage.setItem(storageKey, theme);
            for (const theme of Object.values(Theme)) {
                if (document.documentElement.classList.contains(theme)) {
                    document.documentElement.classList.remove(theme);
                }
            }
            document.documentElement.classList.add(theme);
        }
    }, [theme]);

    return <ThemeContext.Provider value={{ theme, setTheme }}>{props.children}</ThemeContext.Provider>;
}
