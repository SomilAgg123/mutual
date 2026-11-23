#!/usr/bin/env python3
"""Run a fictional Mutual matching scenario without installing packages."""

import argparse
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend.matching import score_profiles


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--json", action="store_true", help="Print the complete score breakdown as JSON")
    args = parser.parse_args()
    profiles = json.loads((ROOT / "examples/profiles.json").read_text())
    subject, *candidates = profiles
    results = [{"name": p["firstName"], **score_profiles(subject, p).as_dict()} for p in candidates]
    results.sort(key=lambda r: (r["ranking_score"] is None, -(r["ranking_score"] or 0), r["name"]))
    if args.json:
        print(json.dumps({"subject": subject["firstName"], "fictional_profiles": True, "matches": results}, indent=2, allow_nan=False))
        return
    print(f"MUTUAL / Matchmaking for {subject['firstName']}")
    print("Fictional profiles. Weighted rules, not predictions of relationship success.\n")
    print(f"{'Candidate':<12} {'Similarity':>12} {'Complementarity':>17} {'Ranking':>10}")
    for result in results:
        print(f"{result['name']:<12} {result['similarity']['value']:>11.1f}% {result['complementarity']['value']:>16.1f}% {result['ranking_score']:>9.1f}%")
    best = results[0]
    print(f"\nWhy {best['name']} ranks first in this example:")
    for category in ("similarity", "complementarity"):
        for reason in best[category]["reasons"][:2]:
            print(f"  - {reason}")
    print("\nAll fixture profiles have complete scoring data. See docs/matching.md for limits.")


if __name__ == "__main__":
    main()
