import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../../lib/supabase";

type LeadPayload = {
  email: string;
  companyName?: string;
  role?: string;
  source?: string;
};

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

const normalizeOptional = (value: string | undefined) => {
  if (!value) return null;
  const normalized = value.trim();
  return normalized.length ? normalized : null;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LeadPayload;
    if (!payload?.email || !isValidEmail(payload.email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("leads").insert([
      {
        email: payload.email.trim().toLowerCase(),
        company_name: normalizeOptional(payload.companyName),
        role: normalizeOptional(payload.role),
        source: normalizeOptional(payload.source),
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save lead." }, { status: 500 });
  }
}
