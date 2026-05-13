import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseServerClient } from "../../../../lib/supabase";
const resend = new Resend(process.env.RESEND_API_KEY);

type LeadPayload = {
  email: string;
  companyName?: string;
  role?: string;
  source?: string;
  website?: string;
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
    if (payload.website) {
      return NextResponse.json(
        { error: "Spam detected." },
        { status: 400 }
      );
    }
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
    
    await resend.emails.send({
      from: "BURNRATE AI <onboarding@resend.dev>",
      to: payload.email,
      subject: "Your BURNRATE AI request was received",
      html: `
        <div style="font-family:sans-serif;line-height:1.6">
          <h2>BURNRATE AI</h2>
    
          <p>Thanks for submitting your AI infrastructure audit request.</p>
    
          <p>
            Your optimization report and savings opportunities were generated successfully.
          </p>
    
          <p>
            You can continue reviewing your audit and shareable savings report.
          </p>
    
          <p style="margin-top:24px;color:#666">
            Deterministic AI spend optimization for modern teams.
          </p>
        </div>
      `,
    });
    
    return NextResponse.json({ ok: true });

  
  } catch {
    return NextResponse.json({ error: "Failed to save lead." }, { status: 500 });
  }
}
