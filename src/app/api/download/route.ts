import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import os from "os";
import fs from "fs";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { url, browser, username, password } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 }
      );
    }

    // Determine download path (user's Downloads folder)
    const downloadsDir = path.join(os.homedir(), "Downloads");
    
    // Ensure it exists (should exist on windows, but just in case)
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    if (url.includes("instagram.com")) {
      console.log("Using RapidAPI for Instagram download...");
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
      
      const videoUrl = data.data.medias[0].url;
      const shortcode = data.data.shortcode || `insta_${Date.now()}`;
      const outputPath = path.join(downloadsDir, `${shortcode}.mp4`);
      
      console.log("Downloading raw MP4 from RapidAPI...");
      const videoRes = await fetch(videoUrl);
      const buffer = await videoRes.arrayBuffer();
      fs.writeFileSync(outputPath, Buffer.from(buffer));
      
      return NextResponse.json({
        message: "Download complete! Check your Downloads folder.",
        success: true,
      });
    } else {
      // Use yt-dlp for everything else (like YouTube)
      const ytDlpPath = path.join(process.cwd(), "yt-dlp.exe");
      const outputTemplate = path.join(downloadsDir, "%(title)s.%(ext)s");
      
      let command = `"${ytDlpPath}" --no-playlist -o "${outputTemplate}"`;
      
      if (browser && browser !== "none") {
        command += ` --cookies-from-browser ${browser}`;
      }
      command += ` "${url}"`;
      
      console.log("Executing yt-dlp:", command);
      const { stdout, stderr } = await execAsync(command);
      console.log("yt-dlp stdout:", stdout);
      if (stderr) console.warn("yt-dlp stderr:", stderr);

      return NextResponse.json({
        message: "Download complete! Check your Downloads folder.",
        success: true,
      });
    }
  } catch (error: any) {
    console.error("Download Error:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to download video. Ensure it's a valid public link.",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
