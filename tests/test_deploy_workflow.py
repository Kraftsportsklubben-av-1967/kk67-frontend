from pathlib import Path
import os
import re
import subprocess
import textwrap
import unittest


ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT.joinpath(".github", "workflows", "deploy-frontend.yml").read_text(
    encoding="utf-8"
)


class DeploymentWorkflowTests(unittest.TestCase):
    def test_workflow_runs_only_when_requested_manually(self):
        events = WORKFLOW.split("\non:\n", 1)[1].split("\npermissions:\n", 1)[0]
        self.assertEqual(events.strip(), "workflow_dispatch:")

    def test_uses_ubuntu_with_powershell(self):
        self.assertRegex(WORKFLOW, r"(?m)^\s+runs-on: ubuntu-latest$")
        self.assertIn("shell: pwsh", WORKFLOW)

    def test_checks_out_only_its_own_repository(self):
        self.assertEqual(
            len(re.findall(r"^\s+uses:\s+actions/checkout@", WORKFLOW, re.MULTILINE)),
            1,
        )
        self.assertNotRegex(WORKFLOW, r"(?m)^\s+repository:")
        self.assertNotIn("kk67-docker", WORKFLOW)
        self.assertNotIn("git clone", WORKFLOW)
        self.assertIn(r"& .\scripts\upload-frontend.ps1", WORKFLOW)

    def test_production_upload_requires_a_manual_default_branch_run(self):
        upload = WORKFLOW.split("      - name: Upload frontend using FTPS\n", 1)[1]
        guard = re.search(r"^        if: (.+)$", upload, re.MULTILINE).group(1)
        self.assertEqual(
            guard,
            "github.event_name == 'workflow_dispatch' && github.ref == 'refs/heads/master'",
        )
        self.assertIn("cancel-in-progress: false", WORKFLOW)
        self.assertIn("contents: read", WORKFLOW)
        self.assertNotIn("pull_request_target", WORKFLOW)

    def test_maps_key_is_only_available_to_manual_production_builds(self):
        build = WORKFLOW.split("      - name: Build frontend\n", 1)[1].split(
            "\n      - name: ", 1
        )[0]
        self.assertIn(
            "VITE_GOOGLE_API_KEY: ${{ github.event_name == 'workflow_dispatch' && "
            "github.ref == 'refs/heads/master' && secrets.VITE_GOOGLE_API_KEY || '' }}",
            build,
        )
        validation = textwrap.dedent(
            build.split("        run: |\n", 1)[1].rsplit("          yarn build", 1)[0]
        )
        for event, ref, key, should_fail in (
            ("pull_request", "refs/pull/1/merge", "", False),
            ("push", "refs/heads/master", "", False),
            ("workflow_dispatch", "refs/heads/master", "", True),
            ("workflow_dispatch", "refs/heads/feature", "", False),
            ("workflow_dispatch", "refs/heads/master", "test-maps-key", False),
        ):
            with self.subTest(event=event, ref=ref, key_present=bool(key)):
                result = subprocess.run(
                    [
                        "pwsh",
                        "-NoLogo",
                        "-NoProfile",
                        "-NonInteractive",
                        "-Command",
                        validation,
                    ],
                    env={
                        **os.environ,
                        "GITHUB_EVENT_NAME": event,
                        "GITHUB_REF": ref,
                        "VITE_GOOGLE_API_KEY": key,
                    },
                    capture_output=True,
                    text=True,
                    timeout=30,
                )
                self.assertEqual(result.returncode != 0, should_fail, result.stderr)
                if should_fail:
                    self.assertIn("Configure the VITE_GOOGLE_API_KEY", result.stderr)

    def test_ci_skips_unchanged_images_using_deployment_state(self):
        self.assertRegex(
            WORKFLOW,
            r"upload-frontend\.ps1[^\r\n]*-SkipUnchangedImages",
        )


if __name__ == "__main__":
    unittest.main()
