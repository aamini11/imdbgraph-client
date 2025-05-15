import "./global.css";
import { SearchBar } from "@/components/ui/search-bar";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center gap-9 pb-10 pt-20">
        <h1 className="px-8 text-balance tracking-tight inline font-semibold text-center text-6xl lg:text-6xl">
          Welcome to IMDB Graph
        </h1>
        <div className="min-w-80 w-full max-w-md px-3">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
