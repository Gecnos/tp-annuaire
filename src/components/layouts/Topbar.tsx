import { Search, SlidersHorizontal, Bell } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function Topbar() {
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
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 w-full">
      <h2 className="text-xl font-bold text-gray-800 w-64">
        Tous mes contacts
      </h2>

      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative flex items-center w-full h-10 rounded-lg bg-slate-100 focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden transition-all">
          <div className="grid place-items-center h-full w-12 text-gray-400">
            <Search size={18} />
          </div>
          <input
            className="peer h-full w-full outline-none text-sm text-gray-700 bg-slate-100 pr-2"
            type="text"
            id="search"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setSearchParams({})}
              className="grid place-items-center h-full w-10 text-gray-400 hover:text-gray-600 text-lg font-bold transition-colors"
              title="Effacer"
            >
              ✕
            </button>
          )}
          <div className="grid place-items-center h-full w-12 text-gray-400 cursor-pointer hover:text-gray-600">
            <SlidersHorizontal size={16} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button>
            <Bell size={20} />
          </button>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-700 leading-none">
              Vianney
            </p>
            <p className="text-xs text-gray-500 mt-1">Admin</p>
          </div>
          <img
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Vianney"
            alt="Profile"
          />
        </div>
      </div>
    </header>
  );
}
