import { useState, type FormEvent } from "react";
import { useAddLink } from "../hooks/useLinks";

interface LinkFormProps {
  onSuccess: (shortUrl: string, slug: string) => void;
}

const LinkForm = ({ onSuccess }: LinkFormProps) => {
  const [longUrl, setLongUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const mutation = useAddLink();
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5500";

  const handleSuccess = (data: { slug: string; shortUrl?: string }) => {
    const shortUrl = data.shortUrl || `${backendUrl}/${data.slug}`;
    onSuccess(shortUrl, data.slug);
    setLongUrl("");
    setUrlError("");
  };

  const validateUrl = (value: string): boolean => {
    if (!value) {
      setUrlError("URL is required");
      return false;
    }
    try {
      new URL(value);
      setUrlError("");
      return true;
    } catch {
      setUrlError("Please enter a valid URL (e.g., https://example.com)");
      return false;
    }
  };

  const handleUrlBlur = () => {
    validateUrl(longUrl);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isUrlValid = validateUrl(longUrl);

    if (!isUrlValid) {
      return;
    }

    mutation.mutate(longUrl, {
      onSuccess: handleSuccess,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="url" className="font-semibold text-gray-800 text-sm">
          Long URL <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="url"
          placeholder="https://example.com/very/long/url/path"
          value={longUrl}
          onChange={(e) => {
            setLongUrl(e.target.value);
            if (urlError) validateUrl(e.target.value);
          }}
          onBlur={handleUrlBlur}
          className={`px-4 py-3 border-2 rounded-xl text-base transition-all ${
            urlError
              ? "border-red-500 focus:ring-red-100"
              : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
          } focus:outline-none focus:ring-4 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60`}
          disabled={mutation.isPending}
        />
        {urlError && (
          <span className="text-red-500 text-sm flex items-center gap-1">
            {urlError}
          </span>
        )}
      </div>

      {mutation.isError && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg border-l-4 border-red-500 flex items-center gap-2 text-sm">
          <span className="text-lg">⚠️</span>
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Failed to create short link. Please try again."}
        </div>
      )}

      <button
        type="submit"
        disabled={mutation.isPending || !!urlError}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl text-lg transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-2"
      >
        {mutation.isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Shortening...
          </>
        ) : (
          "✨ Shorten URL"
        )}
      </button>
    </form>
  );
};

export default LinkForm;
