import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Image Proxy API Route
 * Proxies Supabase storage images to bypass India's Supabase block
 * Usage: /api/image-proxy?url=https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Missing url parameter" },
        { status: 400 }
      );
    }

    // Only allow Supabase storage URLs for security
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!imageUrl.startsWith(`${supabaseUrl}/storage/`)) {
      return NextResponse.json(
        { error: "Invalid URL - only Supabase storage URLs allowed" },
        { status: 403 }
      );
    }

    // Fetch the image from Supabase
    const imageResponse = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: imageResponse.status }
      );
    }

    // Get the image data and content type
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType =
      imageResponse.headers.get("content-type") || "image/jpeg";

    // Return the image with proper caching headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
