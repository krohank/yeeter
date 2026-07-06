import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL provided" }, { status: 400 });
    }

    // 1. INSTAGRAM (Using existing RapidAPI)
    if (url.includes("instagram.com")) {
      const rapidApiRes = await fetch(\`https://instagram-reels-downloader-api.p.rapidapi.com/download?url=\${encodeURIComponent(url)}\`, {
        headers: {
          "x-rapidapi-host": "instagram-reels-downloader-api.p.rapidapi.com",
          "x-rapidapi-key": "09357daa53msh84462b75a2a177ep170dfbjsnd5286fc0955f"
        }
      });
      const data = await rapidApiRes.json();
      
      if (!data.success || !data.data || !data.data.medias || !data.data.medias.length) {
        throw new Error("Failed to extract Instagram video via API");
      }
      
      return NextResponse.json({
        success: true,
        url: data.data.medias[0].url
      });
    }

    // 2. YOUTUBE & PINTEREST (Using Cobalt API - robust cloud downloader)
    if (url.includes("youtube.com") || url.includes("youtu.be") || url.includes("pinterest.com") || url.includes("pin.it") || url.includes("tiktok.com")) {
      const cobaltRes = await fetch("https://api.cobalt.tools/api/json", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: url,
          vQuality: "720"
        })
      });

      if (!cobaltRes.ok) {
         throw new Error("Failed to extract video from this platform.");
      }

      const data = await cobaltRes.json();
      
      if (data.status === "error") {
        throw new Error("API Error: " + data.text);
      }
      
      return NextResponse.json({
        success: true,
        url: data.url
      });
    }

    throw new Error("Platform not currently supported.");

  } catch (error: any) {
    console.error("Download Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch video link. Ensure it's public.", details: error.message },
      { status: 500 }
    );
  }
}
