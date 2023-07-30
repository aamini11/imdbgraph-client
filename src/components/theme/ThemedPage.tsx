"use client";

import { createContext, useEffect, useState } from "react";

export enum Theme {
    LIGHT = "light",
    SYSTEM = "system",
    DARK = "dark",
}

const storageKey = "theme";
const defaultTheme = Theme.SYSTEM;

type ThemeHook = { theme?: Theme; setTheme: (theme: Theme) => void };

export const ThemeContext = createContext<ThemeHook>({
    theme: defaultTheme,
    setTheme: () => {
        /* NO-OP */
    },
});

export function getUserTheme() {
    const localTheme = localStorage.getItem(storageKey);
    if (!localTheme) {
        return defaultTheme;
    } else {
        return localTheme as Theme;
    }
}

/**
 * To prevent flashing/flickering when loading the dark theme, this no flash
 * script is necessary. Because it's run in the script tag in head, it's run
 * before anything has rendered. This is essentially the only way to solve the
 *
 * https://github.com/vercel/next.js/discussions/12533
 */
export function ThemedPage(props: { interClassName: string, children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme | undefined>(undefined);

    useEffect(() => {
        setTheme(getUserTheme());
    }, []);

    const changeTheme = (theme: Theme) => {
        if (!document.documentElement.classList.contains(theme)) {
            localStorage.setItem(storageKey, theme);
            for (const theme of Object.values(Theme)) {
                if (document.documentElement.classList.contains(theme)) {
                    document.documentElement.classList.remove(theme);
                }
            }
            document.documentElement.classList.add(theme);
        }
        setTheme(theme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
            {props.children}
        </ThemeContext.Provider>
    );
}