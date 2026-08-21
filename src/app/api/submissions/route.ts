import { NextResponse, type NextRequest } from "next/server";
import { submissionSchema } from "@/lib/validation";
import { rateLimit, clientIpFrom } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { isHoneypotTriggered } from "./spam-guard";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

// Called by the public /submit page's community submission form. A
// submission is never auto-published as a verified benefit; it only ever
// creates a PENDING row that an admin reviews at /admin/submissions.
export async function POST(request: NextRequest) {
  const ip = clientIpFrom(request.headers);
  const { allowed } = rateLimit(`submissions:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions from this address. Try again in an hour." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Honeypot: real users never see or fill this field. A bot that does gets
  // a fake success so it wastes time instead of learning it was caught.
  const rawWebsite =
    typeof body === "object" && body !== null ? (body as Record<string, unknown>).website : undefined;
  if (isHoneypotTriggered(rawWebsite)) {
    return NextResponse.json({ id: "ok", status: "PENDING" });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const submission = await prisma.submission.create({
    data: {
      benefitName: parsed.data.benefitName,
      provider: parsed.data.provider,
      url: parsed.data.url,
      description: parsed.data.description,
      category: parsed.data.category,
      studentRequirements: parsed.data.studentRequirements,
      country: parsed.data.country,
      notes: parsed.data.notes,
      submitterEmail: parsed.data.submitterEmail,
      status: "PENDING",
    },
  });

  return NextResponse.json({ id: submission.id, status: submission.status }, { status: 201 });
}
