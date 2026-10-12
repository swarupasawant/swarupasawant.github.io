/**
 * GitHub Pages has no rewrite rules, so /shop-demo/men/ is a 404 unless a
 * file exists there. After `vite build` this copies dist/index.html to:
 *
 *   dist/<route>/index.html  a real 200 for every known route, so the banner
 *                            loads on a clean response on each page
 *   dist/404.html            fallback for anything else; keeps the URL and
 *                            the client router renders the not-found page
 *
 * Keep ROUTES in sync with src/data/products.js CATEGORIES.
 */
import { mkdirSync, copyFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROUTES = ['shop', 'men', 'women', 'kids', 'beauty', 'home-living']

// Banner language auto-selection (URL-path detection), used by the privyauto cookie-manager
// tests. The banner reads the FIRST path segment of the URL, so the site must be served at
// the root of its origin (see README) and each accepted spelling needs a real 200 page.
// Copied from the cookie-manager demo's make-language-routes.mjs. `br` and `st` are left out
// ON PURPOSE: ISO assigns them to Breton and Sesotho, so the banner refuses them, and they
// must fall through to the default language via 404.html (TRD-CKM-001 section 3.1).
const LANGUAGE_SEGMENTS = [
  'english', 'en',
  'assamese', 'as',
  'bengali', 'bangla', 'bn',
  'bodo', 'brx',
  'dogri', 'doi',
  'konkani', 'gom',
  'gujarati', 'gu',
  'hindi', 'hi',
  'kannada', 'kn',
  'maithili', 'mai',
  'malayalam', 'ml',
  'manipuri', 'meitei', 'mni-mtei',
  'marathi', 'mr',
  'nepali', 'ne',
  'oriya', 'odia', 'or',
  'punjabi', 'panjabi', 'pa',
  'sanskrit', 'sa',
  'sindhi', 'sd',
  'santhali', 'santali', 'sat',
  'tamil', 'ta',
  'telugu', 'te',
  'urdu', 'ur',
  'kashmiri', 'ks'
]
ROUTES.push(...LANGUAGE_SEGMENTS)

const dist = resolve('dist')
const index = join(dist, 'index.html')
if (!existsSync(index)) {
    console.error('dist/index.html not found. Run vite build first.')
    process.exit(1)
}

for (const route of ROUTES) {
    mkdirSync(join(dist, route), { recursive: true })
    copyFileSync(index, join(dist, route, 'index.html'))
}
copyFileSync(index, join(dist, '404.html'))
console.log(`Created ${ROUTES.length} route pages + 404.html`)
