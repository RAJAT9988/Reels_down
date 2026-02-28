import { NextResponse } from "next/server";
import { instagramGetUrl } from "instagram-url-direct";

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

    const data = await instagramGetUrl(url);
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
    return NextResponse.json(
      { error: e.message || "Could not fetch Instagram media. Try again." },
      { status: 500 }
    );
  }
}
