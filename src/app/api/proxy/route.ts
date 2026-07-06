import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing URL", { status: 400 });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return new NextResponse("Failed to proxy video", { status: response.status });
    }

    // Pass the stream through with the attachment header to force a download
    return new NextResponse(response.body, {
      headers: {
        "Content-Disposition": 'attachment; filename="yeet_video.mp4"',
        "Content-Type": response.headers.get("Content-Type") || "video/mp4",
      },
    });
  } catch (err: any) {
    return new NextResponse("Proxy Error: " + err.message, { status: 500 });
  }
}
