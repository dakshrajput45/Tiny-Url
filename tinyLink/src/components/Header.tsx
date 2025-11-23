const Header = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🔗</span>
          <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">
            TinyLink
          </h1>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <a
            href="/"
            className="text-white font-medium px-3 py-2 rounded-lg hover:bg-white/15 transition-colors"
          >
            Home
          </a>
          <a
            href="/links"
            className="text-white font-medium px-3 py-2 rounded-lg hover:bg-white/15 transition-colors"
          >
            My Links
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
