import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  // Verify the requester is an admin using the session-bound client
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Parse body
  const body = await request.json();
  const { userId, role } = body as { userId?: string; role?: string };

  if (!userId || !role) {
    return NextResponse.json(
      { error: "userId and role are required" },
      { status: 400 }
    );
  }

  const allowedRoles = ["customer", "admin", "wholesale"];
  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Prevent an admin from changing their own role
  if (userId === user.id) {
    return NextResponse.json(
      { error: "You cannot change your own role" },
      { status: 400 }
    );
  }

  // Use service client to bypass RLS for the actual update
  const serviceClient = createServiceClient();
  const { error: updateError } = await serviceClient
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (updateError) {
    console.error("Role update error:", updateError);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, userId, role });
}
