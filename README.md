# Asr-ı Saadet Portalı

Islamic history archive (Sahabe biographies, events timeline, genealogy, articles) with a Firebase-backed admin panel.

**Stack:** Astro (static pages) · vanilla JS app (`public/script.js`) · Firebase Auth + Firestore + App Check · Vercel hosting.

---

## 1. URGENT — rotate the leaked credentials

The public GitHub repo contained `şifreler.txt` (reCAPTCHA **secret** key + site key) and `şifre hosting.txt` (a password). They are removed from the code, but **they are still readable in the Git history**, so:

1. **Change the hosting/account password** that was in `şifre hosting.txt`. If it was reused anywhere else (email, Vercel, GitHub, Firebase), change it there too and turn on 2-factor authentication.
2. **Create a new reCAPTCHA Enterprise key** (Google Cloud Console → Security → reCAPTCHA → *Create key*, type *Website*), add all site domains (see §6), then:
   - Firebase Console → App Check → Apps → web app → switch the provider to the **new** site key.
   - Put the new site key into `APPCHECK_SITE_KEY` at the top of `public/script.js`.
   - Delete the old key in Google Cloud.
3. **Make the GitHub repo private** (Settings → General → Danger zone → Change visibility), or rewrite history with `git filter-repo`. Private is the quick fix.

Never commit passwords or keys again. `.gitignore` now blocks `şifre*`, `.env*`, service-account JSON files, etc. Secrets belong in **Vercel → Settings → Environment Variables**.

---

## 2. What was fixed

| Problem | Fix |
|---|---|
| Last commit (“s”) deleted `src/` and `public/` (pages, data, logo, icons) and rolled `script.js`/`style.css`/`build.js` back to an older copy → **build crashed** (`Cannot find module './src/data/articles.json'`). | Restored the full project from the last complete commit (`9692dd1`) and removed the duplicate root copies of every file. |
| **Whole page froze** on every page load: `metin-duzelt.js` re-assigned `document.title` inside its own MutationObserver → endless loop. (Probably why the site was rolled back.) | Only assigns when the text actually changes + drops self-caused mutations. Verified in a headless browser. |
| Admin panel trusted any account whose email was in the list — even an **unverified** email/password sign-up, so if an admin address had no Firebase account yet, anyone could register it with a password and get admin rights. | Admin now requires a **verified** email (client + Firestore rules). Admins who signed up with email/password get a “send verification email” screen; Google sign-in is verified automatically. |
| `firestore.rules` was deleted from the repo. | Restored and tightened (`firestore.rules`, `firebase.json`, `.firebaserc`). |
| Site address hard-coded in ~30 places. | One setting: `site.config.json` (or `SITE_URL` env var in Vercel). Canonicals, sitemap, robots.txt and JSON-LD all follow it. |
| Misc. | Basic security headers in `vercel.json`; home page article links no longer go through a redirect; build output (`public/sahabe/`, `site-data.json`) is git-ignored; duplicate image folders and junk files (`aa`, `download`, …) removed. |

---

## 3. Project structure

```
src/pages/            Astro pages (one per URL) — mostly shells that public/script.js fills in
src/pages/makaleler/  Article pages, generated from src/data/articles.json
src/layouts/          Shared <head>, navigation, footer
src/data/             articles.json, faq.json  (edit these to change articles / FAQ)
public/script.js      The app: archive, timeline, genealogy, search, login, account, ADMIN PANEL
public/*.css          Styles
build.js              Runs before Astro: reads Firestore → writes public/sahabe/*.html,
                      public/site-data.json, sitemap.xml, robots.txt
firestore.rules       Database security rules (must be published to Firebase — see §5)
site.config.json      The public site address
```

---

## 4. Deploy on Vercel

1. Push this project to the GitHub repo (replace the current contents).
2. Vercel → the project → **Settings → General**: Framework *Astro*, Build command `npm run build`, Output `dist`, Node.js **22.x**.
3. **Settings → Environment Variables** (Production + Preview):
   - `FIREBASE_SERVICE_ACCOUNT` — Firebase Console → Project settings → Service accounts → *Generate new private key*; paste the whole JSON on one line. (Optional but recommended; without it `build.js` reads the public collections over REST.)
   - `SITE_URL` — only when the custom domain is live (see §6).
4. Deploy. Check the **Preview** URL first, then promote to Production.

If Firestore cannot be read during the build, the build stops on purpose so a half-empty site is never published — Vercel keeps serving the previous version.

---

## 5. Admin panel & Firebase

**Publish the security rules** (the site's protection depends on them):

- Firebase Console → Firestore Database → **Rules** → paste `firestore.rules` → **Publish**
  (or `npx firebase-tools deploy --only firestore:rules`).

What the rules do: everyone can read `zatlar` (people) and `olaylar` (events); only admins can create/edit/delete them. Each user can only see and edit their own `favoriler` and `notlar`. Everything else is closed.

**Admins** = an email in **both** lists below **with a verified email address**:

- `ADMIN_EMAILS` at the top of `public/script.js` (controls what the UI shows)
- the list inside `isAdmin()` in `firestore.rules` (controls what the database allows)

Alternative without code changes: create a document `admins/<user UID>` with field `active: true` in the Firestore console.

**Firebase Authentication → Settings → Authorized domains** must contain every domain the site runs on (vercel.app + custom domain), otherwise login fails.

**App Check:** if Firestore shows “Missing or insufficient permissions” for everyone, the App Check key/domains are wrong. Check §1 step 2 and §6.

---

## 6. Connect a custom domain

1. Buy the domain (any registrar).
2. Vercel → project → **Settings → Domains** → add `example.com` and `www.example.com`.
3. At the registrar's DNS settings, create **exactly the records Vercel shows** on that page (usually an `A` record for the root domain and a `CNAME` for `www`). Wait until Vercel shows *Valid Configuration*; HTTPS is issued automatically.
4. Set the site address: either change `site.config.json` → `"siteUrl": "https://example.com"` and push, **or** set `SITE_URL=https://example.com` in Vercel env vars. Redeploy.
5. Add the new domain to:
   - Firebase → Authentication → Settings → **Authorized domains**
   - Google Cloud → reCAPTCHA → the site key → **Domains**
6. Google Search Console: add the new domain as a property and submit `https://example.com/sitemap.xml`. Keep the old `vercel.app` address working (Vercel can redirect it to the new domain in Settings → Domains).

---

## 7. Local development

Requires Node.js 22.12+.

```bash
npm install
npm run dev        # http://localhost:4321 — uses live Firestore data from the browser
npm run build      # full production build (needs Firestore access)
npm run preview
```

On `localhost`, App Check uses a debug token; register it in Firebase Console → App Check → *Manage debug tokens* if Firestore refuses requests.
