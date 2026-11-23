"""A maintained version of Mutual's original weighted matching idea.

Scores describe these rules, not the probability of a successful relationship.
See docs/matching.md for the formula, input schema, and changes from 2023.
"""

from collections.abc import Mapping
from dataclasses import asdict, dataclass
import json
import math
from pathlib import Path


_DATA = Path(__file__).resolve().parent
_WEIGHTS = json.loads((_DATA / "weights.json").read_text())
_TABLES = json.loads((_DATA / "tables.json").read_text())

_TEXT = {"hometown": "hometown", "work": "workplace", "jobTitle": "job title", "school": "school"}
_CATEGORIES = {"politicalAffiliation": (-2, 2, "political affiliation"), "religion": (0, 7, "religion")}
_ORDINAL = {
    "politicalImportance": (0, 2, "importance of politics"),
    "politicalFriendImportance": (0, 2, "importance of politics in friendships"),
    "timeOfDay": (-2, 2, "daily schedule"),
    "drink": (-1, 2, "drinking preference"),
    "smoke": (-1, 2, "smoking preference"),
    "drugs": (-1, 2, "drug-use preference"),
    "religionImportance": (0, 2, "importance of religion"),
    "pdaPreference": (0, 2, "preference for public affection"),
}
_OPPOSITES = {"personalityType": "personality style", "decisive": "decisiveness", "opinionated": "opinionatedness"}
_SIMILARITY = (*_TEXT, "wordsAndQualities", *_CATEGORIES, *_ORDINAL)
_COMPLEMENTARITY = (*_OPPOSITES, "mb", "zodiac", "loveLanguage")


@dataclass(frozen=True)
class Signal:
    field: str
    fraction: float
    weight: float
    explanation: str

    @property
    def contribution(self) -> float:
        return self.fraction * self.weight


@dataclass(frozen=True)
class Score:
    value: float | None
    coverage: float
    signals: tuple[Signal, ...]

    @property
    def reasons(self) -> tuple[str, ...]:
        """The three strongest positive contributions, with deterministic ties."""
        ordered = sorted(self.signals, key=lambda s: (-s.contribution, s.field))
        return tuple(s.explanation for s in ordered if s.contribution > 0)[:3]


@dataclass(frozen=True)
class MatchResult:
    similarity: Score
    complementarity: Score

    @property
    def ranking_score(self) -> float | None:
        """Equal-weight mean of the two scores, discounted by data coverage."""
        if all(s.value is None for s in (self.similarity, self.complementarity)):
            return None
        values = [(s.value or 0) * s.coverage / 100 for s in (self.similarity, self.complementarity)]
        return round(sum(values) / 2, 2)

    def as_dict(self) -> dict:
        result = asdict(self)
        result["ranking_score"] = self.ranking_score
        for name in ("similarity", "complementarity"):
            result[name]["reasons"] = list(getattr(self, name).reasons)
        return result


def _missing(value: object) -> bool:
    return value is None or (isinstance(value, str) and not value.strip())


def _text(profile: Mapping, field: str) -> str | None:
    value = profile.get(field)
    if _missing(value):
        return None
    if not isinstance(value, str):
        raise ValueError(f"{field} must be text or null")
    return " ".join(value.casefold().split())


def _enum(profile: Mapping, field: str, low: int, high: int) -> int | None:
    value = profile.get(field)
    if _missing(value):
        return None
    if type(value) is not int or not low <= value <= high:
        raise ValueError(f"{field} must be an integer from {low} to {high}, or null")
    return value


def _score(signals: list[Signal], fields: tuple, weights: dict) -> Score:
    # Scale before summing so large finite overrides do not overflow to infinity.
    scale = max((weights[f] for f in fields), default=0) or 1
    available = sum(s.weight / scale for s in signals)
    possible = sum(weights[f] / scale for f in fields)
    value = round(100 * sum(s.fraction * (s.weight / scale) for s in signals) / available, 2) if available else None
    coverage = round(100 * available / possible, 2) if possible else 0.0
    return Score(value, coverage, tuple(signals))


def score_profiles(left: Mapping, right: Mapping, *, weights: Mapping | None = None) -> MatchResult:
    """Compare original-style profile dictionaries using normalized signals.

    Missing answers do not count as agreement. Invalid provided values raise
    ValueError. A zero weight disables a factor, including input validation for
    that factor. Unrelated profile fields are ignored; no eligibility filtering
    or authentication is performed here.
    """
    if not isinstance(left, Mapping) or not isinstance(right, Mapping):
        raise ValueError("Both profiles must be mappings")
    active = {name: _WEIGHTS[name] for name in (*_SIMILARITY, *_COMPLEMENTARITY)}
    if weights is not None:
        if not isinstance(weights, Mapping):
            raise ValueError("weights must be a mapping")
        for name, value in weights.items():
            if name not in active:
                raise ValueError(f"Unknown weight: {name}")
            try:
                valid = not isinstance(value, bool) and isinstance(value, (int, float)) and math.isfinite(value) and value >= 0
            except OverflowError:
                valid = False
            if not valid:
                raise ValueError(f"Weight {name} must be a finite nonnegative number")
            active[name] = value

    similarity: list[Signal] = []
    complementarity: list[Signal] = []

    def add(target: list[Signal], name: str, fraction: float, explanation: str) -> None:
        target.append(Signal(name, fraction, active[name], explanation))

    for field, label in _TEXT.items():
        if not active[field]:
            continue
        a, b = _text(left, field), _text(right, field)
        if a is not None and b is not None:
            same = a == b
            add(similarity, field, float(same), f"{'Shared' if same else 'Different'} {label}.")

    if active["wordsAndQualities"]:
        def words(profile: Mapping, prefix: str, count: int) -> set[str]:
            return {value for i in range(1, count + 1) if (value := _text(profile, f"{prefix}{i}")) is not None}

        left_words, right_words = words(left, "word", 3), words(right, "word", 3)
        left_wants, right_wants = words(left, "quality", 2), words(right, "quality", 2)
        if left_words and right_words and left_wants and right_wants:
            overlap = (len(left_words & right_wants) / len(right_wants) + len(right_words & left_wants) / len(left_wants)) / 2
            add(similarity, "wordsAndQualities", overlap, f"Described traits meet {overlap:.0%} of the stated qualities, averaged in both directions.")

    for field, (low, high, label) in {**_CATEGORIES, **_ORDINAL}.items():
        if not active[field]:
            continue
        a, b = _enum(left, field, low, high), _enum(right, field, low, high)
        if a is not None and b is not None:
            fraction = float(a == b) if field in _CATEGORIES else 1 - abs(a - b) / (high - low)
            add(similarity, field, fraction, f"{label.capitalize()}: {fraction:.0%} agreement under the demo rules.")

    for field, label in _OPPOSITES.items():
        if not active[field]:
            continue
        a, b = _enum(left, field, 0, 1), _enum(right, field, 0, 1)
        if a is not None and b is not None:
            different = a != b
            add(complementarity, field, float(different), f"{'Different' if different else 'Same'} {label}; the original rule rewards a difference.")

    for field, key, label in [("mb", "mb_grid", "personality-type"), ("zodiac", "zodiac_grid", "zodiac")]:
        if not active[field]:
            continue
        table = _TABLES[key]
        a, b = _enum(left, field, 0, len(table) - 1), _enum(right, field, 0, len(table) - 1)
        if a is not None and b is not None:
            fraction = (table[a][b] + table[b][a]) / (2 * max(map(max, table)))
            add(complementarity, field, fraction, f"Historical {label} lookup: {fraction:.0%} of its maximum; an illustrative rule, not a validated prediction.")

    if active["loveLanguage"]:
        values = [_enum(p, f, 0, 4) for p in (left, right) for f in ("giveLoveLanguage", "receiveLoveLanguage")]
        if all(v is not None for v in values):
            give_a, receive_a, give_b, receive_b = values
            matches = int(give_a == receive_b) + int(give_b == receive_a)
            add(complementarity, "loveLanguage", matches / 2, f"Giving and receiving preferences align in {matches} of 2 directions.")

    return MatchResult(_score(similarity, _SIMILARITY, active), _score(complementarity, _COMPLEMENTARITY, active))
