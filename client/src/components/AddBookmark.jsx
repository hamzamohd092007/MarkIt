import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { validateDescription, validateTitle, validateTag, validateURL } from '../utils/validators';
import { Flashlight, MoreVertical, Pencil, Plus, Upload, X } from 'lucide-react';

const AddBookmark = ({ tags, edit, setEdit, isEditingBookmark, setIsAddingBookmark, setIsEditingBookmark, handleAddBookmark, handleEditBookmark }) => {
  const [favicon, setFavicon] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [title, setTitle] = useState("");
  const [url, setURL] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const urlRef = useRef(null);
  const descRef = useRef(null);
  const MAX_DESC = 200;

  useEffect(() => {
    if (isEditingBookmark && edit) {
      setTitle(edit.title || "");
      setURL(edit.url || "");
      setDescription(edit.description || "");
      setFavicon(edit.favicon || "");
      setSelectedTags(edit.tags || []);
    }
  }, [isEditingBookmark, edit]);

  const handleFaviconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFavicon(preview);
      setFaviconFile(file);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!title.trim()) {
        return toast.error("Title cannot be empty.");
      }
      setTitle(validateTitle(title));
      urlRef.current?.focus();
    }
  };

  const handleUrlKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!url.trim()) {
        return toast.error("URL cannot be empty.");
      }
      setURL(validateURL(url))
      descRef.current?.focus();
    }
  };

  const handleDescKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!description.trim()) {
        return toast.error("Description cannot be empty.");
      }
      setDescription(validateDescription(description))
      e.target.blur();
    }
  };

  const handleSelectTag = (tag) => {
    setSelectedTags(prev => {
      const exists = prev.includes(tag.name);
      if (exists) {
        return prev.filter(t => t !== tag.name);
      } else {
        if (prev.length >= 3) {
          toast.error("Cannot select more than three tags.");
          return prev;
        }
        return [...prev, tag.name];
      }
    });
  };

  const handleAddNewTag = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const value = validateTag(newTag);
    if (!value) return toast.error("Tag cannot be empty.");
    if (selectedTags.length >= 3) {
      return toast.error("Cannot add more than three tags.");
    }
    if (selectedTags.some(t => t.toLowerCase() === value.toLowerCase())) {
      return toast.error("Tag already exists.");
    }
    setSelectedTags(prev => [
      ...prev, value
    ]);
    setNewTag("");
  };

  const tagNames = tags.map(tag => tag.name);
  const allTags = [
    ...tagNames,
    ...selectedTags.filter(
      t => !tagNames.includes(t)
    )
  ];

  const isValidUrl = /^https?:\/\/.+\..+/.test(url);
  const isCreateValid = !!(title.trim() && url.trim() && description.trim()) && isValidUrl;
  const isUrlChanged = url.trim() !== edit?.url;
  const hasChanges = favicon !== edit?.favicon || title.trim() !== edit?.title || isUrlChanged || description.trim() !== edit?.description || JSON.stringify(selectedTags) !== JSON.stringify(edit?.tags);
  const isUpdateValid = hasChanges && (!isUrlChanged || isValidUrl);

  const handleCreate = () => {
    handleAddBookmark({ favicon: faviconFile, title, url, description, tags: selectedTags });
    setFavicon(null);
    setFaviconFile(null);
    setTitle("");
    setURL("");
    setDescription("");
    setSelectedTags([]);
    setNewTag("");
    setIsAddingBookmark(false);
    setIsEditingBookmark(false);
  }

  const handleUpdate = () => {
    const payload = {
      favicon: faviconFile || null,
      title: title.trim() !== edit.title ? title : null,
      url: url.trim() !== edit.url ? url : null,
      description: description.trim() !== edit.description ? description : null,
      tags: JSON.stringify(selectedTags) !== JSON.stringify(edit.tags) ? selectedTags : null,
    };
    handleEditBookmark(edit._id, payload);
    setFavicon(null);
    setFaviconFile(null);
    setTitle("");
    setURL("");
    setDescription("");
    setSelectedTags([]);
    setNewTag("");
    setIsAddingBookmark(false);
    setIsEditingBookmark(false);
  };

  const handleCancel = () => {
    setFavicon(null);
    setFaviconFile(null);
    setTitle("");
    setURL("");
    setDescription("");
    setSelectedTags([]);
    setNewTag("");
    setIsAddingBookmark(false);
    setIsEditingBookmark(false);
  }

  return (
    <div className="w-full h-80 flex flex-col p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 hover:shadow-lg transition-all duration-200">  <div className="flex items-start justify-between text-white">
      <div className="flex items-center gap-3 min-w-0">
        <label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFaviconChange}
            className="hidden"
          />
          <div className="relative w-10 h-10 rounded-lg bg-slate-700 overflow-hidden border-2 border-slate-600 group">
            {favicon || edit?.favicon ? (
              <img src={favicon || edit?.favicon} alt="favicon" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Upload className="w-5 h-5" />
              </div>
            )}
            <div className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition cursor-pointer">
              <Upload className="w-6 h-6" />
            </div>
          </div>
        </label>
        <div className="flex flex-col min-w-0">
          <h3 className="text-sm font-semibold truncate">
            <input
              type="text"
              placeholder={`${isEditingBookmark ? edit.title : "Title"}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={(e) => setTitle(validateTitle(e.target.value))}
              onKeyDown={handleTitleKeyDown}
              className="outline-none border-none"
            />
          </h3>
          <span className="text-xs text-gray-400 truncate">
            <input
              type="text"
              placeholder={`${isEditingBookmark ? edit.url : "URL"}`}
              value={url}
              onChange={(e) => setURL(e.target.value)}
              onBlur={(e) => setURL(validateURL(e.target.value))}
              onKeyDown={handleUrlKeyDown}
              ref={urlRef}
              className="outline-none border-none"
            />
          </span>
        </div>
      </div>
      <MoreVertical onClick={() => setIsMoreOpen((prev) => !prev)} className="w-5 h-5 text-gray-400 cursor-not-allowed" />
    </div>
      <div className="my-3 border-b border-slate-700"></div>
      <div className="text-sm text-gray-300">
        <div className="relative">
          <span className="absolute top-0 right-0 text-xs text-gray-400">
            {description.length}/{MAX_DESC}
          </span>
          <textarea
            rows={4}
            maxLength={MAX_DESC}
            placeholder={`${isEditingBookmark ? edit.description : "Description"}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={(e) => setDescription(validateDescription(e.target.value))}
            onKeyDown={handleDescKeyDown}
            ref={descRef}
            className="w-full outline-none border-none pr-12"
          />
        </div>
      </div>
      <div className="flex mb-2 flex-wrap gap-2 mt-3 overflow-y-scroll">
        {allTags.map((tag) => (
          <span key={tag} onClick={() => handleSelectTag({ name: tag })} className={`bg-slate-800 text-gray-300 text-xs px-3 py-1 rounded-full hover:bg-slate-700 ${selectedTags.includes(tag) ? "" : "opacity-30"} cursor-pointer transition whitespace-nowrap`}>
            {tag}
          </span>
        ))}
        <span className="bg-slate-800 text-gray-300 text-xs px-3 py-1 rounded-full hover:bg-slate-700 cursor-pointer transition whitespace-nowrap">
          <input
            type="text"
            placeholder="TagName"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onBlur={(e) => setNewTag(validateTag(e.target.value))}
            className="max-w-16 text-center outline-none border-none"
            onKeyDown={handleAddNewTag}
          />
        </span>
      </div>
      <div className="flex gap-2 justify-end mt-auto">
        <button onClick={isEditingBookmark ? handleUpdate : handleCreate} disabled={isEditingBookmark ? !isUpdateValid : !isCreateValid} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition ${(isEditingBookmark ? isUpdateValid : isCreateValid) ? "bg-violet-600 hover:bg-violet-700 cursor-pointer" : "bg-violet-600 opacity-50 cursor-not-allowed"}`} >
          {isEditingBookmark ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <span>{isEditingBookmark ? "Update" : "Create"}</span>
        </button>
        <button onClick={handleCancel} className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition text-white font-semibold cursor-pointer`}>
          <X className="w-5 h-5" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  )
}

export default AddBookmark