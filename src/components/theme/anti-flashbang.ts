/**
 * Prevent screen from flickering white at beginning of load when dark theme is chosen.
 */
export function initializeTheme() {
    const getTheme = () => {
        const localTheme = localStorage.getItem("theme");
        const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
        if (!localTheme) {
            if (prefersLight) {
                return "light";
            } else {
                return "dark";
            }
        } else {
            return localTheme;
        }
    };

    const theme = getTheme();
    localStorage.setItem("theme", theme);
    document.documentElement.classList.add(theme);
}
