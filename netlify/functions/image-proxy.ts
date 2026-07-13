import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const url = new URL(req.url);
    const imageUrl = url.searchParams.get("url");

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "Missing url parameter" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Decode the URL if it's encoded
    const decodedUrl = decodeURIComponent(imageUrl);

    // Only allow Supabase storage URLs for security
    if (!decodedUrl.includes("supabase.co/storage/")) {
      return new Response(
        JSON.stringify({
          error: "Invalid URL - only Supabase storage URLs allowed",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Fetch the image from Supabase
    const imageResponse = await fetch(decodedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!imageResponse.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed to fetch image",
          status: imageResponse.status,
        }),
        {
          status: imageResponse.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
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
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};

export const config = {
  path: "/api/image-proxy",
};
