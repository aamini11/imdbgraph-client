import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
const defaultTheme: Theme = "light";

type ThemeHook = { theme?: Theme, setTheme: (theme: Theme) => void };
export const ThemeContext = createContext<ThemeHook>({ theme: defaultTheme, setTheme: () => { /* NO-OP */} });

const storageKey = "theme";

export function getTheme() {
    const localTheme = localStorage.getItem(storageKey);
    if (localTheme === undefined) {
        return defaultTheme;
    } else {
        return localTheme === "dark" ? "dark" : defaultTheme;
    }
}

export function ThemedPage({ children } : { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme | undefined>(undefined);

    useEffect(() => {
        setTheme(getTheme());
    }, []);

    return (
      <ThemeContext.Provider value={{ theme, setTheme }}>
          {children}
      </ThemeContext.Provider>
    );
}

export function ThemeButton() {
    const { theme, setTheme } = useContext(ThemeContext);

    const changeTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        localStorage.setItem(storageKey, newTheme);
        document.documentElement.classList.add(newTheme);
        if (theme !== undefined) {
            document.documentElement.classList.remove(theme);
        }
        setTheme(newTheme);
    };

    if (theme === undefined) {
        return null;
    }

    const isChecked = theme === "dark";
    return (
        <div onClick={changeTheme} className={`react-toggle toggle_3Zt9 ${isChecked ? "react-toggle--checked" : ""}`}>
            <div className="react-toggle-track" role="button" tabIndex={-1}>
                <div className="react-toggle-track-check">
                    <span className="toggle_71bT">🌜</span>
                </div>
                <div className="react-toggle-track-x">
                    <span className="toggle_71bT">🌞</span>
                </div>
                <div className="react-toggle-thumb"></div>
            </div>
            <input
                type="checkbox"
                className="react-toggle-screenreader-only"
                aria-label="Switch between dark and light mode"
                checked={isChecked}
            />
        </div>
    );
}