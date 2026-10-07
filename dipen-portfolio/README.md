# Dipen Kumar Nayak — Portfolio

Static, dependency-free portfolio. Plain HTML, CSS and JavaScript, self-hosted fonts, and
a strict Content-Security-Policy. No frameworks, no trackers, no cookies, no build step.

## Run locally
Open the folder in VS Code and start **Live Server** (or run `python -m http.server 5500`),
then open http://127.0.0.1:5500.

> Live Server does not send the security headers in `_headers`. They only apply once deployed.

## Deploy (recommended: Cloudflare Pages)
GitHub Pages cannot send custom security headers, so use Cloudflare Pages or Netlify.
Both are free and read the `_headers` file automatically.

**Cloudflare Pages**
1. Push this folder to a GitHub repository.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Pick the repo. Framework preset: *None*. Build command: *(empty)*. Output directory: `/`.
4. Deploy, then add your custom domain under **Custom domains**.

**Netlify**: New site from Git → same repo → leave build command empty → publish directory `/`.

## After deploying
1. Replace `YOUR-DOMAIN` in `.well-known/security.txt` with your domain.
2. Turn on **Always Use HTTPS**, **HSTS** and **DNSSEC** in your DNS/hosting settings.
3. Test:
   - https://securityheaders.com (target: A+)
   - https://developer.mozilla.org/en-US/observatory (target: A+)
   - Chrome DevTools → Lighthouse (target: 95+ in every category)
4. Renew the `Expires` date in `security.txt` before it lapses (currently October 2027).

## Security measures included
| Area | What's done |
|---|---|
| CSP | `default-src 'none'`; scripts, styles and fonts only from this site; no inline code anywhere |
| Transport | HSTS with preload, `upgrade-insecure-requests` |
| Framing | `frame-ancestors 'none'` and `X-Frame-Options: DENY` (clickjacking) |
| Browser features | Camera, mic, location, payment etc. disabled via `Permissions-Policy` |
| Isolation | `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy` set to same-origin |
| Third parties | None. Fonts are self-hosted (`assets/fonts`, SIL Open Font License) |
| DOM safety | No `innerHTML`/`eval`; DOM built with `textContent` |
| Privacy | Email assembled on click (anti-scraping), no phone number, CV metadata stripped, CV excluded from search indexing |
| External links | `rel="noopener noreferrer"` |
| Disclosure | `/.well-known/security.txt` (RFC 9116) |

## Editing content
All content is in `index.html`. If you add anything from another domain (an image, a script,
a form service such as Formspree), you must add that domain to the matching directive in
`_headers` or the browser will block it.

## Structure
```text
├── index.html
├── 404.html
├── _headers               security headers (Cloudflare Pages / Netlify)
├── robots.txt
├── .well-known/security.txt
├── css/styles.css
├── js/theme.js            sets saved theme before paint
├── js/main.js             menu, stack & security tabs, command palette, email reveal
└── assets/
    ├── favicon.svg
    ├── Dipen_Kumar_Nayak_CV.pdf
    └── fonts/             self-hosted woff2 + licences
```

## Before publishing (v5 checklist)
1. Contact links (LinkedIn, GitHub, email, résumé) are icon buttons in the hero and contact section; edit them there.
2. Optional photo: save a square photo as `assets/profile.jpg` and uncomment the `<img>` line in the hero card.
3. Replace `assets/Dipen_Kumar_Nayak_CV.pdf` with an updated CV that says 5 years and matches the site.
4. Replace `YOUR-DOMAIN` in `.well-known/security.txt` once you have a domain.

## ATS and search friendliness
- Standard section names: Professional Summary (hero), Selected Projects, Technical Skills, Experience, Education, Contact.
- Skills are plain text, not images or icons, so parsers and search engines can read them.
- Dates use `<time datetime>` tags; job titles and employer names are written in full.
- `schema.org/Person` structured data in `<head>` describes your role, employer, education and skills.
- Printing the page (Ctrl+P) produces a clean one-column résumé layout.
- Most applicant tracking systems parse your uploaded PDF/DOCX résumé, not your website, so keep the CV itself text-based and consistent with this page.
