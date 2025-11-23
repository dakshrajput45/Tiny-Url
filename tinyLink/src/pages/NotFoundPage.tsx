import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full text-center">
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-500"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-4">
              404
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3">
              Link Not Found
            </h2>
            <p className="text-base text-gray-500">
              Oops! The short link you're looking for doesn't exist or may have
              been deleted.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <p className="text-sm text-gray-600 mb-4 font-medium">
              This could happen if:
            </p>
            <ul className="text-left text-sm text-gray-600 space-y-2 max-w-sm mx-auto">
              <li className="flex items-start gap-3">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span>The link has been deleted by its creator</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span>The short code was typed incorrectly</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span>The link has expired or never existed</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-6 py-2.5 rounded-lg transition-all hover:shadow-md hover:-translate-y-0.5 text-sm"
            >
              Create New Link
            </Link>
            <Link
              to="/dashboard"
              className="bg-white text-gray-700 font-medium px-6 py-2.5 rounded-lg border border-gray-300 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-gray-400 text-sm"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
