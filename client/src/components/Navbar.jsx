import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { ArrowLeft, BookmarkIcon, Menu, Plus, Search } from 'lucide-react'

const Navbar = ({ user, showSidebar, setShowSidebar, searchQuery, setSearchQuery, isAddingBookmark, setIsAddingBookmark }) => {
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (showSearch) {
      searchRef.current?.focus();
    }
  }, [showSearch]);

  return (
    <nav className="flex items-center justify-between gap-8 p-4 bg-slate-900 relative">
      <div className="xl:hidden flex items-center">
        {!showSearch && <div className="flex items-center gap-3">
          <button onClick={() => setShowSidebar(true)} className="text-white text-2xl">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-1">
            <BookmarkIcon className="w-5 h-5 text-violet-500 fill-violet-500" />
            <span className="text-lg font-semibold text-white">
              Mark<span className="text-violet-500">IT</span>
            </span>
          </div>
        </div>}
        {showSearch && <button>
          <ArrowLeft onClick={() => setShowSearch(false)} className="w-5 h-5 text-white" />
        </button>}
      </div>
      <div className={`${showSearch ? "flex" : "hidden"} sm:flex w-full max-w-md items-center gap-2 bg-slate-800 px-3 py-2 rounded-xl focus-within:border focus-within:border-violet-500 transition`}>
        <Search className="w-5 h-5 text-gray-300" />
        <input
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onBlur={(e) => setShowSearch(false)}
          ref={searchRef}
          className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-400"
        />
      </div>
      <div className="flex gap-2 sm:gap-4 items-center">
        {!showSearch && <button onClick={() => setShowSearch(!showSearch)} className="sm:hidden text-white">
          <Search className="w-5 h-5" />
        </button>}
        {!showSearch && <button onClick={() => !isAddingBookmark && setIsAddingBookmark(true)} className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg ${isAddingBookmark ? "bg-slate-500 opacity-50 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700 cursor-pointer"} transition text-white font-semibold`}>
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Bookmark</span>
        </button>}
        <Link to="/profile">
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-gray-300 cursor-pointer">
            <img src={user?.avatar} alt="" className="w-full h-full object-cover rounded-full" />
          </div>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
