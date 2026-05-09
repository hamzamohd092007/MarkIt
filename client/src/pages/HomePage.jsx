import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import API from '../utils/axios';
import Sidebar from '../components/Sidebar'
import Manager from '../components/Manager'

const HomePage = ({ user, tags, bookmarks, setTags, setBookmarks }) => {
  const [currentPage, setCurrentPage] = useState("Home");
  const [showSidebar, setShowSidebar] = useState(false);

  const handleAddTag = async (tagData) => {
    try {
      const { data } = await API.post("/tag/add", tagData);
      toast.success("Tag added");
      setTags(prev => [...prev, data.tag]);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const handleCheckTag = async (tagId) => {
    try {
      const { data } = await API.put(`/tag/check/${tagId}`);
      setTags(prev => prev.map(tag => tag._id === tagId ? data.tag : tag));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleDeleteTag = async (tagId) => {
    try {
      const { data } = await API.delete(`/tag/delete/${tagId}`);
      toast.success("Tag deleted");
      setTags(prev => prev.filter(tag => tag._id !== tagId));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const handleAddBookmark = async (bookmarkData) => {
    try {
      const formData = new FormData();
      formData.append("title", bookmarkData.title);
      formData.append("url", bookmarkData.url);
      formData.append("description", bookmarkData.description);
      bookmarkData.tags.forEach(tag => { formData.append("tags", tag); });
      if (bookmarkData.favicon) {
        formData.append("favicon", bookmarkData.favicon);
      }
      const { data } = await API.post("/bookmark/add", formData);
      toast.success("Bookmark added");
      setBookmarks(prev => [...prev, data.bookmark]);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleEditBookmark = async (bookmarkId, bookmarkData) => {
    try {
      const formData = new FormData();
      if (bookmarkData.title) {
        formData.append("title", bookmarkData.title);
      }
      if (bookmarkData.url) {
        formData.append("url", bookmarkData.url);
      }
      if (bookmarkData.description) {
        formData.append("description", bookmarkData.description);
      }
      if (bookmarkData.tags) {
        bookmarkData.tags.forEach(tag => {
          formData.append("tags", tag);
        });
      }
      if (bookmarkData.favicon) {
        formData.append("favicon", bookmarkData.favicon);
      }
      const { data } = await API.put(`/bookmark/edit/${bookmarkId}`, formData);
      toast.success("Bookmark edited");
      setBookmarks(prev => prev.map(bookmark => bookmark._id === bookmarkId ? data.bookmark : bookmark));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    try {
      const { data } = await API.delete(`/bookmark/delete/${bookmarkId}`);
      toast.success("Bookmark deleted");
      setBookmarks(prev => prev.filter(bookmark => bookmark._id !== bookmarkId));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const handleArchiveBookmark = async (bookmarkId) => {
    try {
      const { data } = await API.put(`/bookmark/archive/${bookmarkId}`);
      setBookmarks(prev => prev.map(bookmark => bookmark._id === bookmarkId ? data.bookmark : bookmark));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const handlePinBookmark = async (bookmarkId) => {
    try {
      const { data } = await API.put(`/bookmark/pin/${bookmarkId}`);
      setBookmarks(prev => prev.map(bookmark => bookmark._id === bookmarkId ? data.bookmark : bookmark));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  return (
    <div className="flex w-screen h-screen">
      <Sidebar tags={tags} bookmarks={bookmarks} currentPage={currentPage} setCurrentPage={setCurrentPage} showSidebar={showSidebar} setShowSidebar={setShowSidebar} handleAddTag={handleAddTag} handleCheckTag={handleCheckTag} handleDeleteTag={handleDeleteTag} />
      <Manager user={user} tags={tags} bookmarks={bookmarks} currentPage={currentPage} showSidebar={showSidebar} setShowSidebar={setShowSidebar} handleAddBookmark={handleAddBookmark} handleEditBookmark={handleEditBookmark} handleDeleteBookmark={handleDeleteBookmark} handleArchiveBookmark={handleArchiveBookmark} handlePinBookmark={handlePinBookmark} />
    </div>
  )
}

export default HomePage
