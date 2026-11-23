"""Capture the generated review pages using a temporary headless Chrome profile."""

import argparse
from pathlib import Path
import shutil
import re
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[2]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--chrome", help="Chrome or Chromium executable path")
    args = parser.parse_args()
    chrome = args.chrome or shutil.which("google-chrome") or shutil.which("chromium")
    if not chrome:
        mac_chrome = Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        chrome = str(mac_chrome) if mac_chrome.exists() else None
    if not chrome:
        parser.error("Provide a Chrome/Chromium executable with --chrome")
    output = ROOT / "docs/screenshots"
    output.mkdir(parents=True, exist_ok=True)
    for html, name, height in [("screens.html", "component-previews.png", 1360), ("cards.html", "cards-and-matching.png", 1360), ("profiles.html", "profile-management.png", 1360), ("matching-demo.html", "matching-demo.png", 1050)]:
        source = ROOT / ".review-build" / html
        if not source.is_file():
            parser.error("Build the review pages first: npm --prefix scripts/review run build")
        with tempfile.TemporaryDirectory(prefix="mutual-capture-", ignore_cleanup_errors=True) as profile:
            command = [chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--disable-background-networking", "--disable-component-update", "--disable-sync", "--no-first-run", "--no-default-browser-check", "--user-data-dir=" + profile, f"--window-size=1440,{height}", "--virtual-time-budget=2500", "--dump-dom", "--screenshot=" + str(output / name), source.as_uri()]
            result = subprocess.run(command, capture_output=True, text=True, timeout=45)
            if result.returncode:
                raise RuntimeError(result.stderr[-1500:])
            failure = re.search(r'data-review-failed="([^"]+)"', result.stdout)
            if failure:
                raise RuntimeError(f"{html}: {failure.group(1)}")
            print(f"{name}: {(output / name).stat().st_size} bytes")


if __name__ == "__main__":
    main()
