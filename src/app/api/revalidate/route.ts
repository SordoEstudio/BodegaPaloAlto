import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

const SECRET = process.env.CMS_REVALIDATE_SECRET ?? process.env.REVALIDATE_SECRET;

const PAGE_TO_PATHS: Record<string, string[]> = {
  Inicio:       ["/es", "/en"],
  bodega:       ["/es/bodega", "/en/bodega"],
  destileria:   ["/es/destileria", "/en/destileria"],
  contacto:     ["/es/contacto", "/en/contacto"],
  bienvenida:   ["/es/bienvenida", "/en/bienvenida"],
};

function isAuthorized(req: Request, bodySecret?: string): boolean {
  if (process.env.NODE_ENV !== "production" && !SECRET) return true;
  if (!SECRET) return false;
  const url = new URL(req.url);
  return (
    req.headers.get("x-revalidate-secret") === SECRET ||
    url.searchParams.get("secret") === SECRET ||
    bodySecret === SECRET
  );
}

function toArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  if (typeof v === "string" && v.trim()) return [v];
  return [];
}

async function handle(req: Request) {
  let body: Record<string, unknown> = {};
  try { body = (await req.clone().json()) ?? {}; } catch { /* GET or empty body */ }

  const url = new URL(req.url);
  if (!isAuthorized(req, typeof body.secret === "string" ? body.secret : undefined)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const revalidated: { tags: string[]; paths: string[] } = { tags: [], paths: [] };

  // CMS format: { secret, page }
  const page = typeof body.page === "string" ? body.page : url.searchParams.get("page") ?? "";
  if (page === "all" || page === "") {
    revalidateTag("cms-components", "default");
    revalidated.tags.push("cms-components");
  } else {
    const pagePaths = PAGE_TO_PATHS[page];
    if (pagePaths) {
      for (const p of pagePaths) revalidatePath(p);
      revalidated.paths.push(...pagePaths);
    }
    revalidateTag("cms-components-es", "default");
    revalidateTag("cms-components-en", "default");
    revalidated.tags.push("cms-components-es", "cms-components-en");
  }

  // Generic format: { tag, path } (for manual use / other callers)
  for (const tag of toArray(body.tag ?? url.searchParams.getAll("tag"))) {
    revalidateTag(tag, "default");
    revalidated.tags.push(tag);
  }
  for (const path of toArray(body.path ?? url.searchParams.getAll("path"))) {
    revalidatePath(path);
    revalidated.paths.push(path);
  }

  if (!revalidated.tags.length && !revalidated.paths.length) {
    return NextResponse.json({ error: "Nothing to revalidate. Send page, tag, or path." }, { status: 400 });
  }

  return NextResponse.json({ revalidated: true, ...revalidated, timestamp: new Date().toISOString() });
}

export async function POST(request: Request) { return handle(request); }
export async function GET(request: Request)  { return handle(request); }
