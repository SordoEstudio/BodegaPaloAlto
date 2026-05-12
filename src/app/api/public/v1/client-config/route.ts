import { NextResponse } from "next/server";
import { getDefaultConfig } from "@/portable-dynamic-cms/config/default-config";

export const dynamic = "force-static";

export async function GET() {
  const config = getDefaultConfig();
  return NextResponse.json({
    success: true,
    data: {
      ...config,
      client: { ...config.client, slug: "palo-alto", name: "Bodega Palo Alto" },
    },
  });
}
