import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useGetAllLinks, useDeleteLink } from "../hooks/useLinks";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5500";

  const { data: links, isLoading, isError, error, refetch } = useGetAllLinks();
  const deleteMutation = useDeleteLink();

  const handleRefreshStats = async () => {
    setIsRefreshing(true);
    await refetch();
    // Keep loading state for at least 800ms to show the animation
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleShortUrlClick = async () => {
    // Refresh stats after the link is clicked
    setTimeout(() => {
      refetch();
    }, 500);
  };

  const handleDelete = (slug: string) => {
    if (window.confirm(`Are you sure you want to delete link: ${slug}?`)) {
      deleteMutation.mutate(slug);
    }
  };

  const filteredLinks = links?.filter((link) => {
    const query = searchQuery.toLowerCase();
    return (
      link._id.toLowerCase().includes(query) ||
      (link.url && link.url.toLowerCase().includes(query))
    );
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-sm md:text-lg text-gray-600 hidden md:block">
              Manage all your shortened links
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefreshStats}
              disabled={isRefreshing}
              className="bg-white text-indigo-600 font-semibold px-3 md:px-4 py-1 md:py-3 rounded-xl border-2 border-indigo-600 transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh stats"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isRefreshing ? "animate-spin" : ""}
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
              <span className="hidden md:inline">
                {isRefreshing ? "Loading..." : "Refresh"}
              </span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-3 md:px-6 py-1 md:py-3 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-0 md:gap-2"
            >
              <span className="text- sm md:text-xl">+</span>
              Add Link
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search by code or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
            />
          </div>

          {isLoading && (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading links...</p>
            </div>
          )}

          {isError && (
            <div className="p-12 text-center text-red-600">
              <span className="text-4xl mb-4 block">⚠️</span>
              Error loading links:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </div>
          )}

          {!isLoading &&
            !isError &&
            filteredLinks &&
            filteredLinks.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <span className="text-6xl mb-4 block">🔍</span>
                <p className="text-xl font-semibold mb-2">No links found</p>
                <p>
                  {searchQuery
                    ? "Try a different search term"
                    : "Create your first link to get started"}
                </p>
              </div>
            )}

          {!isLoading &&
            !isError &&
            filteredLinks &&
            filteredLinks.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Short Code
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Short URL
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Target URL
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Clicks
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Last Clicked
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLinks.map((link) => (
                      <tr
                        key={link._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <code className="font-mono font-semibold text-indigo-600">
                            {link._id}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <a
                              href={`${backendUrl}/${link._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={handleShortUrlClick}
                              className="text-indigo-600 hover:text-indigo-800 font-medium truncate max-w-xs"
                              title={`${backendUrl}/${link._id}`}
                            >
                              {backendUrl}/{link._id}
                            </a>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${backendUrl}/${link._id}`
                                );
                              }}
                              className="text-gray-500 hover:text-indigo-600 p-1 rounded hover:bg-indigo-50 transition-colors"
                              title="Copy short URL"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="inline-block"
                                aria-hidden="true"
                                focusable="false"
                              >
                                <rect
                                  x="9"
                                  y="9"
                                  width="11"
                                  height="11"
                                  rx="2"
                                />
                                <rect
                                  x="3"
                                  y="3"
                                  width="11"
                                  height="11"
                                  rx="2"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-700 hover:text-indigo-600 truncate block max-w-xs"
                              title={link.url}
                            >
                              {link.url}
                            </a>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(link.url);
                              }}
                              className="text-gray-500 hover:text-indigo-600 p-1 rounded hover:bg-indigo-50 transition-colors"
                              title="Copy target URL"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="inline-block"
                                aria-hidden="true"
                                focusable="false"
                              >
                                <rect
                                  x="9"
                                  y="9"
                                  width="11"
                                  height="11"
                                  rx="2"
                                />
                                <rect
                                  x="3"
                                  y="3"
                                  width="11"
                                  height="11"
                                  rx="2"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                            <span
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              aria-hidden
                            />
                            <span className="font-medium">
                              {link.analytics.clickCount}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(link.analytics.lastClickedAt || "")}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(link._id)}
                            disabled={deleteMutation.isPending}
                            className="text-red-600 hover:text-red-800 font-semibold px-3 py-1 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete link"
                            aria-label={`Delete link ${link._id}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="inline-block"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                              <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          {!isLoading &&
            !isError &&
            filteredLinks &&
            filteredLinks.length > 0 && (
              <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-600">
                Showing {filteredLinks.length}{" "}
                {filteredLinks.length === 1 ? "link" : "links"}
              </div>
            )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
