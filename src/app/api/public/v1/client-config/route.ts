import { NextResponse } from "next/server";
import { getDefaultConfig } from "@/portable-dynamic-cms/config/default-config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const host = searchParams.get("host") ?? request.headers.get("host") ?? "localhost";

  const config = getDefaultConfig();
  return NextResponse.json({
    success: true,
    data: {
      ...config,
      client: { ...config.client, slug: "palo-alto", name: "Bodega Palo Alto" },
    },
  });
}
