---
description: Publish this project to a GitHub repo (README, About, Pages, CI/CD, sensitive-data check)
argument-hint: <github repo URL or owner/name>
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, PowerShell
---

Publish this project to the GitHub repo given in: $ARGUMENTS

If no repo was given, ask the user for the repo URL (or `owner/name`) and stop until they answer. Normalise it to `OWNER/REPO`.

Work through the steps in order. Report each step's outcome faithfully. If a step fails, say so and do not claim success.

## 0. Preflight
- Check `git --version` and `gh --version`. If `gh` is missing, tell the user to install it (`winget install GitHub.cli`) and run `gh auth login`. Do the local steps (1-3 and 4) meanwhile, then list the remaining steps as manual follow-ups.
- Run `gh auth status`. If not logged in, ask the user to run `gh auth login`. Never ask for or handle tokens or passwords yourself.
- Check that the repo exists with `gh repo view OWNER/REPO`. If it doesn't, ask before creating it, and ask whether it should be public or private. GitHub Pages on a free account needs a public repo.

## 1. Sensitive-data check (BEFORE any push)
Do this first and block the upload until it is clean.
- List what would be uploaded: `git ls-files` plus untracked files not ignored (`git status --short`).
- Grep tracked and untracked files for secrets: API keys, tokens, passwords, private keys (`BEGIN .* PRIVATE KEY`), `.env` files, `credentials`, `secret`, `token`, `api[_-]?key`, AWS keys (`AKIA[0-9A-Z]{16}`), and personal emails or phone numbers.
- Check git history too: `git log -p` for the same patterns, and `git log --format='%ae' | sort -u` for personal commit emails.
- Never upload `.claude/settings.local.json`, `.env*`, `*.pem`, `*.key`, or editor/OS junk. Add them to `.gitignore` (create it if needed).
- Project rule from CLAUDE.md: the real notification email must not appear anywhere. `FORMSUBMIT_ENDPOINT` must keep the placeholder `YOUR_EMAIL@example.com`. Run the CLAUDE.md constraint grep (`localStorage|sessionStorage|indexedDB|cookie|!important|alert\(|confirm\(|http`). Only the formsubmit.co URL may match in code.
- If anything sensitive is found, STOP. Show the file and line (mask the value) and ask the user how to proceed. If it is already in history, tell them it needs rewriting and the secret must be rotated. Do not force-push or rewrite history without explicit approval.
- Report the result as a short pass/fail list.

## 2. README
- Create or update `README.md`. Read the existing one, `index.html` and `CLAUDE.md` first, and preserve what is accurate.
- Include: title and one-line description, live demo link (the Pages URL from step 5), features, how to run locally (open `index.html`), the no-persistence note, how to set `FORMSUBMIT_ENDPOINT`, tech notes (single file, vanilla JS, no build), the CI/CD badge, and a note that this is a demo/training tool with no real bank branding.
- Don't put any real email or secret in it.

## 3. Commit and push
- Make sure the branch is `main`. Set the remote: `git remote add origin https://github.com/OWNER/REPO.git`, or `set-url` if it exists.
- Stage specific files (reviewed in step 1), then commit with a clear message ending with the attribution line from the session's git instructions.
- `git push -u origin main`. Never force-push unless the user explicitly asks. If the remote has unrelated history, report it and ask.

## 4. CI/CD via GitHub Actions
Create `.github/workflows/pages.yml` (update any existing workflow instead of duplicating). On push to `main` and on `workflow_dispatch` it should:
1. Check out the code.
2. Run a validation job. This project has no build or tests, so: fail if `index.html` is missing, fail if the constraint grep finds `localStorage|sessionStorage|indexedDB|!important|alert\(|confirm\(`, and fail if `FORMSUBMIT_ENDPOINT` is anything other than the placeholder.
3. Deploy with `actions/configure-pages`, `actions/upload-pages-artifact` (stage only `index.html` into a folder so `.git` and `.claude` are not published), and `actions/deploy-pages`.
- Permissions: `contents: read`, `pages: write`, `id-token: write`. Add a `concurrency` group named `pages`. Pin actions to current major tags.
- Commit and push the workflow.

## 5. GitHub Pages
- Enable Pages with the Actions source: `gh api -X POST repos/OWNER/REPO/pages -f build_type=workflow` (if it already exists, use `-X PUT`).
- Wait for the workflow run (`gh run watch`, or `gh run list --limit 1`) and confirm it succeeded. If it failed, show `gh run view --log-failed` and fix it.
- Get the URL: `gh api repos/OWNER/REPO/pages --jq .html_url`. Check it responds with HTTP 200.

## 6. Repo About
- Set the description, homepage and topics: `gh repo edit OWNER/REPO --description "..." --homepage "<pages url>" --add-topic kanban --add-topic pmo --add-topic vanilla-js --add-topic github-pages`.
- The description should be one short sentence, e.g. "IT PMO Kanban board demo for a fictitious bank. Single-file vanilla HTML/CSS/JS."
- The homepage field is the GitHub Pages link. Make sure the README links to it too.

## 7. Final report
Give the user a short summary:
- Repo URL and Pages URL
- Sensitive-data check result
- Files created or changed, and the commit hash
- CI/CD status
- Anything left for them to do manually
