# Review screenshots

- [Cards and matching](cards-and-matching.png): preserved Source, Arrange, and Arrange2 components showing a profile card, recommended matches, and a detailed comparison.
- [Profile management](profile-management.png): preserved Profile and Details components showing account settings, photos, and prompt responses. Details retains its original repeated placeholder answer.
- [Component previews](component-previews.png): preserved Welcome, Search, and AnsweredChats components.
- [Matching demo](matching-demo.png): a rendered review page containing actual stdout from `python3 examples/match_demo.py`.

The UI captures use React Native Web with the original layouts and generated placeholder avatars. They are read-only browser previews, not native-device screenshots or evidence of an integrated mobile build. Scrollable views show their initial position; content below the viewport is not captured. The screenshot frame is presentation-only.

Browser adapters disable navigation, authentication, image picking, and animations, and substitute native gradients, icon glyphs, and the search control. Each screen receives a fixed 374 × 844 content viewport. The capture frame disables pointer input. All API fetches are intercepted with offline fixtures; writes and unknown endpoints fail without reaching a server.

Card and account fixtures use the four fictional profiles from `examples/profiles.json`. Recommendation scores come from the maintained Python demo, rounded to integers for the original score circles. Comparison explanations are fixture text. Welcome, search, and introductions retain their original fixed sample data.

Small source fixes allow the preserved components to render: comparison route parameters are initialized before effect dependencies read them, request URLs are scoped locally, and score-circle helpers are declared locally. No screen layout was redesigned. The full mobile app's integration gaps remain.

## Regenerate

Optional prerequisites: Node.js, npm, Python 3.10+, and Chrome or Chromium. These tools are separate from the dependency-free Python quickstart.

From the repository root:

```sh
npm --prefix scripts/review ci --ignore-scripts --no-audit --no-fund
npm --prefix scripts/review run build
python3 scripts/review/capture.py
```

If Chrome is not auto-detected, pass its executable using `--chrome`. Each capture uses a temporary browser profile. The build produces self-contained local HTML in the ignored `.review-build/` directory, embedding fonts, assets, component code, and fresh demo output. No external website is opened during capture.

The capture command reports uncaught JavaScript errors and rejected promises. All four generated images were visually inspected before inclusion. Rendering can vary slightly with platform fonts and browser versions. The original app's feature limitations remain documented in [status](../status.md).
