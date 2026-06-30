import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_PASSWORD = process.env.ADMIN_POPULATE_PASSWORD ?? "Playadmin";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  // Delete all venues — neq on id (matches every row)
  const { data, error } = await supabase
    .from("venues")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000")
    .select("id");

  if (error) {
    return NextResponse.json({ error: `Supabase delete error: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ deleted: data?.length ?? 0 });
}
