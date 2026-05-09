import React, { useEffect, useRef, useState } from "react";
import { validateTag } from "../utils/validators";
import { Archive, BookmarkIcon, Home, Menu, Plus, X } from "lucide-react";

const Sidebar = ({ tags, bookmarks, currentPage, setCurrentPage, showSidebar, setShowSidebar, handleAddTag, handleCheckTag, handleDeleteTag }) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagName, setTagName] = useState("");
  const targetTagName = "someTag";
  const newTaskRef = useRef();

  useEffect(() => {
    if (isAddingTag) {
      newTaskRef.current?.focus();
    }
  }, [isAddingTag]);

  const addTag = () => {
    handleAddTag({ name: validateTag(tagName) });
    setTagName("");
    setIsAddingTag(false);
  }

  return (
    <>
      <div onClick={() => setShowSidebar(false)} className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 xl:hidden ${showSidebar ? "opacity-100 visible" : "opacity-0 invisible"}`} />
      <div className={`fixed xl:static top-0 left-0 z-50 h-screen w-72 bg-slate-900 border-r border-slate-700 transform transition-transform duration-300 ease-in-out ${showSidebar ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0 xl:flex flex flex-col px-4 `}>
        <div className="flex items-center gap-3 py-6">
          {showSidebar && <button onClick={() => setShowSidebar(false)} className="text-white text-2xl">
            <Menu className="w-6 h-6" />
          </button>}
          <div className="flex items-center gap-1">
            <BookmarkIcon className="w-5 h-5 text-violet-500 fill-violet-500" />
            <span className="text-lg font-semibold text-white">
              Mark<span className="text-violet-500">IT</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <div onClick={() => setCurrentPage("Home")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 ${currentPage === "Home" ? "bg-slate-800" : "hover:bg-slate-800"} cursor-pointer transition`}>
            <Home className="w-4 h-4" />
            <span className="text-gray-300">Home</span>
          </div>
          <div onClick={() => setCurrentPage("Archive")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 ${currentPage === "Archive" ? "bg-slate-800" : "hover:bg-slate-800"} cursor-pointer transition`}>
            <Archive className="w-4 h-4" />
            <span className="text-gray-300">Archive</span>
          </div>
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <h2 className="text-sm text-slate-400 mb-3 uppercase tracking-wide">
            Tags
          </h2>
          <div className="flex flex-col gap-1 overflow-y-auto pr-1">
            {tags?.map((tag, index) => (
              <label key={index} className="group flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700/60 transition-all duration-150 cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tag.checked}
                    onChange={() => handleCheckTag(tag._id)}
                    className="w-4 h-4 border border-light rounded-xs bg-neutral-secondary-medium"
                  />
                </div>
                <div className="flex w-full items-center justify-between">
                  <span className="text-gray-300 text-sm group-hover:text-white transition">
                    {tag.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center text-xs font-medium bg-violet-500 text-white rounded-full group-hover:hidden">
                      {bookmarks.filter(bookmark => bookmark.tags.includes(tag.name)).length}
                    </div>
                    <button onClick={(e) => handleDeleteTag(tag._id)} className="hidden group-hover:flex items-center justify-center w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer transition">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </label>
            ))}
            {isAddingTag && <label className="flex items-center gap-2 p-2 rounded-lg transition-all duration-150">
              <span className="text-gray-300 text-sm group-hover:text-white transition">
                <input
                  type="text"
                  placeholder="TagName"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  onBlur={addTag}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  ref={newTaskRef}
                  className="outline-none border-none"
                />
              </span>
            </label>}
          </div>
        </div>
        <div className="py-4 border-t border-slate-700">
          <button
            onClick={() => !isAddingTag && setIsAddingTag(true)} className="flex gap-2 w-full py-2 items-center justify-center rounded-lg bg-violet-600 hover:bg-violet-700 transition text-white font-semibold cursor-pointer">
            <Plus className="w-5 h-5" />
            <span>Add Tag</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;