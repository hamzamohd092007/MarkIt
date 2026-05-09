import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import API from './utils/axios.js';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import BookmarkPage from './pages/BookmarkPage.jsx';
import ProfilePage from './pages/ProfilePage';
import Loading from './components/Loading';

function App() {
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState(null);
  const [bookmarks, setBookmarks] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyUser = async () => {
    try {
      const { data } = await API.get("/user/me");
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    verifyUser();
  }, []);

  const fetchData = async () => {
    try {
      const [tagsRes, bookmarksRes] = await Promise.all([
        API.get("/tag/get"),
        API.get("/bookmark/get"),
      ]);
      setTags(tagsRes.data.tags);
      setBookmarks(bookmarksRes.data.bookmarks);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchData();
    }
  }, [user?._id]);

  const handleLogout = () => {
    setUser(null);
    setTags(null);
    setBookmarks(null);
    localStorage.removeItem("token");
  }

  const handleDelete = async () => {
    try {
      const { data } = await API.delete("/user/delete");
      setUser(null);
      setTags(null);
      setBookmarks(null);
      localStorage.removeItem("token");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  if (loading || (user && (!tags || !bookmarks))) {
    return <Loading />;
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/auth" element={!user ? <AuthPage setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <HomePage user={user} tags={tags} bookmarks={bookmarks} setTags={setTags} setBookmarks={setBookmarks} /> : <Navigate to="/auth" />} />
        <Route path="/bookmark/:id" element={user ? <BookmarkPage tags={tags} bookmarks={bookmarks} setBookmarks={setBookmarks} /> : <Navigate to="/auth" />} />
        <Route path="/profile" element={user ? <ProfilePage user={user} bookmarks={bookmarks} setUser={setUser} verifyUser={verifyUser} handleLogout={handleLogout} handleDelete={handleDelete} /> : <Navigate to="/auth" />} />
      </Routes>
    </>
  );
}

export default App;