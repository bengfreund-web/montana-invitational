# Montana Invitational

Static site for the **Montana Invitational High School Rugby Tournament** — Saturday 24 and
Sunday 25 April 2027, Bozeman Sports Park, Bozeman, Montana. An event of the Montana Institute of
Sport.

Built by reusing the **National 10s** (`n10s-site`) codebase verbatim — the same static
HTML/CSS/JS pattern, no build step, deployed from the repo root via GitHub Pages. Only the brand
color tokens and the content changed; the loading screen, pinned video hero, scroll reveals, form
styling and FAQ accordion are the N10s components unchanged.

```
index.html            the long single page
referee.html          referee info + embedded Google Form
merch.html            merch placeholder
css/styles.css        brand tokens + all styles (MI additions at the bottom)
js/main.js            nav, scroll progress, reveal-on-scroll, TEAMS wall, interest form
js/hero-sequence.js   pinned video hero: stages, loader
scripts/              Apps Script form endpoint; asset cache-buster
img/                  logo, icons, OG image, team crests, partner tiles, photos
assets/               hero footage, poster stills, encodes
```

## Page order (index.html)

`Hero → The Basics → Format → Divisions → venue photo → Entry → Confirmed Teams → Expression of
Interest → Plan Your Trip → FAQ → action photos → Partners → Footer`

Nav: About · Format · Divisions · Teams · Plan Your Trip · Register Interest. The two subpages
(Referee, Merch) are linked from the footer only, not the top nav.

## Brand tokens

Defined at the top of `css/styles.css`:

| Token | Value | Use |
|---|---|---|
| `--primary` | `#241A0C` | deep leather brown: headings, primary button fill, footer, grounds |
| `--primary-dark` | `#17100A` | hero/scrim end, footer, loader |
| `--accent` | `#C9A227` | gold: rules, icons, active states, large display accents, on-dark text |
| `--accent-text` | `#7A5F1F` | darkened bronze for small text/links on white (passes AA; `#C9A227` does not) |
| `--bronze` | `#8C6E2A` | brand mid: secondary fills, borders, team-crest disc |
| `--gray` | `#60655F` | body copy (neutral, unchanged from N10s) |

Same discipline as N10s: the dark brown carries the large blocks and the footer; gold is reserved
for buttons, hovers, thin rules and active states — never a large background fill. `#C9A227` on
white is only 2.4:1, so `--accent-text` exists for small text/links.

Type: Oswald (condensed) for display/headings/eyebrows, Poppins for body. Loaded from Google Fonts.

## Confirmed Teams wall

Rendered from the `TEAMS` array in `js/main.js`, so adding a side is one line, and the counts
(teams, states) derive from the array and cannot go stale.

**The 24 teams currently listed are who PLAYED in April 2026, not confirmed 2027 entries.** The
section is therefore framed as *"Who Played in 2026"* (Option A) — a credibility wall that needs no
new data. To switch to the 2027 *"Confirmed"* framing once entries arrive:

1. Set `TEAMS_MODE = "confirmed"` in `js/main.js`.
2. Empty (or replace) the `TEAMS` array with the confirmed 2027 sides.

Both framings' copy lives in `TEAMS_COPY` at the top of `js/main.js`.

Each crest is a neutral placeholder (`img/teams/{slug}.png`) — a bronze disc with the club's
initials. The logo sits in a fixed-height (140px) flex box with `object-fit: contain`, so captions
align across every row regardless of a real logo's aspect ratio. Drop real logos in at the same
paths.

## Wiring up the interest form

The inline form is in the markup but **not connected**. `js/main.js` has two switches at the top:

- `INTEREST_FORM_URL` — paste a Google Form `/viewform` URL here and the "here" link and the
  Expression-of-Interest button both point at it (this is the intended route for MI).
- `FORM_ENDPOINT` — alternatively, paste an Apps Script `/exec` URL (see `scripts/form-endpoint.gs`)
  to POST the inline form to a Google Sheet.

While both are empty the inline form is hidden and an **email fallback button** (mailto to
`jd@sportmontana.org`) is shown, so the section never collects submissions that go nowhere. A
hidden honeypot field (`website`) drops bots.

## Cache busting

CSS/JS are linked with a `?v=` query. Bump it (or run `python3 scripts/bump-assets.py`) before
pushing changes to `css/` or `js/` — GitHub Pages caches those files beyond a push.

## Assets

All brand assets in `img/` are **neutral placeholders** generated in the MI palette (star-emblem
lockup, favicons, OG card, team crests, partner tiles). Swap them for real art at the same paths.
The hero footage, venue still and match photos are reused from N10s (Bozeman Sports Park drone
flyover and youth match action — no green branding). If a real MI drone reel exists, encode it to
match the N10s ladder (`hero.av1.webm` / `hero.h264.mp4` full-res, `hero-1280.*` for smaller
screens) and drop it into `assets/`.

## Open items (built against placeholders — confirm before launch)

1. **Registration payment link** — not provided; the Entry CTA renders as a disabled "coming soon".
2. **HBC hotel booking URL** ("Find your hotel") — not provided; renders as "coming soon".
3. **Expression-of-interest Google Form URL** — set `INTEREST_FORM_URL` when available.
4. **Contact email** — using `jd@sportmontana.org` per N10s; confirm for MI.
5. **Referee Google Form** — `referee.html` embeds the **2026** form as a placeholder; its internal
   copy still reads "2026" and lists the old divisions (incl. a "U19 Boys Open Division"). Replace
   the `iframe src` (and fallback link) with the 2027 form.
6. **Merch content** — `merch.html` is a placeholder; product content goes in the marked block.
7. **Edition number** — the source site said "2nd Annual" against 2026 dates. If the April 2026
   edition was played, 2027 is the 3rd Annual. No ordinal is printed until confirmed.
8. **Entry fee ($995) and the five divisions** — 2026 figures; confirm they carry to 2027.
9. **States count** — derived from the data as **8** (MT, HI, UT, TX, WA, ID, CA, OR); the build
   spec's "9 states" was superseded by the data and the FAQ's own 8-state list.
10. **Custom domain** — canonical/OG/sitemap/robots point at the GitHub Pages URL. If
    `montanainvitational.com` is pointed here, update those and add a `CNAME` file with the bare
    domain, or search engines index both.

## Deploy

GitHub Pages from the repo root on `main`, same pattern as `n10s-site`. Canonical, `og:url`,
`og:image`, `twitter:image`, `sitemap.xml` and `robots.txt` all point at the Pages URL.

## Local preview

```bash
cd ~/montana-invitational && python3 -m http.server 8765
```

Then open http://localhost:8765.
