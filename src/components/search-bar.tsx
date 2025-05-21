"use client";

import { Command, CommandItem, CommandInput, CommandList } from "./ui/command";
import { useState } from "react";

const suggestions = [
  {
    imdbId: "tt0369179",
    title: "Two and a Half Men",
    startYear: "2003",
    endYear: "2015",
    showRating: 7.1,
    numVotes: 289874,
  },
  {
    imdbId: "tt1843230",
    title: "Once Upon a Time",
    startYear: "2011",
    endYear: "2018",
    showRating: 7.7,
    numVotes: 242917,
  },
  {
    imdbId: "tt2395695",
    title: "Cosmos: A Spacetime Odyssey",
    startYear: "2014",
    endYear: "2014",
    showRating: 9.2,
    numVotes: 134137,
  },
  {
    imdbId: "tt5189670",
    title: "Making a Murderer",
    startYear: "2015",
    endYear: "2018",
    showRating: 8.5,
    numVotes: 105977,
  },
  {
    imdbId: "tt2177461",
    title: "A Discovery of Witches",
    startYear: "2018",
    endYear: "2022",
    showRating: 7.8,
    numVotes: 69740,
  },
];

/**
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
 */
export function SearchBa() {
  return (
    <search>
      <form className="relative w-full">
        <input
          aria-label="Search for any TV show"
          type="search"
          placeholder="Search for any TV show..."
          className="placeholder:text-base border-2 rounded-full h-11 px-5 py-4"
          aria-controls="suggestions"
        />
        <menu id="suggestions">
          {suggestions.map((show) => (
            <li key={show.imdbId}>{show.title}</li>
          ))}
        </menu>
      </form>
    </search>
  );
}

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleValueChange = (value: string) => {
    setInputValue(value);
    setOpen(!!value);
  };

  const filteredCommands = suggestions.filter((x) =>
    x.title.toLowerCase().includes(inputValue.toLowerCase()),
  );
  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        value={inputValue}
        placeholder="Type a command or search..."
        onValueChange={handleValueChange}
      />
      {
        <CommandList>
          {open &&
            filteredCommands.length > 0 &&
            filteredCommands.map((command) => (
              <CommandItem
                key={command.title}
                value={command.title}
                onSelect={() => {
                  setInputValue(command.title);
                  setOpen(false);
                }}
              >
                {command.title}
              </CommandItem>
            ))}
        </CommandList>
      }
    </Command>
  );
}
