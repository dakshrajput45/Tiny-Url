import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LinkForm from "../components/LinkForm";
import SuccessResult from "../components/SuccessResult";
import EmptyState from "../components/EmptyState";

const HomePage = () => {
  const [shortUrl, setShortUrl] = useState("");
  const [slug, setSlug] = useState("");

  const handleSuccess = (url: string, generatedSlug: string) => {
    setShortUrl(url);
    setSlug(generatedSlug);
  };

  const handleCreateAnother = () => {
    setShortUrl("");
    setSlug("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Shorten Your URLs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform long, unwieldy URLs into short, memorable links that are
            easy to share.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 border border-gray-100">
          <LinkForm onSuccess={handleSuccess} />

          <div className="mt-8 pt-8 border-t-2 border-gray-100">
            {!shortUrl ? (
              <EmptyState />
            ) : (
              <>
                <SuccessResult shortUrl={shortUrl} slug={slug} />
                <button
                  onClick={handleCreateAnother}
                  className="w-full mt-4 bg-white text-indigo-600 border-2 border-indigo-600 font-semibold px-6 py-3 rounded-xl transition-all hover:bg-gray-50 hover:-translate-y-0.5"
                >
                  Create Another Link
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
