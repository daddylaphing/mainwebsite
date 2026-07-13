import { NextRequest, NextResponse } from "next/server";

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

    // Decode the URL if it's encoded
    const decodedUrl = decodeURIComponent(imageUrl);

    // Only allow Supabase storage URLs for security
    if (!decodedUrl.includes("supabase.co/storage/")) {
      return NextResponse.json(
        { error: "Invalid URL - only Supabase storage URLs allowed" },
        { status: 403 }
      );
    }

    // Fetch the image from Supabase
    const imageResponse = await fetch(decodedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!imageResponse.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch image",
          status: imageResponse.status,
        },
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
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
