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
      const rapidApiRes = await fetch(`https://instagram-reels-downloader-api.p.rapidapi.com/download?url=${encodeURIComponent(url)}`, {
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

    // 2. YOUTUBE (Using RapidAPI)
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const ytIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      const ytId = ytIdMatch ? ytIdMatch[1] : null;

      if (!ytId) {
        throw new Error("Could not extract YouTube Video ID");
      }

      const rapidApiRes = await fetch(`https://youtube-video-fast-downloader-24-7.p.rapidapi.com/download_video/${ytId}?quality=720`, {
        headers: {
          "x-rapidapi-host": "youtube-video-fast-downloader-24-7.p.rapidapi.com",
          "x-rapidapi-key": "09357daa53msh84462b75a2a177ep170dfbjsnd5286fc0955f"
        }
      });
      const data = await rapidApiRes.json();
      
      if (!data.file) {
        throw new Error("Failed to extract YouTube video via API");
      }
      
      return NextResponse.json({
        success: true,
        url: data.file
      });
    }

    // 3. PINTEREST (Using RapidAPI)
    if (url.includes("pinterest.com") || url.includes("pin.it")) {
      const rapidApiRes = await fetch(`https://pinterest-video-and-image-downloader.p.rapidapi.com/pinterest?url=${encodeURIComponent(url)}`, {
        headers: {
          "x-rapidapi-host": "pinterest-video-and-image-downloader.p.rapidapi.com",
          "x-rapidapi-key": "09357daa53msh84462b75a2a177ep170dfbjsnd5286fc0955f"
        }
      });
      const data = await rapidApiRes.json();
      
      if (!data.success || !data.data || !data.data.url) {
        throw new Error("Failed to extract Pinterest video via API");
      }
      
      return NextResponse.json({
        success: true,
        url: data.data.url
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
