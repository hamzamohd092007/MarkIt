import React from "react";
import API from '../utils/axios';
import { Link, useParams } from "react-router-dom";
import { Calendar, Clock, Eye, ExternalLink, Copy, ArrowLeft } from "lucide-react";

const BookmarkPage = ({ tags, bookmarks, setBookmarks }) => {
  const { id } = useParams();
  const clickedBookmark = bookmarks?.find((b) => id === b._id);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(clickedBookmark.url);
  };

  if (!clickedBookmark) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Bookmark not found
      </div>
    );
  }

  const handleVisit = async (bookmarkId, url) => {
    try {
      const { data } = await API.put(`/bookmark/visit/${bookmarkId}`);
      setBookmarks(prev => prev.map(bookmark => bookmark._id === bookmarkId ? data.bookmark : bookmark));
      window.open(url, "_blank");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const relatedBookmarks = bookmarks.filter((b) => b._id !== clickedBookmark._id).map((b) => {
    const matchCount = b.tags?.filter(tag =>
      clickedBookmark.tags?.includes(tag)
    ).length;
    return { ...b, matchCount };
  }).filter((b) => b.matchCount > 0).sort((a, b) => b.matchCount - a.matchCount);

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-10 text-white flex justify-center">
      <div className="w-full max-w-3xl bg-slate-800 border border-slate-700 rounded-2xl shadow-xl flex flex-col">
        <Link to="/">
          <div className="absolute m-3 text-white cursor-pointer">
            <ArrowLeft className="w-6 h-6" />
          </div>
        </Link>
        <div className="bg-slate-700/40 p-10 border-b border-slate-700">
          <div className="flex items-start gap-5">
            <img src={clickedBookmark.favicon} alt="favicon" className="w-28 h-28 rounded-xl object-cover border border-slate-600" />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold truncate">
                {clickedBookmark.title}
              </h1>
              <p className="text-sm text-gray-400 truncate mt-1">
                {clickedBookmark.url}
              </p>
              <div className="flex gap-2 mt-3">
                <button onClick={handleCopy} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-600 hover:bg-slate-500 rounded-lg transition cursor-pointer">
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
                <button onClick={() => handleVisit(clickedBookmark._id, clickedBookmark.url)} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-violet-600 hover:bg-violet-500 rounded-lg transition cursor-pointer">
                  <ExternalLink className="w-3 h-3" />
                  Visit
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6 flex-1">
          <div>
            <h2 className="text-gray-400 mb-1">Description</h2>
            <p className="text-gray-300 text-base leading-relaxed">
              {clickedBookmark.description || "No description provided."}
            </p>
          </div>
          {clickedBookmark.tags?.length > 0 && (
            <div>
              <h2 className="text-gray-400 mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {clickedBookmark.tags.map((tag) => (
                  <span key={tag} className="bg-slate-700 hover:bg-slate-600 transition text-gray-200 text-sm px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <h2 className="font-bold text-white my-2">
            Related Bookmarks
          </h2>
          {relatedBookmarks.length > 0 ? (
            <div>
              <div className="grid sm:grid-cols-2 gap-3">
                {relatedBookmarks.slice(0, 4).map((relatedBookmark) => (
                  <Link key={relatedBookmark._id} to={`/bookmark/${relatedBookmark._id}`} className="bg-slate-700 hover:bg-slate-600 transition p-3 rounded-xl flex gap-3 items-center">
                    <img src={relatedBookmark.favicon} alt="icon" className="w-10 h-10 rounded-md" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {relatedBookmark.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {relatedBookmark.url}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              No related bookmarks found
            </div>
          )}
        </div>
        <div className="border-t border-slate-700 px-6 py-4 bg-slate-800 rounded-b-2xl">
          <div className="flex justify-between text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="flex gap-1">
                <span className="hidden sm:block">
                  Total visits:
                </span>
                {clickedBookmark.visits === 0 ? "No visits" : (clickedBookmark.visits === 1 ? `${clickedBookmark.visits} visit` : `${clickedBookmark.visits} visits`)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="flex gap-1">
                <span className="hidden sm:block">
                  Created At:
                </span>
                {formatDate(clickedBookmark.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="flex gap-1">
                <span className="hidden sm:block">
                  Created At:
                </span>
                {formatDate(clickedBookmark.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkPage;