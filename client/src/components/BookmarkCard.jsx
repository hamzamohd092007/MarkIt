import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, MoreVertical, PinIcon } from 'lucide-react'

const BookmarkCard = ({ bookmark, currentPage, edit, setEdit, isAddingBookmark, isEditingBookmark, setIsEditingBookmark, handleDeleteBookmark, handleArchiveBookmark, handlePinBookmark }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleEdit = (bookmark) => {
    setIsEditingBookmark(true);
    setEdit(bookmark)
  }

  return (
    <div className={`${(isEditingBookmark && edit?._id === bookmark._id) ? "hidden" : ""} w-full h-80 flex flex-col p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 hover:shadow-lg transition-all duration-200`}>
      <div className="flex items-start justify-between text-white">
        <Link to={`/bookmark/${bookmark._id}`} onClick={() => bookmark} className="flex items-center gap-3 min-w-0">
          <img
            src={bookmark.favicon}
            alt="favicon"
            className="w-10 h-10 rounded-lg object-cover shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-semibold truncate">
              {bookmark.title}
            </h3>
            <span className="text-xs text-gray-400 truncate">
              {bookmark.url}
            </span>
          </div>
        </Link>
        <div ref={moreRef} className="relative">
          <MoreVertical onClick={() => setIsMoreOpen((prev) => !prev)} className="w-5 h-5 text-gray-400 shrink-0 cursor-pointer hover:text-white" />
          {isMoreOpen && <div className="absolute right-0 mt-2 w-32 bg-slate-700 rounded-lg shadow-lg z-50">
            <ul className="px-2 py-2 text-white text-sm">
              <li onClick={() => handleEdit(bookmark)} className="px-4 py-2 hover:bg-slate-600 rounded-lg cursor-pointer">
                Edit
              </li>
              <li onClick={() => handleDeleteBookmark(bookmark._id)} className="px-4 py-2 hover:bg-slate-600 rounded-lg cursor-pointer">
                Delete
              </li>
              <li onClick={() => handleArchiveBookmark(bookmark._id)} className="px-4 py-2 hover:bg-slate-600 rounded-lg cursor-pointer">
                {currentPage === "Home" ? "Archive" : "Unarchive"}
              </li>
            </ul>
          </div>}
        </div>
      </div>
      <div className="my-3 border-b border-slate-700"></div>
      <p className="text-sm text-gray-300">
        {bookmark.description}
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        {bookmark.tags?.slice(0, 4).map((tag) => (
          <span key={tag} className="bg-slate-800 text-gray-300 text-xs px-3 py-1 rounded-full hover:bg-slate-700 transition whitespace-nowrap">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between text-gray-400 pt-4 gap-2">
        <div className="flex flex-wrap gap-3 items-center text-xs">
          <div className="flex gap-1 items-center">
            <Eye className="w-4 h-4" />
            <span>{bookmark.visits}</span>
          </div>
          <div className="flex gap-1 items-center">
            <Clock className="w-4 h-4" />
            <span className="truncate max-w-20">
              {formatDate(bookmark.createdAt)}
            </span>
          </div>
          <div className="flex gap-1 items-center">
            <Calendar className="w-4 h-4" />
            <span className="truncate max-w-20">
              {formatDate(bookmark.updatedAt)}
            </span>
          </div>
        </div>
        <PinIcon onClick={() => handlePinBookmark(bookmark._id)} className={`w-4 h-4 cursor-pointer ${bookmark.pinned ? "fill-white" : ""}`} />
      </div>
    </div>
  );
};

export default BookmarkCard
