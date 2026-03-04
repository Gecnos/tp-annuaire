import { Search, SlidersHorizontal, Menu } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface TopbarProps {
  onMenuOpen?: () => void;
}

export default function Topbar({ onMenuOpen }: TopbarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const handleSearch = (value: string) => {
    if (value.trim()) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <header className="h-16 sm:h-20 bg-white border-b border-gray-200 flex items-center gap-3 px-4 sm:px-8 w-full">
      {/* Hamburger (mobile uniquement) */}
      <button
        onClick={onMenuOpen}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
        aria-label="Ouvrir le menu"
      >
        <Menu size={22} />
      </button>

      <h2 className="hidden md:block text-xl font-bold text-gray-800 shrink-0">
        Tous mes contacts
      </h2>

      <div className="flex-1 mx-0 sm:mx-4 md:mx-8">
        <div className="relative flex items-center w-full h-10 rounded-lg bg-slate-100 focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden transition-all">
          <div className="grid place-items-center h-full w-10 text-gray-400 shrink-0">
            <Search size={18} />
          </div>
          <input
            className="peer h-full w-full outline-none text-sm text-gray-700 bg-slate-100 pr-2"
            type="text"
            id="search"
            placeholder="Rechercher..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setSearchParams({})}
              className="grid place-items-center h-full w-10 text-gray-400 hover:text-gray-600 text-lg font-bold transition-colors shrink-0"
              title="Effacer"
            >
              ✕
            </button>
          )}
          <div className="hidden sm:grid place-items-center h-full w-12 text-gray-400 cursor-pointer hover:text-gray-600 shrink-0">
            <SlidersHorizontal size={16} />
          </div>
        </div>
      </div>


    </header>
  );
}
