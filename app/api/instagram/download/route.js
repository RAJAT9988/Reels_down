import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaUrl = searchParams.get("url");
    const filename = searchParams.get("filename") || "download.mp4";

    if (!mediaUrl) {
      return NextResponse.json({ error: "Missing url parameter." }, { status: 400 });
    }

    const res = await fetch(mediaUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Could not fetch media." },
        { status: 502 }
      );
    }

    const blob = await res.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": res.headers.get("content-type") || "video/mp4",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Download failed." },
      { status: 500 }
    );
  }
}
