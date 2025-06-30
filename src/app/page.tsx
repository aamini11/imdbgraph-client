import { SearchBar } from "@/components/search-bar";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center gap-9 pb-10 pt-20">
      <h1 className="px-8 text-balance tracking-tight inline font-semibold text-center text-6xl lg:text-6xl">
        Welcome to IMDB Graph
      </h1>
      <div className="flex justify-center w-full min-w-lg max-w-md px-8">
        <SearchBar />
      </div>
    </div>
  );
}
