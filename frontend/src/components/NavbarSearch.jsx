import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

function NavbarSearch({ city, value, onChange, onClear, inputRef, className = "" }) {
  return (
    <div
      className={`flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 gap-2 hover:border-orange-300 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100 transition-colors ${className}`}
    >
      <div className="flex items-center gap-1.5 pr-3 border-r border-stone-200 shrink-0">
        <FaLocationDot size={13} className="text-orange-500" />
        <span className="text-xs text-stone-500 font-medium max-w-20 truncate">
          {city}
        </span>
      </div>
      <IoIosSearch size={16} className="text-stone-400 shrink-0" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search food, shops, category…"
        className="flex-1 text-sm text-stone-700 bg-transparent outline-none placeholder:text-stone-300 min-w-0"
        aria-label="Search food and restaurants"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-stone-400 hover:bg-stone-200 hover:text-stone-600 transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <RxCross2 size={14} />
        </button>
      )}
    </div>
  );
}

export default NavbarSearch;
