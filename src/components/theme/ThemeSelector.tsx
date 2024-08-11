"use client";

import { Moon, Sun } from "lucide-react";
import * as React from "react";
import { Theme, useTheme } from "@/components/theme/ThemedPage";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";

export function ThemeSelector() {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
                <DropdownMenuItem onClick={() => setTheme(Theme.LIGHT)}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme(Theme.DARK)}>Dark</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
