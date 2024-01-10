/**
 * Prevent screen from flickering white at beginning of load when dark theme is chosen.
 */
export function initializeTheme() {
    const getTheme = () => {
        const localTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (!localTheme) {
            if (prefersDark) {
                return "dark";
            } else {
                return "light";
            }
        } else {
            return localTheme;
        }
    };

    document.documentElement.classList.add(getTheme());
}
