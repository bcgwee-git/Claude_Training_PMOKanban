# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single-file IT PMO Kanban board for a fictitious bank (demo/training tool). The whole app is [index.html](index.html): inline `<style>` and `<script>`, vanilla HTML/CSS/JS. There is no build, lint, test or package manager. To run it, open the file in a browser (`Start-Process index.html` on Windows). Reload to pick up edits.

## Hard constraints (from the original spec)

- No frameworks, build step, npm, CDN, web fonts or images. Use the system font stack and inline glyphs.
- No persistence APIs (localStorage, sessionStorage, IndexedDB, cookies). A refresh resets the board to seed data, and the UI says so.
- No `!important`, `alert()` or `confirm()`. Use inline validation, inline "Delete? Yes / No" and toasts.
- The only network call is the FormSubmit AJAX POST in `notifyNewTask`. The endpoint is the `FORMSUBMIT_ENDPOINT` constant at the top of the script (placeholder `YOUR_EMAIL@example.com`). The email must appear nowhere else. With the placeholder, the call fails and shows the "email notification failed" warning toast, which is expected.
- Neutral "IT PMO" wordmark and blue palette. No real bank logo or branding.

After editing, re-check the constraints with a grep for `localStorage|sessionStorage|indexedDB|cookie|!important|alert\(|confirm\(|http`. Only the formsubmit.co URL should match.

## Architecture

- `state` (`tasks` plus `filters`) is the single source of truth. Transient UI state (open delete confirmation, open modal) lives in the separate `ui` object.
- Every mutation (`addTask`, `moveTask`, `deleteTask`, filter change) updates state and then calls `renderBoard()`. Card HTML is built only in `renderCard()`, and `renderBoard()` also refreshes column counts and the summary strip. Don't patch the DOM directly.
- All user-supplied text must go through `escapeHtml()` in templates. Toasts use `textContent`.
- The board uses event delegation, with `data-action` attributes on the card controls (move `<select>`, delete, confirm). Drag and drop is native HTML5 (`dragstart`/`dragover`/`dragleave`/`drop`/`dragend`), and columns get the `.col-over` highlight. The keyboard fallback is the per-card Move select.
- Add Task flow: `validateForm` shows inline errors. On success the task is added optimistically and a success toast shows. The submit button is then disabled as "Sending…" while `notifyNewTask` runs inside try/catch, and a failure only produces a warning toast.
- Task IDs are `UOB-ITPM-####` from a counter. Seed due dates are computed relative to today so there is always an overdue task.
- Section banners (`/* ===== ... ===== */`) divide both the CSS and the JS. Keep new code under the matching banner.

## CSS gotcha

Classes that set `display` (e.g. `.overlay { display:flex }`) override the `hidden` attribute because they have equal specificity and come later. Add an explicit `.x[hidden] { display: none; }` rule, as `.overlay[hidden]` does. Don't use `!important`.

## Chatbot widget

- Bottom-right "IT Assistant" avatar (inline SVG, `AVATAR_SVG`) opens a text chat. State lives in the `chat` object; `renderChat()` rebuilds the messages and panel state.
- It is a client-side RAG: `retrieve()` runs BM25 over `helpDocs()` (static articles) plus `liveDocs()` (regenerated from `state.tasks` on every question), and `answerQuestion()` composes the reply from the top passages and lists its sources. No network call.
- Clicking the launcher speaks the greeting with the browser `speechSynthesis` API (the 🔊 header button mutes it). New help topics go in `helpDocs()`.

## Hooks

`.claude/settings.json` registers `.claude/hooks/check-constraints.ps1` (PostToolUse on Edit/Write). It re-runs the constraint grep on `index.html` and exits 2 with the offending lines if a hard constraint is broken.
