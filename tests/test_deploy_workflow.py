from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT.joinpath(".github", "workflows", "deploy-frontend.yml").read_text(
    encoding="utf-8"
)


class DeploymentWorkflowTests(unittest.TestCase):
    def test_checks_out_only_its_own_repository(self):
        self.assertEqual(
            len(re.findall(r"^\s+uses:\s+actions/checkout@", WORKFLOW, re.MULTILINE)),
            1,
        )
        self.assertNotRegex(WORKFLOW, r"(?m)^\s+repository:")
        self.assertNotIn("kk67-docker", WORKFLOW)
        self.assertNotIn("git clone", WORKFLOW)
        self.assertIn(r"& .\scripts\upload-frontend.ps1", WORKFLOW)

    def test_production_upload_requires_a_default_branch_push(self):
        self.assertIn(
            "if: github.event_name == 'push' && github.ref == 'refs/heads/master'",
            WORKFLOW,
        )
        self.assertIn("cancel-in-progress: false", WORKFLOW)
        self.assertIn("contents: read", WORKFLOW)
        self.assertNotIn("pull_request_target", WORKFLOW)


if __name__ == "__main__":
    unittest.main()
