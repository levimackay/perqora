import { NextResponse, type NextRequest } from "next/server";
import { findSchoolByEmail } from "@/lib/eligibility";

// Called by the discovery flow's email input to detect a school as the
// visitor types, before they've picked one from a list.
export async function GET(request: NextRequest) {
  const email = new URL(request.url).searchParams.get("email");

  if (!email || !email.trim()) {
    return NextResponse.json({ error: "An email is required" }, { status: 400 });
  }

  const school = await findSchoolByEmail(email);
  return NextResponse.json({ school });
}
