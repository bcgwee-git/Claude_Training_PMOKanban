# IT PMO Kanban Board

[![Deploy to GitHub Pages](https://github.com/bcgwee-git/Claude_Training_PMOKanban/actions/workflows/pages.yml/badge.svg)](https://github.com/bcgwee-git/Claude_Training_PMOKanban/actions/workflows/pages.yml)

A single-file Kanban board for an IT PMO team at a fictitious bank. It is a demo and training tool.

**Live demo:** https://bcgwee-git.github.io/Claude_Training_PMOKanban/

## Features

- Kanban columns with live task counts and a summary strip (including overdue tasks)
- Add tasks with inline validation and toast feedback
- Move tasks by drag and drop, or with the per-card Move select (keyboard friendly)
- Delete with an inline "Delete? Yes / No" confirmation
- Filter by project, assignee and priority
- Seed data with due dates relative to today, so there is always an overdue task
- Email notification when a task is added, through FormSubmit

## Run locally

Open `index.html` in a browser. There is nothing to install or build.

## Important notes

- **No persistence.** Nothing is saved. Refreshing the page resets the board to the seed data, and the UI says so.
- **Email notifications.** Set the `FORMSUBMIT_ENDPOINT` constant at the top of the script in `index.html` to your own address. It ships with the placeholder `YOUR_EMAIL@example.com`, so the notification fails and shows a warning toast. That is expected. Don't commit a real address to a public repo.
- **No real branding.** The "IT PMO" wordmark is neutral. No real bank logo or branding is used.

## Tech

Vanilla HTML, CSS and JavaScript in one file. No frameworks, build step, npm, CDN, web fonts or images. See [CLAUDE.md](CLAUDE.md) for the constraints and architecture.

## CI/CD

A GitHub Actions workflow ([.github/workflows/pages.yml](.github/workflows/pages.yml)) runs on every push to `main`. It checks the project constraints (no storage APIs, no `!important`, no `alert()`/`confirm()`, placeholder email intact), then deploys `index.html` to GitHub Pages.

## V2 (redesign)

A redesigned version lives in [v2/index.html](v2/index.html) and deploys alongside V1 at `/v2/`: https://bcgwee-git.github.io/Claude_Training_PMOKanban/v2/

V2 adds a hero with live board stats, a top 3 most-viewed YouTube videos section (thumbnails load from `i.ytimg.com`), and a top 3 stocks section. Stock prices are **sample data** until `QUOTE_ENDPOINT` in the script points to a quote service. V1 (`index.html`) is unchanged. V2 keeps the no-storage, no-`!important` rules but, by design, makes image and optional quote requests that V1 does not.

## V3 (professional redesign)

[v3/index.html](v3/index.html) deploys at `/v3/`: https://bcgwee-git.github.io/Claude_Training_PMOKanban/v3/

V3 removes the YouTube and stock sections, uses one blue hue in three tones, and adds a one-line status computed live from the tasks (On track, Needs attention or At risk). It makes no network calls other than the FormSubmit POST. V1 and V2 are unchanged.
