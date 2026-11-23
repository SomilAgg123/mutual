# Matching rules

The maintained engine preserves the original separation between **similarity** and **complementarity**, the original factor weights, and the personality-type/zodiac lookup data. It repairs how those inputs are interpreted and exposes the complete calculation.

These rules are an illustrative product experiment. They were not trained or validated against relationship outcomes. Identity and belief fields come from the original questionnaire; their inclusion is not a claim that they should determine compatibility in a real service.

## Formula

Each available factor has a fraction from 0 to 1 and a nonnegative weight:

```text
group score = 100 × sum(fraction × weight) / sum(available weights)
coverage    = 100 × sum(available weights) / sum(enabled weights)
ranking     = mean(similarity × similarity coverage,
                   complementarity × complementarity coverage)
```

Coverage is converted from a percentage to a fraction in the ranking formula. Scores and coverage are rounded to two decimals; ranking uses those reported values. A group with no comparable enabled factors has a `null` score and zero coverage. Both empty groups produce a `null` ranking; if only one group is present, the other contributes zero to the equal-weight mean. Disabling an entire group does not change that two-group averaging rule.

An incomplete pair can have a high score for its available answers. Coverage makes that limitation visible and discounts its ranking. Coverage measures comparable **factor weight**, not statistical confidence or the percentage of individual questionnaire answers completed.

## Similarity

| Factor | Comparison |
| --- | --- |
| Hometown, workplace, job title, school | Case-insensitive equality after whitespace normalization |
| Described words and desired qualities | Fraction of the other person's desired qualities supplied by each person's traits, averaged in both directions |
| Political affiliation, religion | Category equality; their numeric IDs have no distance meaning |
| Importance levels, daily schedule, lifestyle preferences | `1 - abs(a - b) / (maximum - minimum)` |

The traits factor requires nonempty described-trait and desired-quality sets for both people. Duplicate words are removed. It measures only the qualities actually supplied and is one factor for coverage purposes; filling one quality rather than two does not halve its coverage.

Missing fields, `null`, and blank strings are unknown. Two unknown values never count as agreement. Provided values of the wrong type or outside their enum range raise `ValueError` rather than producing a score. Boolean values are not accepted as integer enum IDs.

## Complementarity

| Factor | Comparison |
| --- | --- |
| Personality style, decisiveness, opinionatedness | The original exploratory rule rewards different binary answers |
| Giving/receiving preferences | Number of reciprocal matches, divided by two |
| Myers-Briggs and zodiac | Mean of both directional table entries, divided by that table's maximum |

The table mean repairs asymmetric source data: comparing A with B now produces the same score as B with A. Original table values and weights remain inspectable in [tables.json](../backend/matching/tables.json) and [weights.json](../backend/matching/weights.json). Low table values remain positive contributions, as in the original lookup design.

The strongest three positive weighted contributions supply each group's explanations. Zero contributions never appear as reasons. Lookup-based explanations explicitly identify themselves as historical heuristics.

## Input schema

The scorer accepts dictionaries using the original camelCase field names. Other fields, such as profile IDs, names, and email addresses, are ignored. The [fixtures](../examples/profiles.json) show complete examples.

| Fields | Accepted values |
| --- | --- |
| `hometown`, `work`, `jobTitle`, `school` | Text |
| `word1`–`word3`, `quality1`–`quality2` | Text |
| `politicalAffiliation` | Integer −2…2, treated as a category |
| `religion` | Integer 0…7, treated as a category |
| `politicalImportance`, `politicalFriendImportance`, `religionImportance`, `pdaPreference` | Integer 0…2 |
| `timeOfDay` | Integer −2…2 |
| `drink`, `smoke`, `drugs` | Integer −1…2 |
| `personalityType`, `decisive`, `opinionated` | Integer 0 or 1 |
| `mb` | Integer 0…15 |
| `zodiac` | Integer 0…11 |
| `giveLoveLanguage`, `receiveLoveLanguage` | Integer 0…4 |

All scored fields may be omitted or `null`. Historical category names and numeric mappings are preserved in [the original enums](../backend/prototype/app/algorithm/enums).

## Use as a library

From the repository root:

```python
import json
from pathlib import Path
from backend.matching import score_profiles

alex, jordan, *_ = json.loads(Path("examples/profiles.json").read_text())
result = score_profiles(alex, jordan, weights={"mb": 0, "zodiac": 0})
print(result.similarity.value)
print(result.complementarity.reasons)
print(result.as_dict())
```

Overrides accept the active factor names in the tables above; traits use `wordsAndQualities`, and reciprocal preferences use `loveLanguage`. Weights must be finite nonnegative numbers. A zero weight disables both scoring and validation of that factor. The original weights file also contains unused legacy fields; those are preserved for provenance but are not accepted as active overrides.

## Changes from the original

- Replaced `abs(a + b)`, which rewarded extreme identical answers more than neutral identical answers, with normalized agreement or distance as appropriate.
- Normalized each factor before weighting. Numeric weight values are preserved, but raw lookup ranges no longer inflate some factors disproportionately.
- Replaced the old `score * 2 + 20` conversion and cap with an explicit weighted average.
- Added missing-data coverage, validation, symmetric table handling, deterministic reasons, and working-directory-independent data loading.
- Removed NumPy and debug printing from the maintained execution path.

The engine does not check eligibility, consent, age, distance, social-network membership, or whether a pair is already connected. Those require separate product rules. Its ranking is only a demonstration over the provided fictional candidates.
