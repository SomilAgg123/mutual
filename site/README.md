# Mutual walkthrough

Public URL: **https://somilagg123.github.io/mutual/**

The website explains the original app through seven read-only screen previews: profile browsing, recommendations, comparison, icebreakers, introductions, settings, and photo/prompt editing. Tour buttons, keyboard navigation, shareable chapter URLs, and candidate comparisons work in the website. The controls inside the phone are inactive.

The original React Native components are bundled through the same browser adapters as the review screenshots. A fixed-size iframe isolates their original dimensions from the responsive website. The fixtures intercept every API fetch; unknown requests and writes fail. Content Security Policy also blocks service connections. No backend, accounts, notifications, analytics, or data collection is configured.

The score explorer uses fresh JSON output from `examples/match_demo.py` at build time. It does not reimplement the scorer in JavaScript. All profiles are fictional, portraits are generated placeholders, and the original activity and editor screens retain their sample copy. Match explanations in the phone are fixtures. Detailed scoring explanations remain in the repository documentation; the site focuses on screens, titles, navigation, and scores.

## Build and preview

Requires Node.js 20 or newer (CI uses 22), npm, and Python 3.10 or newer:

```sh
npm --prefix scripts/review ci --ignore-scripts --no-audit --no-fund
npm --prefix scripts/review run build:site
python3 -m http.server 4173 --directory .site-build
```

Open `http://localhost:4173`. The build output is ignored by Git; the deployment workflow uploads only `.site-build`, which contains public HTML, CSS, JavaScript, fonts, and images.

## Browser checks

```sh
scripts/review/node_modules/.bin/playwright install chromium
node scripts/review/test-site.mjs
```

Alternatively, set `MUTUAL_BROWSER_CHANNEL=chrome` to use an installed Chrome in an isolated headless session. The test starts and closes its own server under `/mutual/`, matching the GitHub project-site URL. Set `MUTUAL_CAPTURE_DIR` to an output directory to save desktop and mobile screenshots. Set `MUTUAL_SITE_URL` to test the deployed site instead of local output.

The checks exercise all seven screens, next/previous/restart, direct chapter navigation, refresh, browser back, keyboard navigation, three score comparisons, and widths of 320, 390, 768, and 1440 pixels. Unexpected browser errors, failed resources, external service requests, and writes fail the check. These are website checks, not a native app integration test.

## Deploy

The [GitHub Actions workflow](../.github/workflows/pages.yml) builds and tests pull requests. Successful runs on `main` upload the static artifact and deploy it to the `github-pages` environment. The repository's Pages source must be set to GitHub Actions. See [GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

The site preserves contributor attribution and the bundled Lato font license. See [credits](../NOTICE.md) and [publication scope](../docs/publication.md).
