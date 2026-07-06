"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setStatus("loading");
    setMessage("Initializing download...");

    try {
      setVideoUrl("");
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to download");
      }

      setVideoUrl(data.url);
      setStatus("success");
      setMessage("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "An unknown error occurred");
    }
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4 sm:p-8 bg-yellow-300 selection:bg-pink-400 selection:text-black font-sans relative overflow-hidden">
      
      {/* Chaotic background animals */}
      <div className="absolute top-10 left-4 text-5xl md:text-6xl animate-bounce">🦦</div>
      <div className="absolute bottom-20 right-4 text-5xl md:text-6xl animate-pulse">🦒</div>
      <div className="absolute top-1/4 right-8 text-5xl md:text-6xl -rotate-12">🦥</div>
      <div className="absolute bottom-10 left-10 text-5xl md:text-6xl rotate-12">🦓</div>
      <div className="absolute top-1/2 left-2 text-5xl md:text-6xl">🦩</div>

      <div className="w-full max-w-xl p-6 sm:p-8 bg-pink-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex flex-col items-center transform md:rotate-1 transition-transform hover:rotate-0 duration-300 relative z-10 mx-auto my-auto">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-black mb-3 uppercase tracking-tighter flex items-center justify-center gap-2">
            Yeet The Video 🦦
          </h1>
          <p className="text-black font-bold text-base sm:text-lg px-4 py-2 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg inline-block rotate-[-2deg]">
            "Legally" acquire pixels from the internet.
          </p>
        </div>

        <form onSubmit={handleDownload} className="w-full flex flex-col gap-5 sm:gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-black font-black text-base sm:text-lg pl-1 uppercase tracking-wide">The Link</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Drop that juicy link here..."
              className="w-full bg-white border-4 border-black rounded-xl px-4 py-4 text-black font-bold placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-cyan-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-base sm:text-lg"
              disabled={status === "loading"}
            />
          </div>


          <button
            type="submit"
            disabled={status === "loading" || !url}
            className={`w-full py-4 rounded-xl font-black text-xl sm:text-2xl uppercase tracking-wider transition-all duration-200 border-4 border-black flex items-center justify-center gap-3 mt-2 sm:mt-4
              ${
                status === "loading"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] translate-y-[6px] translate-x-[6px]"
                  : "bg-cyan-400 hover:bg-cyan-300 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[4px] hover:translate-x-[4px] sm:hover:translate-y-[6px] sm:hover:translate-x-[6px] active:shadow-none active:translate-y-[6px] active:translate-x-[6px] sm:active:translate-y-[8px] sm:active:translate-x-[8px]"
              }
            `}
          >
            {status === "loading" ? (
              <>
                <span className="animate-bounce">🦦</span>
                Stealing...
              </>
            ) : (
              "GIMME THE VIDEO!"
            )}
          </button>
        </form>

        {status === "success" && videoUrl && (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full py-6 rounded-xl font-black text-2xl sm:text-3xl uppercase tracking-wider transition-all duration-200 border-4 border-black flex items-center justify-center gap-3 bg-green-400 hover:bg-green-300 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[4px] hover:translate-x-[4px] sm:hover:translate-y-[6px] sm:hover:translate-x-[6px] active:shadow-none active:translate-y-[6px] active:translate-x-[6px] sm:active:translate-y-[8px] sm:active:translate-x-[8px] animate-in fade-in zoom-in duration-300 rotate-1"
          >
            💾 OPEN VIDEO 💾
          </a>
        )}

        {status === "error" && message && (
          <div className="mt-6 sm:mt-8 p-4 w-full rounded-xl border-4 border-black font-bold text-center transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-base sm:text-lg bg-red-500 text-white -rotate-1">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
