"""Check publication hygiene, source syntax, asset references, and doc links.

This targeted check is not a full secret scanner or a runtime security audit.
It reports filenames and line numbers, never matched values.
"""

import ast
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
SKIP = {".git", "node_modules", ".venv", "venv", "__pycache__", ".pytest_cache", ".review-build"}
PATTERNS = {
    "cloud access key": re.compile(r"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b"),
    "private key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "GitHub token": re.compile(r"\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b"),
    "credentialed database URL": re.compile(r"postgres(?:ql)?://[^\s:'\"]+:[^\s@'\"]+@"),
    "literal cloud secret": re.compile(r"aws_secret_access_key\s*=\s*['\"][^'\"]+['\"]"),
    "historical deployment host": re.compile(r"https?://mutual-dev\.com|[a-z0-9.-]+\.rds\.amazonaws\.com"),
    "developer home path": re.compile(r"/(?:Users|home)/[A-Za-z0-9_.-]+/"),
}


def check() -> list[str]:
    errors = []
    files = [p for p in ROOT.rglob("*") if p.is_file() and not SKIP.intersection(p.relative_to(ROOT).parts)]
    for path in files:
        relative = path.relative_to(ROOT)
        if path.name.startswith(".env") and path.name != ".env.example":
            errors.append(f"{relative}: environment file must not be published")
        if path.suffix in {".keystore", ".p12", ".mobileprovision", ".log", ".pkg"}:
            errors.append(f"{relative}: private/generated artifact")
        try:
            source = path.read_text()
        except UnicodeDecodeError:
            continue
        for name, pattern in PATTERNS.items():
            for match in pattern.finditer(source):
                line = source.count("\n", 0, match.start()) + 1
                errors.append(f"{relative}:{line}: {name}")
        if path.suffix == ".py":
            try:
                ast.parse(source)
            except SyntaxError as exc:
                errors.append(f"{relative}:{exc.lineno}: invalid Python syntax")
        if path.suffix == ".json":
            try:
                json.loads(source)
            except json.JSONDecodeError as exc:
                errors.append(f"{relative}:{exc.lineno}: invalid JSON")
        if path.suffix == ".js":
            for match in re.finditer(r"(?:from\s+|require\()['\"](\.[^'\"]+)['\"]", source):
                dest = path.parent / match.group(1)
                if not any(p.exists() for p in [dest, Path(str(dest) + ".js"), Path(str(dest) + ".json"), dest / "index.js"]):
                    errors.append(f"{relative}: missing local import {match.group(1)}")
        if path.suffix == ".md":
            for target in re.findall(r"!?\[[^\]]*\]\(([^)]+)\)", source):
                target = target.split("#", 1)[0]
                if not target or re.match(r"[a-z]+:", target):
                    continue
                if not (path.parent / unquote(target)).exists():
                    errors.append(f"{relative}: missing local link {target}")
    return errors


if __name__ == "__main__":
    failures = check()
    for failure in failures:
        print(failure)
    print(f"Repository checks: {'FAILED' if failures else 'passed'}")
    sys.exit(bool(failures))
