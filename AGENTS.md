# AGENTS.md

## Purpose

Build production-quality React web app code in JavaScript/TypeScript that is clean, secure, testable, responsive, and easy to review. Prioritize correctness, maintainability, and consistency over speed.

## Stack

- React.js
- JavaScript and TypeScript
- VS Code
- Typical tools may include npm, pnpm, Vite, ESLint, Prettier, Vitest, Jest, Playwright, Cypress

## Core rules

- Make small, focused, reviewable changes.
- Preserve the existing architecture unless the task explicitly requires structural changes.
- Match existing project conventions, patterns, and naming.
- Prefer clarity over cleverness.
- Avoid unnecessary abstraction, duplication, and dead code.
- Keep public APIs and component contracts stable unless change is requested.
- Do not add dependencies unless clearly necessary and approved.

## Code quality

- Write idiomatic, strongly typed code.
- Prefer explicit types at public boundaries.
- Avoid `any` unless clearly justified.
- Keep components and functions focused, readable, and predictable.
- Minimize hidden side effects.
- Handle edge cases explicitly.
- Keep imports tidy and remove unused code.
- Do not bypass lint, type, or test failures.
- Do not leave TODOs instead of implementing essential logic.

## Security

Treat security as part of correctness.

- Never expose secrets or tokens.
- Never edit `.env`, `.env.*`, secret stores, deployment credentials, or CI secrets unless explicitly asked.
- Never move sensitive logic from server-side to client-side.
- Validate and sanitize untrusted input.
- Avoid unsafe HTML rendering.
- Watch for XSS, CSRF, SSRF, injection, auth, authz, CORS, open redirect, and deserialization risks when relevant.
- Prefer least-privilege patterns.
- Do not add telemetry, tracking, or external network calls unless explicitly required.

## UI/UX

Treat UI quality as part of product quality.

- Build modern, polished, and visually consistent interfaces.
- Follow existing design tokens, color codes, component patterns, and visual guidelines when they exist.
- Keep spacing consistent, including margins, padding, gaps, borders, border radius, and shadows.
- Use consistent typography with appropriate font sizes and weights.
- Do not use italic text unless explicitly required by the design system or content semantics.
- Design mobile-first and keep layouts usable down to 280px viewport width.
- Prefer responsive layouts that work cleanly across small, medium, and large screens.
- Preserve visual hierarchy, readability, accessibility, and clear interaction states.
- Avoid ad-hoc styling that breaks consistency.

## Tests and validation

For every non-trivial change:

- Add or update focused tests.
- Cover happy path, important edge cases, and regressions.
- Keep tests readable and deterministic.
- Avoid brittle snapshot tests unless already standard in the repo.

A task is not complete unless the changed behavior is validated by tests or there is a clear reason why tests are not applicable.

After relevant changes, run the project-standard validation commands:

- `npm run lint`
- `tsc --noEmit`
- `npm test`

## Scope constraints

Unless explicitly requested:

- Only modify files relevant to the task.
- Do not rewrite unrelated modules.
- Do not change lockfiles or dependencies.
- Do not alter CI/CD, infra, Docker, or deployment scripts.
- Do not edit generated files directly unless the repo convention requires it.

## Working style

Before editing:

- Inspect the relevant code path and nearby tests.
- Infer conventions from existing code.
- Keep a concise plan in mind.

While editing:

- Make the smallest change that fully solves the problem.
- Prefer fixing root causes over patching symptoms.
- Maintain backward compatibility when reasonable.

Before finishing:

- Re-read the diff for simplicity and consistency.
- Ensure the code is clean, typed, secure, and tested.
- Summarize what changed, why, tests run, assumptions, and any residual risks.
