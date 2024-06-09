import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./src/**/*.{js,ts,jsx,tsx}", "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [nextui()],
};

export default config;
