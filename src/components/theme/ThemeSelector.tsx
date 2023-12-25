"use client";

import { useContext } from "react";
import { Theme, ThemeContext } from "@/components/theme/ThemedPage";

export function ThemeSelector() {
    return (
        <div className="bg-opacity-0 p-[3px] w-fit flex rounded-full border border-neutral-300 dark:border-neutral-500">
            <ThemeButton theme={Theme.LIGHT} />
            <ThemeButton theme={Theme.SYSTEM} />
            <ThemeButton theme={Theme.DARK} />
        </div>
    );
}

function ThemeButton({ theme }: { theme: Theme }) {
    const { theme: currentTheme, setTheme } = useContext(ThemeContext);
    const checked = currentTheme === theme;
    return (
        <label className="relative">
            <input
                name="theme"
                value={theme}
                aria-label={`Switch to ${theme} theme`}
                className={`
                    peer
                    absolute top-0 left-0
                    w-[32px] h-[32px]
                    opacity-0
                    flex items-center justify-center
                    cursor-pointer
                `}
                type="radio"
                onChange={(e) => {
                    const value = e.target.value;
                    console.log(value);
                    if (Object.values<string>(Theme).includes(value)) {
                        const theme = value as Theme;
                        setTheme(theme);
                    }
                }}
                checked={checked}
            />
            <div
                className={`
                    w-[32px] h-[32px]
                    peer-focus-visible:border
                    rounded-full
                    ${checked ? "bg-neutral-200 dark:bg-neutral-700" : ""}
                    border-blue-500
                    flex items-center justify-center
                `}
            >
                <Icon theme={theme} size={16} />
            </div>
        </label>
    );
}

function Icon(props: { theme: Theme; size: number }) {
    const icons = {
        system: (
            <>
                <rect width={20} height={14} x={2} y={3} rx={2} ry={2} />
                <path d="M8 21h8M12 17v4" />
            </>
        ),
        dark: (
            <>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </>
        ),
        light: (
            <>
                <circle cx={12} cy={12} r={5} />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </>
        ),
    };

    return (
        <svg
            className="w-[16px] h-[16px]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            shapeRendering="geometricPrecision"
        >
            {icons[props.theme]}
        </svg>
    );
}
