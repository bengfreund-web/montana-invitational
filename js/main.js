/* ------------------------------------------------------------------
   Expression of interest endpoint.

   Paste the /exec URL of the Google Apps Script web app here
   (see scripts/form-endpoint.gs and README.md for the two-minute setup).
   While this is empty the form is hidden and an email fallback is shown
   instead, so the page never collects submissions that go nowhere.
   ------------------------------------------------------------------ */
var FORM_ENDPOINT = "";

/* ------------------------------------------------------------------
   Google Form for expressions of interest.

   Paste the form's /viewform URL here. Both the "here" link under the
   heading and the button beneath it will point at it, and the button
   relabels itself. While this is empty they both fall back to email,
   so neither is ever a dead control.
   ------------------------------------------------------------------ */
var INTEREST_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfcyxtvMmibKBIx5zs8umNMJHdaSRjgLyagau2Ux55LMOSFIw/viewform";

/* ------------------------------------------------------------------
   Confirmed / Who's Coming — the team wall.

   The 24 sides below are who PLAYED in April 2026, not confirmed 2027
   entries. Until 2027 confirmations arrive the section is framed as
   "Who Played in 2026" (Option A). To switch to the 2027 "Confirmed"
   framing: set TEAMS_MODE = "confirmed" and empty the TEAMS array.
   Counts (teams, states) derive from the array so they cannot go stale.
   ------------------------------------------------------------------ */
var TEAMS_MODE = "lastYear"; // "lastYear" (Option A) | "confirmed" (Option B)

var TEAMS_COPY = {
  lastYear: {
    eyebrow: "Last Year",
    title: "Who Played in 2026",
    sub: function (teams, states) {
      return teams + " teams from " + states + " states came to Bozeman in 2026.";
    }
  },
  confirmed: {
    eyebrow: "Confirmed",
    title: "Who's Coming",
    sub: function (teams) { return teams + " teams confirmed so far."; }
  }
};

/* Each side that committed, with its real crest in img/teams/{slug}.png.
   dark:true tiles get a dark logo chip — for light/knockout logos (white or
   pale line-art) that would otherwise vanish on the white card. */
var TEAMS = [
  { name: "Gallatin",             state: "MT", slug: "gallatin" },
  { name: "Kahuku",               state: "HI", slug: "kahuku" },
  { name: "Cascade",              state: "MT", slug: "cascade" },
  { name: "Yellowstone",          state: "MT", slug: "yellowstone" },
  { name: "Highland",             state: "UT", slug: "highland" },
  { name: "Herriman",             state: "UT", slug: "herriman" },
  { name: "Flathead Valley",      state: "MT", slug: "flathead-valley" },
  { name: "Helena",               state: "MT", slug: "helena" },
  { name: "Allen Eagle",          state: "TX", slug: "allen-eagle" },
  { name: "Missoula",             state: "MT", slug: "missoula" },
  { name: "School House",         state: "WA", slug: "school-house" },
  { name: "Liberty",              state: "WA", slug: "liberty" },
  { name: "Silverbacks",          state: "ID", slug: "silverbacks" },
  { name: "Sacramento Jesuit",    state: "CA", slug: "sacramento-jesuit" },
  { name: "Mountain View",        state: "UT", slug: "mountain-view" },
  { name: "Majestics",            state: "UT", slug: "majestics" },
  { name: "Emmett Rugby Club",    state: "ID", slug: "emmett" },
  { name: "Cen Cal",              state: "CA", slug: "cen-cal" },
  { name: "Provo Steelers",       state: "UT", slug: "provo-steelers" },
  { name: "Santa Monica",         state: "CA", slug: "santa-monica" },
  { name: "Beaverton Barbarians", state: "OR", slug: "beaverton-barbarians" },
  { name: "Eastside Lions",       state: "WA", slug: "eastside-lions" },
  { name: "Wasatch Rugby",        state: "UT", slug: "wasatch" },
  { name: "Rampage Rugby",        state: "ID", slug: "rampage" },
  { name: "Bitterroot Warriors",  state: "MT", slug: "bitterroot-warriors" },
  { name: "Summit Storm",         state: "OR", slug: "summit-storm" },
  { name: "Rigby Royals",         state: "ID", slug: "rigby-royals", dark: true }
];

function renderTeams() {
  var grid = document.getElementById("teamGrid");
  if (!grid) return;

  var copy = TEAMS_COPY[TEAMS_MODE] || TEAMS_COPY.lastYear;
  var states = {};
  TEAMS.forEach(function (t) { states[t.state] = 1; });
  var stateCount = Object.keys(states).length;

  var eyebrow = document.getElementById("teamsEyebrow");
  var title = document.getElementById("teamsTitle");
  var sub = document.getElementById("teamsSub");
  if (eyebrow) eyebrow.textContent = copy.eyebrow;
  if (title) title.textContent = copy.title;
  if (sub) sub.textContent = copy.sub(TEAMS.length, stateCount);

  grid.innerHTML = "";
  TEAMS.forEach(function (t) {
    var tile = document.createElement("div");
    tile.className = "team-tile reveal";

    var box = document.createElement("div");
    box.className = t.dark ? "team-logo is-dark" : "team-logo";
    var img = document.createElement("img");
    img.src = "img/teams/" + t.slug + ".png";
    img.alt = t.name + " rugby club logo";
    img.loading = "lazy";
    box.appendChild(img);

    var name = document.createElement("div");
    name.className = "team-name";
    name.textContent = t.name.toUpperCase() + " (" + t.state + ")";

    tile.appendChild(box);
    tile.appendChild(name);
    grid.appendChild(tile);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  var progress = document.getElementById("scrollProgress");
  function updateProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* Build the team wall before the reveal observer runs, so the tiles it
     creates are picked up and animate in with everything else. */
  renderTeams();

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Expression of interest form ---------- */

  var form = document.getElementById("eoiForm");
  var fallback = document.getElementById("formFallback");
  var status = document.getElementById("formStatus");
  var submit = document.getElementById("eoiSubmit");
  if (!form) return;

  /* Point the inline link and the button at the Google Form when there is one. */
  var formLink = document.getElementById("interestFormLink");
  if (INTEREST_FORM_URL) {
    var cta = fallback.querySelector("a");
    [formLink, cta].forEach(function (el) {
      if (!el) return;
      el.href = INTEREST_FORM_URL;
      el.target = "_blank";
      el.rel = "noopener";
    });
    if (cta) cta.textContent = "Open the form";
  }

  if (!FORM_ENDPOINT) {
    form.hidden = true;
    fallback.hidden = false;
    return;
  }

  function setStatus(message, kind) {
    status.textContent = message;
    status.className = "form-status is-visible is-" + kind;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (form.website.value) return; // honeypot: silently drop bots

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var data = new URLSearchParams();
    new FormData(form).forEach(function (value, key) {
      if (key !== "website") data.append(key, value);
    });
    data.append("submittedAt", new Date().toISOString());

    submit.disabled = true;
    submit.textContent = "Submitting…";

    /* Apps Script web apps do not send CORS headers, so this is a no-cors
       write: the POST lands, but the response cannot be read. Check the
       destination sheet if you need to confirm a submission arrived. */
    fetch(FORM_ENDPOINT, { method: "POST", mode: "no-cors", body: data })
      .then(function () {
        form.reset();
        setStatus(
          "Thanks. You are on the list. We will be in touch with registration details as they are confirmed.",
          "success"
        );
        submit.textContent = "Submitted";
      })
      .catch(function () {
        setStatus(
          "Something went wrong sending that. Please email avery@sportmontana.org and we will add you to the list.",
          "error"
        );
        submit.disabled = false;
        submit.textContent = "Submit expression of interest";
      });
  });
});
