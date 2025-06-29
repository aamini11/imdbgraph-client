import { SearchBar } from "@/components/search-bar";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center gap-9 pt-20 pb-10">
        <h1 className="inline px-8 text-center text-6xl font-semibold tracking-tight text-balance lg:text-6xl">
          Welcome to IMDB Graph
        </h1>
        <div className="w-full max-w-md min-w-80 px-3">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
