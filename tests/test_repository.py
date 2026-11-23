"""Check the boundary between the runnable example and preserved server code."""

import os
from pathlib import Path
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from scripts.check_repository import PATTERNS


class RepositoryTests(unittest.TestCase):
    def test_historical_api_fails_before_importing_server_dependencies(self):
        env = os.environ.copy()
        env.pop("MUTUAL_ENABLE_LEGACY_API", None)
        result = subprocess.run([sys.executable, "-S", "-c", "import app"], cwd=ROOT / "backend/prototype", env=env, text=True, capture_output=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("The historical API is disabled", result.stderr)
        self.assertNotIn("ModuleNotFoundError", result.stderr)

    def test_credential_patterns_catch_synthetic_examples(self):
        examples = {
            "cloud access key": "AKIA" + "A" * 16,
            "private key": "-----BEGIN " + "PRIVATE KEY-----",
            "GitHub token": "ghp_" + "a" * 36,
            "credentialed database URL": "postgresql://" + "sample:sample@example.invalid/db",
            "literal cloud secret": "aws_secret_access_key" + "='sample'",
        }
        for name, value in examples.items():
            with self.subTest(name=name):
                self.assertIsNotNone(PATTERNS[name].search(value))


if __name__ == "__main__":
    unittest.main()
