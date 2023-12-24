/**
 * Prevent screen from flickering white at beginning of load when dark theme is chosen.
 */
export function initializeTheme() {
    const getTheme = () => {
        const localTheme = localStorage.getItem("theme");
        if (!localTheme) {
            return "system";
        } else {
            return localTheme;
        }
    };

    document.documentElement.classList.add(getTheme());
}
