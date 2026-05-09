import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import Navbar from './Navbar'
import BookmarkCard from './BookmarkCard'
import AddBookmark from './AddBookmark'
import Footer from './Footer'

const Manager = ({ user, tags, bookmarks, currentPage, showSidebar, setShowSidebar, handleAddBookmark, handleEditBookmark, handleDeleteBookmark, handleArchiveBookmark, handlePinBookmark }) => {
  const unarchivedBookmarks = bookmarks?.filter(bookmark => bookmark.userId === user._id).filter(bookmark => !bookmark.archived);
  const archivedBookmarks = bookmarks?.filter(bookmark => bookmark.userId === user._id).filter(bookmark => bookmark.archived);
  const selectedTags = tags?.filter(tag => tag.checked).map(tag => tag.name);
  const [sortOption, setSortOption] = useState("Newest first");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);
  const [edit, setEdit] = useState(null);
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [isEditingBookmark, setIsEditingBookmark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const getSortedBookmarks = (bookmarks) => {
    const sorted = [...bookmarks];
    let sortedList;
    switch (sortOption) {
      case "Newest first":
        sortedList = sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "Oldest first":
        sortedList = sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "Recently Updated":
        sortedList = sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        break;
      case "Most visited":
        sortedList = sorted.sort((a, b) => b.visits - a.visits);
        break;
      case "Least visited":
        sortedList = sorted.sort((a, b) => a.visits - b.visits);
        break;
      case "A → Z":
        sortedList = sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Z → A":
        sortedList = sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        sortedList = sorted;
    }
    return sortedList.sort((a, b) => (b.pinned === true) - (a.pinned === true));
  };

  const displayedBookmarks = useMemo(() => {
    const source = currentPage === "Home" ? unarchivedBookmarks : archivedBookmarks;
    let filtered = selectedTags.length === 0 ? source : source.filter(bookmark => bookmark.tags?.some(tag => selectedTags.includes(tag)));
    if (searchQuery.trim()) {
      filtered = filtered.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return getSortedBookmarks(filtered);
  }, [currentPage, unarchivedBookmarks, archivedBookmarks, sortOption, tags, searchQuery]);

  const isSortDisabled = displayedBookmarks.length <= 1;

  useEffect(() => {
    setIsSortOpen(false);
  }, [isSortDisabled, sortOption]);

  return (
    <div className="w-full h-screen flex flex-col bg-slate-800">
      <Navbar user={user} showSidebar={showSidebar} setShowSidebar={setShowSidebar} searchQuery={searchQuery} setSearchQuery={setSearchQuery} isAddingBookmark={isAddingBookmark} setIsAddingBookmark={setIsAddingBookmark} />
      <div className="w-full flex flex-col flex-1 overflow-y-auto">
        <div className="flex flex-col gap-8 px-8 py-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl text-white font-bold">All Bookmarks</h2>
            <div ref={sortRef} className="relative">
              <button onClick={() => !isSortDisabled && setIsSortOpen((prev) => !prev)} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isSortDisabled ? "bg-slate-500 opacity-50" : "bg-violet-600 hover:bg-violet-700"} transition text-white font-semibold cursor-pointer`}>
                <ArrowUpDown className="w-5 h-5" />
                <span>Sort</span>
              </button>
              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-lg shadow-lg z-50">
                  <ul className="px-2 py-2 text-white text-sm">
                    {["Newest first", "Oldest first", "Recently Updated", "Most visited", "Least visited", "A → Z", "Z → A"].map((option) => (
                      <li key={option} onClick={() => setSortOption(option)} className={`px-4 py-2 ${sortOption === option ? "bg-slate-600" : "hover:bg-slate-600"} rounded-lg cursor-pointer`}>{option}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
            {(isAddingBookmark || isEditingBookmark) && <AddBookmark tags={tags} edit={edit} setEdit={setEdit} setIsAddingBookmark={setIsAddingBookmark} isEditingBookmark={isEditingBookmark} setIsEditingBookmark={setIsEditingBookmark} handleAddBookmark={handleAddBookmark} handleEditBookmark={handleEditBookmark} />}
            {displayedBookmarks.length !== 0 ? displayedBookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark._id} bookmark={bookmark} currentPage={currentPage} edit={edit} setEdit={setEdit} isAddingBookmark={isAddingBookmark} isEditingBookmark={isEditingBookmark} setIsEditingBookmark={setIsEditingBookmark} handleDeleteBookmark={handleDeleteBookmark} handleArchiveBookmark={handleArchiveBookmark} handlePinBookmark={handlePinBookmark} />
            )) : !(isAddingBookmark || isEditingBookmark) && (
              <div className="col-span-full flex items-center justify-center min-h-50 text-gray-300">
                No bookmarks found
              </div>
            )}
          </div>
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Manager
