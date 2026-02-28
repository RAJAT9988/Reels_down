import { NextResponse } from "next/server";
import instagramClient from "@/lib/instagram-client";
const { instagramGetUrl } = instagramClient;

export async function POST(request) {
  try {
    const body = await request.json();
    const url = (body?.url || "").trim();
    if (!url) {
      return NextResponse.json(
        { error: "Instagram URL is required." },
        { status: 400 }
      );
    }
    if (!/instagram\.com\//i.test(url)) {
      return NextResponse.json(
        { error: "Please enter a valid Instagram post or reel URL." },
        { status: 400 }
      );
    }

    const data = await instagramGetUrl(url, {
      retries: 5,
      delay: 2000,
    });
    const details = Array.isArray(data?.media_details) ? data.media_details : [];
    const urlList = Array.isArray(data?.url_list) ? data.url_list : [];

    const media = [];
    if (details.length > 0) {
      details.forEach((item, i) => {
        const u = item?.url;
        if (u) {
          const isVideo = item.type === "video";
          media.push({
            url: u,
            type: isVideo ? "video" : "image",
            filename: `${isVideo ? "reel" : "image"}_${i + 1}.${isVideo ? "mp4" : "jpg"}`,
          });
        }
      });
    }
    if (media.length === 0 && urlList.length > 0) {
      urlList.forEach((u, i) => {
        const s = typeof u === "string" ? u : u?.url || u;
        if (s) {
          const isVideo = /\.(mp4|webm)/i.test(s);
          media.push({
            url: s,
            type: isVideo ? "video" : "image",
            filename: `${isVideo ? "reel" : "image"}_${i + 1}.${isVideo ? "mp4" : "jpg"}`,
          });
        }
      });
    }

    if (media.length === 0) {
      return NextResponse.json(
        { error: "No media found for this URL. It may be private or invalid." },
        { status: 404 }
      );
    }

    return NextResponse.json({ media });
  } catch (e) {
    console.error(e);
    const msg = e.message || "";
    const isBlocked =
      msg.includes("401") ||
      msg.includes("403") ||
      msg.includes("status code 401") ||
      msg.includes("status code 403");
    const userMessage = isBlocked
      ? "Instagram is blocking automated requests. Try again in a few minutes, or paste the link in your browser and use a downloader extension."
      : msg || "Could not fetch Instagram media. Try again.";
    return NextResponse.json(
      { error: userMessage },
      { status: isBlocked ? 503 : 500 }
    );
  }
}
