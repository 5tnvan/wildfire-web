import { NextResponse, type NextRequest } from "next/server";

import { type EmailOtpType } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  console.log(redirectTo);

  if (token_hash && type) {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // Successful email verification, construct absolute URL for /signup/success
      const successUrl = `${request.nextUrl.origin}/signup/success`;
      return NextResponse.redirect(successUrl);
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = "/error";
  console.log(redirectTo);
  return NextResponse.redirect(redirectTo);
}
