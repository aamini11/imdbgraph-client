"use client";

import { clsx } from "@nextui-org/shared-utils";
import { SwitchProps, useSwitch } from "@nextui-org/switch";
import { useIsSSR } from "@react-aria/ssr";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { FC } from "react";
import { MoonFilledIcon, SunFilledIcon } from "@/components/Icons";
import { Theme, useTheme } from "@/components/theme/ThemedPage";

export type ThemeSwitchProps = {
    classNames?: SwitchProps["classNames"];
};

export const ThemeSelector: FC<ThemeSwitchProps> = ({ classNames }) => {
    const { theme, setTheme } = useTheme();
    const isSSR = useIsSSR();

    const onChange = () => (theme === Theme.LIGHT ? setTheme(Theme.DARK) : setTheme(Theme.LIGHT));

    const { Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps } = useSwitch({
        isSelected: theme === Theme.LIGHT || isSSR,
        "aria-label": `Switch to ${theme === Theme.LIGHT || isSSR ? Theme.DARK : Theme.LIGHT} mode`,
        onChange,
    });

    return (
        <Component
            {...getBaseProps({
                className: clsx("px-px transition-opacity hover:opacity-80 cursor-pointer", classNames?.base),
            })}
        >
            <VisuallyHidden>
                <input {...getInputProps()} />
            </VisuallyHidden>
            <div
                {...getWrapperProps()}
                className={slots.wrapper({
                    class: clsx(
                        [
                            "w-auto h-auto",
                            "bg-transparent",
                            "rounded-lg",
                            "flex items-center justify-center",
                            "group-data-[selected=true]:bg-transparent",
                            "!text-default-500",
                            "pt-px",
                            "px-0",
                            "mx-0",
                        ],
                        classNames?.wrapper,
                    ),
                })}
            >
                {!isSelected || isSSR ? (
                    <SunFilledIcon width={22} height={22} />
                ) : (
                    <MoonFilledIcon width={22} height={22} />
                )}
            </div>
        </Component>
    );
};
