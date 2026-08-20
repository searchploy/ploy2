"use server";

import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

/**
 * DEBUG ENDPOINT - Check your subscription status in the database
 * This helps verify if your subscription was properly saved after purchase
 * Remove this after testing
 */
export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supabase = await createClient();

    // Get user's subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("profile_id", user.id);

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("subscription_type, subscription_plan")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      profile: profile || profileError,
      subscriptions: subscriptions || [],
      subscriptionsError: subError,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
