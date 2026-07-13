import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  try {
    const url = new URL(req.url);
    const imageUrl = url.searchParams.get("url");

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "Missing url parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Only allow Supabase storage URLs for security
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!imageUrl.startsWith(`${supabaseUrl}/storage/`)) {
      return new Response(
        JSON.stringify({
          error: "Invalid URL - only Supabase storage URLs allowed",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch the image from Supabase
    const imageResponse = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!imageResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch image" }),
        {
          status: imageResponse.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get the image data and content type
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType =
      imageResponse.headers.get("content-type") || "image/jpeg";

    // Return the image with proper caching headers
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const config = {
  path: "/api/image-proxy",
};
