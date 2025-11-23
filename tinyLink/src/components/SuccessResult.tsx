import { useState } from "react";

interface SuccessResultProps {
  shortUrl: string;
  slug: string;
}

const SuccessResult = ({ shortUrl, slug }: SuccessResultProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy. Please copy manually.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-cyan-50 border-2 border-green-400 rounded-xl p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-3xl">✅</span>
        <h3 className="text-green-900 text-xl font-semibold">
          Your link has been shortened!
        </h3>
      </div>

      <div className="bg-white rounded-lg p-5 mb-5 space-y-4">
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-gray-600 text-xs uppercase tracking-wide">
            Slug:
          </span>
          <code className="bg-gray-50 px-3 py-2 rounded-md font-mono text-base text-gray-800 border border-gray-200">
            {slug}
          </code>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-semibold text-gray-600 text-xs uppercase tracking-wide">
            Short URL:
          </span>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 font-medium break-all px-3 py-2 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 hover:border-indigo-600 transition-all"
          >
            {shortUrl}
          </a>
        </div>
      </div>

      <button
        onClick={copyToClipboard}
        className={`w-full font-semibold px-6 py-3 rounded-lg text-base transition-all flex items-center justify-center gap-2 ${
          copied
            ? "bg-green-700 text-white"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        {copied ? (
          <>
            <span>✓</span> Copied!
          </>
        ) : (
          <>
            <span>📋</span> Copy to Clipboard
          </>
        )}
      </button>
    </div>
  );
};

export default SuccessResult;
