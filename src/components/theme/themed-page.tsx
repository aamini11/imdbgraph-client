import { ThemeProvider, useTheme } from "next-themes";
import { ReactNode } from "react";

export { useTheme };

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

export function ThemedPage(props: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" enableSystem={true} attribute={"class"}>
      {props.children}
    </ThemeProvider>
  );
}
