import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useGetLink } from "../hooks/useLinks";

const StatsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: link, isLoading, isError, error } = useGetLink(slug || "");

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch {
      alert("Failed to copy");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Link Statistics
          </h2>
          <p className="text-gray-600">
            Detailed analytics for your shortened link
          </p>
        </div>

        {isLoading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading statistics...</p>
          </div>
        )}

        {isError && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h3 className="text-2xl font-bold text-red-600 mb-2">
              Error Loading Link
            </h3>
            <p className="text-gray-600 mb-6">
              {error instanceof Error ? error.message : "Link not found"}
            </p>
            <Link
              to="/dashboard"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        )}

        {!isLoading && !isError && link && (
          <div className="space-y-6">
            {/* Link Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🔗</span> Link Information
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Short Code
                  </span>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-50 px-4 py-3 rounded-lg font-mono text-lg font-bold text-indigo-600 border border-gray-200">
                      {link._id}
                    </code>
                    <button
                      onClick={() => copyToClipboard(link._id)}
                      className="px-4 py-3 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 font-semibold transition-colors"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Short URL
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`${window.location.origin}/${link._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-50 px-4 py-3 rounded-lg text-indigo-600 border border-gray-200 hover:bg-gray-100 transition-colors font-medium"
                    >
                      {window.location.origin}/{link._id}
                    </a>
                    <button
                      onClick={() =>
                        copyToClipboard(`${window.location.origin}/${link._id}`)
                      }
                      className="px-4 py-3 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 font-semibold transition-colors"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Target URL
                  </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-50 px-4 py-3 rounded-lg text-gray-700 border border-gray-200 hover:bg-gray-100 hover:text-indigo-600 transition-colors break-all"
                  >
                    {link.url}
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide block mb-2">
                      Created At
                    </span>
                    <p className="text-gray-800 font-medium">
                      {formatDate(link.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide block mb-2">
                      Last Updated
                    </span>
                    <p className="text-gray-800 font-medium">
                      {formatDate(link.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📊</span> Analytics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                  <div className="text-4xl font-bold text-blue-700 mb-2">
                    {link.analytics.clickCount}
                  </div>
                  <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                    Total Clicks
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
                  <div className="text-4xl font-bold text-purple-700 mb-2">
                    {link.analytics.totalUniqueClicks || 0}
                  </div>
                  <div className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                    Unique Visitors
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                  <div className="text-sm font-bold text-green-700 mb-2">
                    {formatDate(link.analytics.lastClickedAt || "")}
                  </div>
                  <div className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                    Last Clicked
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`${window.location.origin}/${link._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[200px] bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-center"
                >
                  🔗 Visit Short Link
                </a>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[200px] bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-center"
                >
                  🌐 Visit Target URL
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default StatsPage;
