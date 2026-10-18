import hashlib
import json
import os
from pathlib import Path
import shlex
import shutil
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
PWSH = shutil.which("pwsh")
NODE = shutil.which("node")
CURL = shutil.which("curl")
DESTINATION = "ftp://ftp.c9ry3m6by.service.one/webroots/r1058728/"
IMAGE_STATE_URL = DESTINATION + ".kk67-image-state.json"


def ps_quote(value):
    return "'" + str(value).replace("'", "''") + "'"


def image_state(images, complete=True):
    return json.dumps(
        {
            "version": 1,
            "complete": complete,
            "images": {
                path: hashlib.sha256(contents).hexdigest()
                for path, contents in images.items()
            },
        }
    )


@unittest.skipUnless(
    shutil.which("git") and ROOT.joinpath(".git").exists(),
    "A Git checkout is required for secret-file ignore checks",
)
class SecretFileIgnoreTests(unittest.TestCase):
    def test_local_credentials_and_editor_backups_are_ignored(self):
        result = subprocess.run(
            ["git", "check-ignore", "--no-index", "--stdin", "-z"],
            input="\0".join((".env", ".env.local", ".env~", "..env.un~", ".env.example", "")),
            cwd=ROOT,
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(
            set(result.stdout.rstrip("\0").split("\0")),
            {".env", ".env.local", ".env~", "..env.un~"},
        )


@unittest.skipUnless(PWSH, "PowerShell 7 is required for upload-script tests")
class FrontendUploadTests(unittest.TestCase):
    def setUp(self):
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary_directory.cleanup)
        self.root = Path(self.temporary_directory.name).joinpath("frontend with spaces")
        self.root.mkdir()
        self.script = self.root.joinpath("scripts", "upload-frontend.ps1")
        self.script.parent.mkdir()
        shutil.copyfile(ROOT.joinpath("scripts", self.script.name), self.script)
        shutil.copyfile(
            ROOT.joinpath("scripts", "ftps.psm1"),
            self.script.with_name("ftps.psm1"),
        )
        self.frontend = self.root
        self.dist = self.frontend.joinpath("dist")
        self.dist.joinpath("assets").mkdir(parents=True)
        self.dist.joinpath("index.html").write_text("<html></html>", encoding="utf-8")
        self.dist.joinpath("assets", "app.js").write_text("app", encoding="utf-8")
        self.dist.joinpath("assets", "space # [name].txt").write_text(
            "asset", encoding="utf-8"
        )
        self.dist.joinpath(".well-known").mkdir()
        self.dist.joinpath(".well-known", "example.txt").write_text(
            "public", encoding="utf-8"
        )
        self.frontend.joinpath("package.json").write_text("{}", encoding="utf-8")
        self.frontend.joinpath(".env").write_text("NOT_FOR_UPLOAD=1", encoding="utf-8")
        self.frontend.joinpath(".htaccess").write_text("routing", encoding="utf-8")
        self.curl_log = self.root.joinpath("curl.jsonl")
        self.command_log = self.root.joinpath("commands.jsonl")
        self.build_log = self.root.joinpath("build.json")
        self.prompt_log = self.root.joinpath("prompt.txt")
        self.env_file = self.root.joinpath(".env")
        self.password = 'pass "quoted" \\ : $value & end'

    def invoke_script(self, arguments="-SkipBuild", credential=True, **overrides):
        env = os.environ.copy()
        env.update(
            {
                "KK67_TEST_CURL_LOG": str(self.curl_log),
                "KK67_TEST_COMMAND_LOG": str(self.command_log),
                "KK67_TEST_BUILD_LOG": str(self.build_log),
                "KK67_TEST_PROMPT_LOG": str(self.prompt_log),
                "KK67_TEST_ALLOW_PROMPT": "0",
                "KK67_TEST_BUILD_EXIT": "0",
                "KK67_TEST_PREFLIGHT_EXIT": "0",
                "KK67_TEST_UPLOAD_EXIT": "0",
                "KK67_TEST_IMAGE_STATE": "",
                "KK67_TEST_STATE_READ_EXIT": "0",
                "KK67_TEST_STATE_WRITE_EXIT": "0",
                "KK67_TEST_STATE_COMMIT_EXIT": "0",
                "KK67_TEST_FAIL_UPLOAD_SUFFIX": "",
                "KK67_TEST_PASSWORD": self.password,
                "NO_COLOR": "1",
                "TERM": "dumb",
            }
        )
        env.update(overrides)
        harness = r"""
function yarn {
    @{
        arguments = @($args)
        directory = (Get-Location).Path
    } | ConvertTo-Json -Compress |
        Set-Content -LiteralPath $env:KK67_TEST_BUILD_LOG -WhatIf:$false
    $global:LASTEXITCODE = [int] $env:KK67_TEST_BUILD_EXIT
}
function Invoke-TestCurl {
    $call = @{
        arguments = @($args)
        config = (@($input) -join "`n")
    }
    $stateUpload = $args -contains '--upload-file' -and
        $args[-1].EndsWith('/.kk67-image-state.json')
    if ($stateUpload) {
        $call.imageState = Get-Content -Raw -LiteralPath $args[
            [Array]::IndexOf($args, '--upload-file') + 1
        ]
    }
    $call | ConvertTo-Json -Compress |
        Add-Content -LiteralPath $env:KK67_TEST_CURL_LOG -WhatIf:$false
    if ($args -contains '--list-only') {
        $global:LASTEXITCODE = [int] $env:KK67_TEST_PREFLIGHT_EXIT
    }
    elseif ($args -contains '--output') {
        $global:LASTEXITCODE = [int] $env:KK67_TEST_STATE_READ_EXIT
        if ($global:LASTEXITCODE -eq 0) {
            if ([string]::IsNullOrEmpty($env:KK67_TEST_IMAGE_STATE)) {
                $global:LASTEXITCODE = 78
            }
            else {
                Set-Content -LiteralPath $args[[Array]::IndexOf($args, '--output') + 1] `
                    -Value $env:KK67_TEST_IMAGE_STATE -NoNewline -WhatIf:$false
            }
        }
    }
    elseif ($stateUpload) {
        $state = ConvertFrom-Json $call.imageState
        $global:LASTEXITCODE = if ($state.complete) {
            [int] $env:KK67_TEST_STATE_COMMIT_EXIT
        }
        else {
            [int] $env:KK67_TEST_STATE_WRITE_EXIT
        }
    }
    elseif ($env:KK67_TEST_FAIL_UPLOAD_SUFFIX -and
        $args[-1].EndsWith($env:KK67_TEST_FAIL_UPLOAD_SUFFIX)) {
        $global:LASTEXITCODE = 25
    }
    else {
        $global:LASTEXITCODE = [int] $env:KK67_TEST_UPLOAD_EXIT
    }
}
function Get-Command {
    [CmdletBinding()]
    param(
        [string] $Name,
        [System.Management.Automation.CommandTypes] $CommandType
    )
    if ($Name -in @('curl', 'curl.exe')) {
        @{ name = $Name; commandType = [string] $CommandType } |
            ConvertTo-Json -Compress |
            Add-Content -LiteralPath $env:KK67_TEST_COMMAND_LOG -WhatIf:$false
        if ($Name -ne 'curl' -or $CommandType -ne 'Application') {
            throw 'The uploader must resolve the native curl application without an OS suffix.'
        }
        return Microsoft.PowerShell.Core\Get-Command Invoke-TestCurl -CommandType Function
    }
    return Microsoft.PowerShell.Core\Get-Command @PSBoundParameters
}
function Get-Credential {
    if ($env:KK67_TEST_ALLOW_PROMPT -ne '1') {
        throw 'Unexpected interactive credential prompt.'
    }
    Set-Content -LiteralPath $env:KK67_TEST_PROMPT_LOG -Value 'prompted' -WhatIf:$false
    return $global:KK67TestCredential
}
$securePassword = ConvertTo-SecureString $env:KK67_TEST_PASSWORD -AsPlainText -Force
$credential = [PSCredential]::new('ftp-user', $securePassword)
$global:KK67TestCredential = $credential
"""
        credential_argument = "-Credential $credential" if credential else ""
        return subprocess.run(
            [
                PWSH,
                "-NoLogo",
                "-NoProfile",
                "-NonInteractive",
                "-Command",
                harness
                + f"\n& {ps_quote(self.script)} {credential_argument} {arguments}",
            ],
            cwd=self.root,
            env=env,
            capture_output=True,
            text=True,
            encoding="utf-8",
            timeout=30,
        )

    def curl_calls(self):
        if not self.curl_log.exists():
            return []
        return [
            json.loads(line)
            for line in self.curl_log.read_text(encoding="utf-8").splitlines()
        ]

    def assert_success(self, result):
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def add_image(self, relative_path, contents=b"photo"):
        path = self.dist.joinpath(*relative_path.split("/"))
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(contents)
        return path

    def build_uploads(self):
        return [
            call
            for call in self.curl_calls()
            if "--upload-file" in call["arguments"]
            and call["arguments"][-1] != IMAGE_STATE_URL
        ]

    def uploaded_image_states(self):
        return [
            json.loads(call["imageState"])
            for call in self.curl_calls()
            if "imageState" in call
        ]

    def test_incremental_images_skip_unchanged_public_and_bundled_files(self):
        images = {
            "public/pictures/old.JPG": b"original photo",
            "assets/logo-contenthash.svg": b"<svg></svg>",
        }
        for path, contents in images.items():
            self.add_image(path, contents)
        result = self.invoke_script(
            "-SkipBuild -SkipUnchangedImages",
            KK67_TEST_IMAGE_STATE=image_state(images),
        )
        self.assert_success(result)
        uploads = self.build_uploads()
        self.assertEqual(len(uploads), 4)
        self.assertEqual(uploads[-1]["arguments"][-1], DESTINATION + "index.html")
        self.assertFalse(
            any(call["arguments"][-1].endswith((".JPG", ".svg")) for call in uploads)
        )
        self.assertEqual(self.uploaded_image_states(), [])
        self.assertIn("2 unchanged images skipped", result.stdout)
        self.assertEqual(len(self.curl_calls()), 6)

    def test_incremental_images_upload_only_new_or_changed_content(self):
        previous = {
            "public/pictures/same.jpg": b"original",
            "public/pictures/changed.jpg": b"oldphoto",
        }
        current = {
            "public/pictures/same.jpg": b"original",
            "public/pictures/changed.jpg": b"newphoto",
            "assets/new # [photo].avif": b"new image",
        }
        for path, contents in current.items():
            self.add_image(path, contents)
        result = self.invoke_script(
            "-SkipBuild -SkipUnchangedImages",
            KK67_TEST_IMAGE_STATE=image_state(previous),
        )
        self.assert_success(result)
        urls = [call["arguments"][-1] for call in self.build_uploads()]
        self.assertNotIn(DESTINATION + "public/pictures/same.jpg", urls)
        self.assertIn(DESTINATION + "public/pictures/changed.jpg", urls)
        self.assertIn(DESTINATION + "assets/new%20%23%20%5Bphoto%5D.avif", urls)
        self.assertEqual(urls[-1], DESTINATION + "index.html")
        self.assertEqual(len(urls), 6)
        states = self.uploaded_image_states()
        self.assertEqual([state["complete"] for state in states], [False, True])
        self.assertEqual(states[-1], json.loads(image_state(current)))
        self.assertEqual(self.curl_calls()[2]["arguments"][-1], IMAGE_STATE_URL)
        self.assertEqual(self.curl_calls()[-2]["arguments"][-1], IMAGE_STATE_URL)

    def test_incremental_images_initialize_missing_state_with_full_upload(self):
        self.add_image("public/pictures/photo.png")
        result = self.invoke_script("-SkipBuild -SkipUnchangedImages")
        self.assert_success(result)
        self.assertEqual(len(self.build_uploads()), 5)
        self.assertEqual(
            [state["complete"] for state in self.uploaded_image_states()],
            [False, True],
        )
        self.assertRegex(result.stdout, r"Image state not found")
        for call in self.curl_calls():
            arguments = call["arguments"]
            self.assertEqual(arguments[:3], ["--disable", "--config", "-"])
            self.assertIn("--ssl-reqd", arguments)
            self.assertNotIn(self.password, " ".join(arguments))
            if "--output" in arguments:
                self.assertFalse(Path(arguments[arguments.index("--output") + 1]).exists())
            if "imageState" in call:
                self.assertFalse(
                    Path(arguments[arguments.index("--upload-file") + 1]).exists()
                )
                self.assertNotIn(self.password, call["imageState"])
        self.assertEqual(self.curl_calls()[-1]["arguments"][-1], DESTINATION + "index.html")

    def test_incremental_images_recover_incomplete_or_invalid_state(self):
        images = {"public/pictures/photo.jpg": b"photo"}
        self.add_image("public/pictures/photo.jpg")
        invalid_states = (
            image_state(images, complete=False),
            "{interrupted",
            " ",
            "null",
            '{"version":2,"complete":true,"images":{}}',
            '{"version":1,"complete":"true","images":{}}',
            '{"version":1,"complete":true,"images":{"photo.jpg":"not-a-hash"}}',
        )
        for saved_state in invalid_states:
            with self.subTest(state=saved_state[:60]):
                self.curl_log.unlink(missing_ok=True)
                result = self.invoke_script(
                    "-SkipBuild -SkipUnchangedImages",
                    KK67_TEST_IMAGE_STATE=saved_state,
                )
                self.assert_success(result)
                self.assertIn("WARNING", result.stdout)
                self.assertEqual(len(self.build_uploads()), 5)
                self.assertEqual(
                    self.uploaded_image_states()[-1], json.loads(image_state(images))
                )

    def test_incremental_images_read_failure_does_not_upload(self):
        self.add_image("public/pictures/photo.jpg")
        result = self.invoke_script(
            "-SkipBuild -SkipUnchangedImages", KK67_TEST_STATE_READ_EXIT="56"
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertRegex(result.stderr, r"Image.state download failed")
        self.assertEqual(self.build_uploads(), [])
        self.assertEqual(self.uploaded_image_states(), [])

    def test_incremental_images_require_invalidation_before_file_uploads(self):
        self.add_image("public/pictures/photo.jpg")
        result = self.invoke_script(
            "-SkipBuild -SkipUnchangedImages", KK67_TEST_STATE_WRITE_EXIT="25"
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.build_uploads(), [])
        self.assertEqual(
            [state["complete"] for state in self.uploaded_image_states()], [False]
        )

    def test_incremental_images_retry_a_partial_upload_without_skipping_images(self):
        images = {
            "public/pictures/a.jpg": b"new first photo",
            "public/pictures/b.jpg": b"new second photo",
        }
        for path, contents in images.items():
            self.add_image(path, contents)
        result = self.invoke_script(
            "-SkipBuild -SkipUnchangedImages",
            KK67_TEST_FAIL_UPLOAD_SUFFIX="/b.jpg",
        )
        self.assertNotEqual(result.returncode, 0)
        states = self.uploaded_image_states()
        self.assertEqual([state["complete"] for state in states], [False])
        self.assertNotEqual(
            self.build_uploads()[-1]["arguments"][-1], DESTINATION + "index.html"
        )
        self.curl_log.unlink()
        result = self.invoke_script(
            "-SkipBuild -SkipUnchangedImages",
            KK67_TEST_IMAGE_STATE=json.dumps(states[-1]),
        )
        self.assert_success(result)
        self.assertEqual(len(self.build_uploads()), 6)
        self.assertTrue(self.uploaded_image_states()[-1]["complete"])

    def test_incremental_images_commit_failure_stops_before_index(self):
        self.add_image("public/pictures/photo.jpg")
        result = self.invoke_script(
            "-SkipBuild -SkipUnchangedImages", KK67_TEST_STATE_COMMIT_EXIT="25"
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertTrue(self.uploaded_image_states()[-1]["complete"])
        self.assertFalse(
            any(
                call["arguments"][-1] == DESTINATION + "index.html"
                for call in self.build_uploads()
            )
        )
        self.assertNotIn("Upload complete", result.stdout)

    def test_incremental_images_remain_valid_after_an_index_upload_failure(self):
        self.add_image("public/pictures/photo.jpg")
        result = self.invoke_script(
            "-SkipBuild -SkipUnchangedImages",
            KK67_TEST_FAIL_UPLOAD_SUFFIX="/index.html",
        )
        self.assertNotEqual(result.returncode, 0)
        completed_state = self.uploaded_image_states()[-1]
        self.assertTrue(completed_state["complete"])
        self.curl_log.unlink()
        result = self.invoke_script(
            "-SkipBuild -SkipUnchangedImages",
            KK67_TEST_IMAGE_STATE=json.dumps(completed_state),
        )
        self.assert_success(result)
        self.assertEqual(len(self.build_uploads()), 4)
        self.assertEqual(self.uploaded_image_states(), [])

    def test_full_image_upload_refreshes_state_without_using_the_old_baseline(self):
        self.add_image("public/pictures/photo.jpg")
        result = self.invoke_script(KK67_TEST_STATE_READ_EXIT="56")
        self.assert_success(result)
        self.assertEqual(len(self.build_uploads()), 5)
        self.assertFalse(
            any("--output" in call["arguments"] for call in self.curl_calls())
        )
        self.assertEqual(
            [state["complete"] for state in self.uploaded_image_states()], [False, True]
        )

    def test_incremental_images_whatif_does_not_read_state_or_credentials(self):
        self.add_image("public/pictures/photo.jpg")
        self.env_file.write_text("FTP_USERNAME=incomplete\n", encoding="utf-8")
        result = self.invoke_script(
            "-SkipBuild -SkipUnchangedImages -WhatIf", credential=False
        )
        self.assert_success(result)
        self.assertEqual(self.curl_calls(), [])
        self.assertFalse(self.prompt_log.exists())

    def test_reserved_image_state_file_is_rejected_before_connecting(self):
        self.dist.joinpath(".kk67-image-state.json").write_text("{}", encoding="utf-8")
        result = self.invoke_script()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("reserved", result.stderr)
        self.assertEqual(self.curl_calls(), [])

    def test_resolves_native_curl_application(self):
        result = self.invoke_script()
        self.assert_success(result)
        lookups = [
            json.loads(line)
            for line in self.command_log.read_text(encoding="utf-8").splitlines()
        ]
        self.assertEqual(lookups, [{"name": "curl", "commandType": "Application"}])

    def test_multiple_native_curl_candidates_use_first_executable(self):
        self.add_image("public/pictures/photo.jpg")
        stub = self.root.joinpath("curl_stub.py")
        stub.write_text(
            "import json, os, sys\n"
            "from pathlib import Path\n"
            "arguments = sys.argv[2:]\n"
            "if '--output' in arguments:\n"
            "    Path(arguments[arguments.index('--output') + 1]).write_text(\n"
            "        os.environ['KK67_TEST_IMAGE_STATE'], encoding='utf-8')\n"
            "with open(os.environ['KK67_TEST_CURL_LOG'], 'a', encoding='utf-8') as log:\n"
            "    log.write(json.dumps({'client': sys.argv[1], "
            "'arguments': sys.argv[2:], 'config': sys.stdin.read()}) + '\\n')\n",
            encoding="utf-8",
        )
        executables = []
        for name in ("first", "second"):
            directory = self.root.resolve().joinpath(f"curl {name}")
            directory.mkdir()
            if os.name == "nt":
                executable = directory.joinpath("curl.cmd")
                command = f'@echo off\n"{sys.executable}" "{stub}" {name} %*\n'
            else:
                executable = directory.joinpath("curl")
                command = (
                    f"#!/bin/sh\nexec {shlex.quote(sys.executable)} "
                    f'{shlex.quote(str(stub))} {name} "$@"\n'
                )
            executable.write_text(command, encoding="utf-8")
            executable.chmod(0o755)
            executables.append(executable)
        env = os.environ.copy()
        env.update(
            {
                "PATH": os.pathsep.join(str(path.parent) for path in executables),
                "KK67_TEST_CURL_LOG": str(self.curl_log),
                "KK67_TEST_PASSWORD": self.password,
                "KK67_TEST_IMAGE_STATE": image_state(
                    {"public/pictures/photo.jpg": b"photo"}
                ),
                "NO_COLOR": "1",
                "TERM": "dumb",
            }
        )
        command = f"""
$ErrorActionPreference = 'Stop'
$candidates = @(Get-Command curl -CommandType Application -ErrorAction Stop)
if ($candidates.Count -ne 2 -or
    $candidates[0].Source -ne {ps_quote(executables[0])} -or
    $candidates[1].Source -ne {ps_quote(executables[1])}) {{
    throw 'Expected two isolated native curl executables.'
}}
$password = ConvertTo-SecureString $env:KK67_TEST_PASSWORD -AsPlainText -Force
$credential = [PSCredential]::new('ftp-user', $password)
& {ps_quote(self.script)} -SkipBuild -SkipUnchangedImages -Credential $credential
"""
        result = subprocess.run(
            [PWSH, "-NoLogo", "-NoProfile", "-NonInteractive", "-Command", command],
            cwd=self.root,
            env=env,
            capture_output=True,
            text=True,
            encoding="utf-8",
            timeout=30,
        )
        self.assert_success(result)
        calls = self.curl_calls()
        self.assertEqual(len(calls), 6)
        self.assertEqual({call["client"] for call in calls}, {"first"})
        self.assertIn("--list-only", calls[0]["arguments"])
        self.assertIn("--output", calls[1]["arguments"])
        self.assertFalse(
            any(
                call["arguments"][-1].endswith("/photo.jpg")
                for call in calls
            )
        )
        self.assertEqual(calls[-1]["arguments"][-1], DESTINATION + "index.html")
        for call in calls:
            self.assertEqual(call["arguments"][:3], ["--disable", "--config", "-"])
            self.assertTrue(call["config"].startswith('user = "ftp-user:'))
            self.assertNotIn(self.password, " ".join(call["arguments"]))
        self.assertNotIn(self.password, result.stdout + result.stderr)

    def test_whatif_never_connects_or_prompts_for_credentials(self):
        self.env_file.write_text("FTP_USERNAME=incomplete\n", encoding="utf-8")
        result = self.invoke_script("-SkipBuild -WhatIf", credential=False)
        self.assert_success(result)
        self.assertIn(DESTINATION, result.stdout)
        self.assertIn("4 files", result.stdout)
        self.assertNotIn("Upload complete", result.stdout)
        self.assertEqual(self.curl_calls(), [])
        self.assertFalse(self.build_log.exists())

    def test_default_build_runs_in_frontend_before_preview(self):
        result = self.invoke_script("-WhatIf", credential=False)
        self.assert_success(result)
        build = json.loads(self.build_log.read_text(encoding="utf-8"))
        self.assertEqual(build["arguments"], ["build"])
        self.assertEqual(Path(build["directory"]).resolve(), self.frontend.resolve())
        self.assertEqual(self.curl_calls(), [])

    @unittest.skipUnless(NODE, "Node.js 20.12+ is required for saved credentials")
    def test_reads_saved_credentials_with_real_dotenv_parser(self):
        self.password += " # = \u00f8"
        self.env_file.write_text(
            "export FTP_USERNAME='saved-user'\n"
            f"FTP_PASSWORD='{self.password}' # outside the password\n"
            "NODE_OPTIONS='--require=does-not-exist'\n",
            encoding="utf-8",
        )
        result = self.invoke_script(credential=False)
        self.assert_success(result)
        escaped = self.password.replace("\\", "\\\\").replace('"', '\\"')
        calls = self.curl_calls()
        self.assertEqual(len(calls), 5)
        for call in calls:
            self.assertEqual(call["config"], f'user = "saved-user:{escaped}"')
            self.assertNotIn(self.password, " ".join(call["arguments"]))
        self.assertNotIn(self.password, result.stdout + result.stderr)
        self.assertFalse(self.prompt_log.exists())

    @unittest.skipUnless(NODE, "Node.js 20.12+ is required for saved credentials")
    def test_reads_external_credential_file_without_a_docker_checkout(self):
        external = self.root.parent.joinpath("private ftp.env")
        external.write_text(
            f"FTP_USERNAME=external-user\nFTP_PASSWORD='{self.password}'\n",
            encoding="utf-8",
        )
        self.env_file.write_text("FTP_USERNAME=ignored-incomplete\n", encoding="utf-8")
        result = self.invoke_script(
            f"-SkipBuild -EnvFilePath {ps_quote(external)}", credential=False
        )
        self.assert_success(result)
        self.assertTrue(self.curl_calls())
        for call in self.curl_calls():
            self.assertTrue(call["config"].startswith('user = "external-user:'))
        self.assertNotIn(self.password, result.stdout + result.stderr)
        self.assertFalse(self.prompt_log.exists())

    def test_explicit_missing_credential_file_fails_before_connecting(self):
        result = self.invoke_script(
            "-SkipBuild -EnvFilePath '.\\missing.env'", credential=False
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Credentials file not found", result.stderr)
        self.assertEqual(self.curl_calls(), [])
        self.assertFalse(self.prompt_log.exists())

    def test_whatif_does_not_require_an_explicit_credential_file(self):
        result = self.invoke_script(
            "-SkipBuild -WhatIf -EnvFilePath '.\\missing.env'", credential=False
        )
        self.assert_success(result)
        self.assertEqual(self.curl_calls(), [])
        self.assertFalse(self.prompt_log.exists())

    def test_explicit_credential_overrides_a_missing_credential_file(self):
        result = self.invoke_script("-SkipBuild -EnvFilePath '.\\missing.env'")
        self.assert_success(result)
        self.assertTrue(self.curl_calls())

    def test_explicit_credential_overrides_incomplete_env(self):
        self.env_file.write_text("FTP_USERNAME=ignored-user\n", encoding="utf-8")
        result = self.invoke_script()
        self.assert_success(result)
        self.assertTrue(self.curl_calls())
        for call in self.curl_calls():
            self.assertTrue(call["config"].startswith('user = "ftp-user:'))
            self.assertNotIn("ignored-user", call["config"])

    @unittest.skipUnless(NODE, "Node.js 20.12+ is required for saved credentials")
    def test_partial_saved_credentials_fail_without_prompting_or_uploading(self):
        for contents in (
            "FTP_USERNAME=saved-user\n",
            f"FTP_PASSWORD='{self.password}'\n",
        ):
            with self.subTest(contents=contents.split("=")[0]):
                self.env_file.write_text(contents, encoding="utf-8")
                result = self.invoke_script(credential=False)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("Set both FTP_USERNAME and FTP_PASSWORD", result.stderr)
                self.assertEqual(self.curl_calls(), [])
                self.assertFalse(self.prompt_log.exists())
                self.assertNotIn(self.password, result.stdout + result.stderr)

    @unittest.skipUnless(NODE, "Node.js 20.12+ is required for saved credentials")
    def test_absent_or_empty_saved_credentials_keep_secure_prompt(self):
        for contents in ("OTHER_SETTING=1\n", "FTP_USERNAME=''\nFTP_PASSWORD=''\n"):
            with self.subTest(contents=contents):
                self.curl_log.unlink(missing_ok=True)
                self.prompt_log.unlink(missing_ok=True)
                self.env_file.write_text(contents, encoding="utf-8")
                result = self.invoke_script(credential=False, KK67_TEST_ALLOW_PROMPT="1")
                self.assert_success(result)
                self.assertTrue(self.prompt_log.exists())
                self.assertEqual(len(self.curl_calls()), 5)

    def test_uploads_only_build_files_with_index_last_and_no_deletions(self):
        result = self.invoke_script()
        self.assert_success(result)
        calls = self.curl_calls()
        self.assertEqual(len(calls), 5)
        self.assertIn("--list-only", calls[0]["arguments"])
        self.assertNotIn("--ftp-create-dirs", calls[0]["arguments"])
        self.assertEqual(calls[0]["arguments"][-1], DESTINATION)
        uploads = calls[1:]
        self.assertEqual(uploads[-1]["arguments"][-1], DESTINATION + "index.html")
        self.assertEqual(
            {call["arguments"][-1] for call in uploads},
            {
                DESTINATION + "index.html",
                DESTINATION + "assets/app.js",
                DESTINATION + "assets/space%20%23%20%5Bname%5D.txt",
                DESTINATION + ".well-known/example.txt",
            },
        )
        for call in uploads:
            arguments = call["arguments"]
            self.assertIn("--ftp-create-dirs", arguments)
            source = Path(arguments[arguments.index("--upload-file") + 1])
            self.assertTrue(source.resolve().is_relative_to(self.dist.resolve()))
        for call in calls:
            arguments = call["arguments"]
            self.assertEqual(arguments[:3], ["--disable", "--config", "-"])
            self.assertIn("--ssl-reqd", arguments)
            self.assertIn("=ftp", arguments)
            self.assertNotIn("--insecure", arguments)
            self.assertNotIn("--quote", arguments)
            self.assertNotIn("--user", arguments)
            self.assertNotIn("ftp-user", " ".join(arguments))
            self.assertNotIn(self.password, " ".join(arguments))
            escaped = self.password.replace("\\", "\\\\").replace('"', '\\"')
            self.assertEqual(call["config"], f'user = "ftp-user:{escaped}"')
        self.assertNotIn(self.password, result.stdout + result.stderr)
        self.assertIn("Upload complete: 4", result.stdout)
        self.assertFalse(self.build_log.exists())

    @unittest.skipUnless(CURL, "curl is required for native option validation")
    def test_real_curl_accepts_upload_options_without_connecting(self):
        self.add_image("public/pictures/photo.jpg")
        result = self.invoke_script("-SkipBuild -SkipUnchangedImages")
        self.assert_success(result)
        for call in self.curl_calls():
            with self.subTest(operation=call["arguments"][-1]):
                native = subprocess.run(
                    [CURL, *call["arguments"], "--version"],
                    input=call["config"],
                    capture_output=True,
                    text=True,
                    timeout=10,
                )
                self.assertEqual(native.returncode, 0, native.stderr)
                self.assertTrue(native.stdout.startswith("curl "))
                self.assertRegex(native.stdout, r"(?m)^Protocols: .*\bftp\b")
                self.assertRegex(native.stdout, r"(?m)^Protocols: .*\bftps\b")
                self.assertNotIn(self.password, native.stdout + native.stderr)

    def test_failed_build_does_not_upload_an_existing_stale_build(self):
        result = self.invoke_script("", KK67_TEST_BUILD_EXIT="1")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Frontend build failed", result.stderr)
        self.assertEqual(self.curl_calls(), [])

    def test_missing_index_prevents_upload(self):
        self.dist.joinpath("index.html").unlink()
        result = self.invoke_script()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("No frontend build found", result.stderr)
        self.assertEqual(self.curl_calls(), [])

    def test_symbolic_link_in_build_prevents_upload(self):
        try:
            self.dist.joinpath("assets", "linked-env.txt").symlink_to(
                self.frontend.joinpath(".env")
            )
        except OSError as error:
            self.skipTest(f"Cannot create symbolic links on this host: {error}")
        result = self.invoke_script()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("symbolic links or junctions", result.stderr)
        self.assertEqual(self.curl_calls(), [])

    def test_failed_login_or_destination_check_prevents_upload(self):
        result = self.invoke_script(KK67_TEST_PREFLIGHT_EXIT="67")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("FTP login or destination check failed", result.stderr)
        self.assertEqual(len(self.curl_calls()), 1)
        self.assertNotIn("Upload complete", result.stdout)
        self.assertNotIn(self.password, result.stdout + result.stderr)

    def test_failed_asset_upload_stops_before_index(self):
        result = self.invoke_script(KK67_TEST_UPLOAD_EXIT="25")
        self.assertNotEqual(result.returncode, 0)
        self.assertRegex(result.stderr, r"Deployment\s+stopped")
        calls = self.curl_calls()
        self.assertEqual(len(calls), 2)
        self.assertNotEqual(calls[-1]["arguments"][-1], DESTINATION + "index.html")
        self.assertNotIn("Upload complete", result.stdout)

    def test_parent_directory_target_is_rejected_before_build(self):
        result = self.invoke_script("-RemotePath '../wrong'")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("RemotePath must be", result.stderr)
        self.assertEqual(self.curl_calls(), [])
        self.assertFalse(self.build_log.exists())

    def test_invalid_host_is_rejected(self):
        result = self.invoke_script("-SkipBuild -FtpHost 'ftp://wrong/path'")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("FtpHost must be", result.stderr)
        self.assertEqual(self.curl_calls(), [])

    def test_remote_directory_is_trimmed_and_url_encoded(self):
        result = self.invoke_script("-SkipBuild -RemotePath ' /site name/root/ '")
        self.assert_success(result)
        self.assertEqual(
            self.curl_calls()[0]["arguments"][-1],
            "ftp://ftp.c9ry3m6by.service.one/site%20name/root/",
        )


if __name__ == "__main__":
    unittest.main()
