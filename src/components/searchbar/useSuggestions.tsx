import debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";
import { Show } from "@/models/Show";

export function useSuggestions(query: string) {
    const [suggestions, setSuggestions] = useState<Show[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    async function fetchSuggestions(query: string) {
        try {
            const controller = new AbortController();
            const { signal } = controller;
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const shows = (await response.json()) as Show[];
            setSuggestions(shows);
        } finally {
            setIsLoading(false);
        }
    }

    const debouncedFetchSuggestions = useMemo(() => debounce(fetchSuggestions, 100), []);
    useEffect(() => {
        if (query) {
            setIsLoading(true);
            void debouncedFetchSuggestions(query);
        } else {
            setIsLoading(false);
            setSuggestions([]);
        }
    }, [debouncedFetchSuggestions, query]);

    return { suggestions, isLoading };
}
