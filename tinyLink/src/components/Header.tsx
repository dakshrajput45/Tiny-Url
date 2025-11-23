import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <h1 className="text-white text-lg md:text-2xl sm:text-3xl font-bold tracking-tight">
            TinyLink
          </h1>
        </Link>
        <nav className="flex gap-3 sm:gap-4">
          <Link
            to="/"
            className={`text-white font-medium px-3 py-2 rounded-lg transition-colors ${
              isActive("/") ? "bg-white/25" : "hover:bg-white/15"
            }`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`text-white font-medium px-3 py-2 rounded-lg transition-colors ${
              isActive("/dashboard") ? "bg-white/25" : "hover:bg-white/15"
            }`}
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
