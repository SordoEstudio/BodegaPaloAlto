import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

/**
 * On-demand revalidation. Llamable desde el CMS al publicar cambios.
 *
 * Auth: header `x-revalidate-secret` o query `?secret=` debe coincidir con
 * `REVALIDATE_SECRET` (env var). En desarrollo se permite sin secret.
 *
 * Body JSON (POST) o query (GET) admite:
 *   - tag: string | string[]   → invalida tag(s)
 *   - path: string | string[]  → invalida path(s)
 *
 * Ejemplos:
 *   POST /api/revalidate
 *     headers: { "x-revalidate-secret": "..." }
 *     body: { "tag": ["cms-components", "products"] }
 *
 *   GET /api/revalidate?secret=...&tag=cms-components
 */

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

function isAuthorized(request: Request, urlSecret: string | null): boolean {
  if (process.env.NODE_ENV !== "production" && !REVALIDATE_SECRET) return true;
  if (!REVALIDATE_SECRET) return false;
  const headerSecret = request.headers.get("x-revalidate-secret");
  return headerSecret === REVALIDATE_SECRET || urlSecret === REVALIDATE_SECRET;
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

async function handle(
  request: Request,
  payload: { tag?: unknown; path?: unknown },
  urlSecret: string | null
) {
  if (!isAuthorized(request, urlSecret)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const tags = toArray(payload.tag);
  const paths = toArray(payload.path);

  if (!tags.length && !paths.length) {
    return NextResponse.json(
      { success: false, message: "Missing tag or path" },
      { status: 400 }
    );
  }

  for (const tag of tags) revalidateTag(tag, "max");
  for (const path of paths) revalidatePath(path);

  return NextResponse.json({ success: true, revalidated: { tags, paths } });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlSecret = searchParams.get("secret");
  let body: { tag?: unknown; path?: unknown } = {};
  try {
    body = (await request.json()) ?? {};
  } catch {
    body = {};
  }
  const payload = {
    tag: body.tag ?? searchParams.getAll("tag"),
    path: body.path ?? searchParams.getAll("path"),
  };
  return handle(request, payload, urlSecret);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlSecret = searchParams.get("secret");
  return handle(
    request,
    { tag: searchParams.getAll("tag"), path: searchParams.getAll("path") },
    urlSecret
  );
}
