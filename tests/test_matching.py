"""Behavioral checks for the maintained matching package (standard library only)."""

import copy
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from backend.matching import score_profiles


class MatchingTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.profiles = json.loads((ROOT / "examples/profiles.json").read_text())

    def test_identical_neutral_and_extreme_answers_both_get_full_similarity(self):
        # The old abs(a+b) formula gave neutral agreement zero points.
        for value in [-2, 0, 2]:
            result = score_profiles({"timeOfDay": value}, {"timeOfDay": value})
            self.assertEqual(result.similarity.value, 100)

    def test_ordinal_distance_decreases_similarity(self):
        values = [score_profiles({"timeOfDay": -2}, {"timeOfDay": b}).similarity.value for b in [-2, -1, 0, 1, 2]]
        self.assertEqual(values, [100, 75, 50, 25, 0])

    def test_nominal_enum_numbers_do_not_create_false_closeness(self):
        for field, other in [("religion", 1), ("politicalAffiliation", -1)]:
            self.assertEqual(score_profiles({field: 0}, {field: other}).similarity.value, 0)

    def test_no_answers_are_not_a_match(self):
        result = score_profiles({}, {})
        self.assertIsNone(result.similarity.value)
        self.assertIsNone(result.complementarity.value)
        self.assertIsNone(result.ranking_score)
        self.assertEqual(result.similarity.coverage, 0)
        self.assertEqual(result.similarity.reasons, ())

    def test_blanks_and_nulls_do_not_count_as_agreement(self):
        result = score_profiles({"school": "  ", "smoke": None}, {"school": "", "smoke": None})
        self.assertIsNone(result.similarity.value)

    def test_incomplete_profile_reports_coverage_and_discounted_ranking(self):
        result = score_profiles({"school": "Maple"}, {"school": "Maple"})
        self.assertEqual(result.similarity.value, 100)
        self.assertGreater(result.similarity.coverage, 0)
        self.assertLess(result.similarity.coverage, 10)
        self.assertLess(result.ranking_score, 5)

    def test_normalizes_text_and_deduplicates_traits(self):
        left = {"school": "  MAPLE   college ", "word1": "kind", "word2": "KIND", "quality1": "curious"}
        right = {"school": "Maple College", "word1": "Curious", "quality1": " Kind ", "quality2": "KIND"}
        self.assertEqual(score_profiles(left, right).similarity.value, 100)

    def test_reciprocal_preferences_count_both_directions(self):
        left = {"giveLoveLanguage": 0, "receiveLoveLanguage": 3}
        right = {"giveLoveLanguage": 3, "receiveLoveLanguage": 0}
        self.assertEqual(score_profiles(left, right).complementarity.value, 100)
        right["giveLoveLanguage"] = 2
        self.assertEqual(score_profiles(left, right).complementarity.value, 50)
        right["receiveLoveLanguage"] = 2
        self.assertEqual(score_profiles(left, right).complementarity.value, 0)

    def test_opposites_rule_is_explicit(self):
        self.assertEqual(score_profiles({"decisive": 0}, {"decisive": 1}).complementarity.value, 100)
        self.assertEqual(score_profiles({"decisive": 0}, {"decisive": 0}).complementarity.value, 0)

    def test_every_legacy_table_pair_is_symmetric_and_bounded(self):
        # The original zodiac table contains asymmetric entries.
        for field, size in [("mb", 16), ("zodiac", 12)]:
            for a in range(size):
                for b in range(size):
                    forward = score_profiles({field: a}, {field: b})
                    backward = score_profiles({field: b}, {field: a})
                    self.assertEqual(forward, backward)
                    self.assertGreaterEqual(forward.complementarity.value, 0)
                    self.assertLessEqual(forward.complementarity.value, 100)

    def test_fixtures_have_full_coverage_and_expected_ranking(self):
        subject, *candidates = self.profiles
        results = [score_profiles(subject, p) for p in candidates]
        self.assertEqual([r.similarity.coverage for r in results], [100, 100, 100])
        self.assertEqual([r.complementarity.coverage for r in results], [100, 100, 100])
        self.assertGreater(results[0].ranking_score, results[1].ranking_score)
        self.assertGreater(results[1].ranking_score, results[2].ranking_score)

    def test_pair_order_does_not_change_result_or_mutate_inputs(self):
        before = copy.deepcopy(self.profiles)
        for left in self.profiles:
            for right in self.profiles:
                self.assertEqual(score_profiles(left, right), score_profiles(right, left))
        self.assertEqual(self.profiles, before)

    def test_reasons_only_describe_positive_contributions(self):
        result = score_profiles({"school": "A", "timeOfDay": -2}, {"school": "B", "timeOfDay": 2})
        self.assertEqual(result.similarity.value, 0)
        self.assertEqual(result.similarity.reasons, ())

    def test_rejects_invalid_provided_values_in_either_profile(self):
        for field, value in [("mb", -1), ("mb", 16), ("zodiac", 12), ("smoke", True), ("smoke", "1"), ("smoke", 1.5), ("religion", 8), ("decisive", 2), ("school", 12), ("quality1", [])]:
            for left, right in [({field: value}, {}), ({}, {field: value})]:
                with self.subTest(field=field, value=value):
                    with self.assertRaises(ValueError):
                        score_profiles(left, right)
        with self.assertRaises(ValueError):
            score_profiles([], {})

    def test_weight_overrides_and_disabling_legacy_tables(self):
        result = score_profiles({"school": "A", "work": "X"}, {"school": "A", "work": "Y"}, weights={"school": 3, "work": 1})
        self.assertEqual(result.similarity.value, 75)
        result = score_profiles({"zodiac": "unused"}, {"zodiac": "unused"}, weights={"zodiac": 0, "mb": 0})
        self.assertIsNone(result.complementarity.value)
        for weights in [{"unknown": 1}, {"mb": -1}, {"mb": float("nan")}, {"mb": float("inf")}, {"mb": True}, {"mb": "2"}, {"mb": 10 ** 1000}, []]:
            with self.assertRaises(ValueError):
                score_profiles({}, {}, weights=weights)

    def test_large_finite_weights_do_not_overflow(self):
        result = score_profiles({"school": "A", "work": "X"}, {"school": "A", "work": "Y"}, weights={"school": 1e308, "work": 1e308})
        self.assertEqual(result.similarity.value, 50)
        json.dumps(result.as_dict(), allow_nan=False)

    def test_cli_runs_from_another_directory_without_site_packages(self):
        with tempfile.TemporaryDirectory() as cwd:
            output = subprocess.check_output([sys.executable, "-S", str(ROOT / "examples/match_demo.py"), "--json"], cwd=cwd, text=True)
        result = json.loads(output)
        self.assertTrue(result["fictional_profiles"])
        self.assertEqual(result["matches"][0]["name"], "Jordan")
        self.assertEqual(len(result["matches"]), 3)


if __name__ == "__main__":
    unittest.main()
