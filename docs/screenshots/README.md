# Review screenshots

- [Component previews](component-previews.png): screenshots of preserved Welcome, Search, and AnsweredChats components rendered through React Native Web. These are read-only browser previews, not native-device screenshots or evidence of an integrated mobile build.
- [Matching demo](matching-demo.png): a rendered review page containing actual stdout from `python3 examples/match_demo.py`.

The component preview uses the original layout, copy, fixed sample data, and current placeholder avatars. Browser adapters disable navigation/authentication and substitute the native gradient, icon glyphs, and search control. The preview does not connect to the historical API. The screenshot frame is presentation-only.

## Regenerate

Optional prerequisites: Node.js, npm, Python 3.10+, and Chrome or Chromium. These tools are separate from the dependency-free Python quickstart.

From the repository root:

```sh
npm --prefix scripts/review ci --ignore-scripts --no-audit --no-fund
npm --prefix scripts/review run build
python3 scripts/review/capture.py
```

If Chrome is not auto-detected, pass its executable using `--chrome`. Each capture uses a temporary browser profile. The build produces self-contained local HTML in the ignored `.review-build/` directory, embedding fonts, assets, component code, and fresh demo output. No external website is opened during capture.

The generated images were visually inspected before inclusion. Rendering can vary slightly with platform fonts and browser versions. The original app's feature limitations remain documented in [status](../status.md).
