"use client";

import { TRANSITION_VARIANTS } from "@nextui-org/framer-utils";
import { Input, ScrollShadow, Spinner } from "@nextui-org/react";
import { clsx } from "@nextui-org/shared-utils";
import { useCombobox, UseComboboxReturnValue } from "downshift";
import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import React, { startTransition, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { SearchIcon } from "@/components/assets/Icons";
import { formatYears, Show, ShowSchema } from "@/lib/Show";

const DROPDOWN_LIMIT = 5;

/**
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
 */
export function Searchbar() {
    const router = useRouter();

    const [text, setText] = useState("");
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<Show[]>([]);

    useEffect(() => {
        router.prefetch("/ratings");
    }, [router]);

    useEffect(() => {
        return () => setIsRedirecting(false);
    }, []);

    const handleNewQuery = useMemo(
        () =>
            debounce(async (x: string) => {
                try {
                    const suggestions = await fetchSuggestions(x);
                    setSuggestions(suggestions.slice(0, DROPDOWN_LIMIT));
                } finally {
                    setIsLoading(false);
                }
            }, 200),
        [],
    );

    const comboBoxProps = useCombobox({
        items: suggestions,
        onSelectedItemChange: ({ selectedItem: show }) => {
            if (isEmpty(text)) {
                return;
            }

            if (show) {
                setIsRedirecting(true);
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
                // Go to ratings page
                // https://buildui.com/posts/global-progress-in-nextjs#introduction
                startTransition(() => {
                    setIsRedirecting(false);
                    router.push(`/ratings/${encodeURIComponent(show.imdbId)}`);
                });
            }
        },
        itemToString: (show) => show?.title ?? "",
    });

    const { isOpen, getInputProps, getMenuProps } = comboBoxProps;
    return (
        <div className="relative w-full">
            <Input
                variant="bordered"
                radius="full"
                type="text"
                placeholder="Search for any TV show..."
                onValueChange={(inputValue) => {
                    setText(inputValue);
                    if (!isEmpty(inputValue)) {
                        setIsLoading(true);
                        void handleNewQuery(inputValue);
                    }
                }}
                classNames={{
                    // Reason for text-base. (Auto-zoom on safari. Input text size must be >16px)
                    // https://stackoverflow.com/q/2989263
                    input: "ml-1 text-base",
                    inputWrapper: "h-[48px]",
                }}
                startContent={<SearchIcon className="text-default-400" strokeWidth={2.5} size={20} />}
                endContent={(isLoading || isRedirecting) && <Spinner color="default" size="sm" />}
                disabled={isRedirecting}
                {...getInputProps()}
            />
            <div {...getMenuProps()} className="absolute w-full z-10 overflow-clip">
                <AnimatePresence>
                    {isOpen && text.length > 0 && (!isLoading || suggestions.length > 0) && (
                        <motion.div animate="enter" exit="exit" initial="exit" variants={TRANSITION_VARIANTS.fade}>
                            <DropDown suggestions={suggestions} comboBoxProps={comboBoxProps} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function DropDown({
    suggestions,
    comboBoxProps,
}: {
    suggestions: Show[];
    comboBoxProps: UseComboboxReturnValue<Show>;
}) {
    const { highlightedIndex, getItemProps } = comboBoxProps;

    const rating = (show: Show) => (
        <div className="shrink-0 flex items-center space-x-1 text-sm pl-2">
            <dt className="text-sky-500">
                <span className="sr-only">Star rating</span>
                <svg width="16" height="20" fill="currentColor">
                    <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
                </svg>
            </dt>
            <dd>{`${show.showRating.toFixed(1)} / 10.0`}</dd>
        </div>
    );

    const listItems = suggestions.map((show, index) => (
        <li
            key={show.imdbId}
            className={clsx(
                "flex gap-2 items-center justify-between px-2 py-1.5 w-full h-full",
                "rounded-medium text-default-500 transition-opacity",
                "subpixel-antialiased cursor-pointer tap-highlight-transparent hover:transition-colors",
                { "bg-default-200 dark:bg-default-50 text-foreground": index === highlightedIndex },
                "hover:bg-default-200 hover:text-foreground",
                "dark:hover:bg-default-50",
            )}
            {...getItemProps({ item: show, index })}
        >
            <div className="flex justify-between w-full items-center">
                <div className="flex flex-col">
                    <span className="text-small break-words">{show.title}&nbsp;</span>
                    <span className="text-tiny text-default-400">{formatYears(show)}</span>
                </div>
                {rating(show)}
            </div>
        </li>
    ));

    return (
        <div className="rounded-large p-2 border-small border-default-400 dark:border-default-100 bg-background mt-2">
            <ScrollShadow className="max-h-[320px]">
                <ul id="tv-search-dropdown">
                    {suggestions.length > 0 ? (
                        listItems
                    ) : (
                        <li className="text-small text-default-400 pl-2">No TV Shows found</li>
                    )}
                </ul>
            </ScrollShadow>
        </div>
    );
}

function isEmpty(s: string) {
    return !s || !/\S/.test(s);
}

const fetchSuggestions = async (query: string): Promise<Show[]> => {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const show = await response.json();
    return z.array(ShowSchema).parse(show);
};
