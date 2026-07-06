# CMS Webhook → Next.js On-Demand Revalidation

## Overview

When CMS saves content, it hits a Next.js endpoint that calls `revalidateTag("cms-components")`.
Next.js regenerates affected pages in the background. No full deploy needed. Update visible in <5s.

---

## 1. Next.js endpoint (already planned)

**URL:** `POST https://bodegapaloalto.com/api/revalidate`

**Request the CMS must send:**

```http
POST /api/revalidate
Content-Type: application/json

{
  "secret": "<CMS_REVALIDATE_SECRET value>",
  "page": "all"
}
```

Optional `page` values (CMS can send specific page to revalidate only that):

| `page` value | What gets revalidated |
|---|---|
| `"all"` | All CMS pages (es + en) |
| `"Inicio"` | Home page only |
| `"bodega"` | Bodega page only |
| `"destileria"` | Destilería page only |
| `"contacto"` | Contacto page only |
| `"bienvenida"` | Bienvenida page only |

**Success response:**
```json
{ "revalidated": true, "tags": ["cms-components"], "timestamp": "2026-07-06T..." }
```

**Error response (wrong secret):**
```json
{ "error": "Unauthorized" }  →  HTTP 401
```

---

## 2. Environment variable needed

Add to Vercel project (Settings → Environment Variables):

| Variable | Value | Environments |
|---|---|---|
| `CMS_REVALIDATE_SECRET` | any strong random string (min 32 chars) | Production, Preview |

Generate a secret:
```bash
openssl rand -hex 32
```

The same value must be configured in the CMS webhook settings as the secret to send in the JSON body.

---

## 3. What the CMS admin needs to configure

### Webhook settings in micms.website dashboard:

| Field | Value |
|---|---|
| **URL** | `https://bodegapaloalto.com/api/revalidate` |
| **Method** | `POST` |
| **Content-Type** | `application/json` |
| **Body** | `{ "secret": "THE_SECRET_VALUE", "page": "all" }` |
| **Trigger** | On component save / publish |

### When to trigger:
- On **publish** of any component (not on draft save)
- On **delete** of any component
- On **reorder** of components

---

## 4. Fallback behavior (if webhook fails)

`cms-fetch.ts` has `next: { revalidate: 3600 }` — pages auto-refresh every 60 minutes as fallback.

To reduce fallback window, change in `src/lib/cms-fetch.ts`:
```ts
// current
next: { revalidate: 3600, tags: ["cms-components", `cms-components-${locale}`] }

// after webhook is live, reduce fallback to 5 min
next: { revalidate: 300, tags: ["cms-components", `cms-components-${locale}`] }
```

---

## 5. Test the webhook manually

Once endpoint is deployed to staging:

```bash
curl -X POST https://bodega-palo-alto-git-staging-harvi-d1d4a883.vercel.app/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"THE_SECRET_VALUE","page":"all"}'
```

Expected: `{"revalidated":true,...}`

Then: change any text in CMS, publish, wait 3-5s, hard reload page → should show updated content.

---

## 6. Implementation order

1. **CMS team:** configure webhook URL + secret in dashboard (can point to staging first)
2. **Dev:** implement `/api/revalidate` endpoint + add `CMS_REVALIDATE_SECRET` to Vercel env vars
3. **Test:** trigger webhook manually, verify revalidation works
4. **Dev:** lower `revalidate: 3600 → 300` once webhook confirmed working
5. **CMS team:** update webhook URL to production domain

---

## Notes

- Staging preview URL: `https://bodega-palo-alto-git-staging-harvi-d1d4a883.vercel.app`
- Production domain: `https://bodegapaloalto.com`
- CMS API: `micms.website`
- This does NOT require a new Vercel deploy — `revalidateTag` works on already-deployed instances
