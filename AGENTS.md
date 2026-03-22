# AGENTS.md

## Purpose

Produce production-quality TypeScript/JavaScript code that is clean, minimal, testable, secure, and easy to review.
Prioritize correctness, maintainability, and explicit reasoning over speed.

## Stack assumptions

- TypeScript and/or JavaScript
- VS Code
- Modern web app architecture
- Typical tools may include npm, pnpm, Vite, Angular, React, Svelte, ESLint, Prettier, Vitest, Jest, Playwright, Cypress

## Core principles

- Prefer small, reviewable changes over broad refactors.
- Preserve existing architecture unless the task explicitly asks for structural changes.
- Do not reduce code quality to satisfy speed.
- Favor clarity over cleverness.
- Keep public APIs and component contracts stable unless change is requested.
- Avoid unnecessary abstraction.
- Eliminate dead code when safe to do so.

## Code quality standards

- Write idiomatic, strongly typed code.
- Prefer explicit types at public boundaries.
- Avoid `any` unless there is a clear justification.
- Avoid type assertions when a safer type design is possible.
- Keep functions focused and short.
- Use descriptive names.
- Minimize hidden side effects.
- Handle edge cases explicitly.
- Keep imports tidy and remove unused code.
- Match the repository’s existing style and conventions.

## Clean code requirements

- Reduce duplication where it improves readability.
- Do not introduce speculative abstractions.
- Do not add dependencies unless clearly necessary.
- Do not silently bypass lint, type, or test failures.
- Do not leave TODOs as a substitute for completing essential logic.
- Do not disable rules without explaining why in code comments.

## UI/UX principles

Treat UI quality as part of product quality.

- Build modern, polished, and visually consistent interfaces.
- Follow existing design tokens, color codes, component patterns, and visual guidelines when they already exist in the project.
- Keep spacing consistent across the UI, including margins, padding, gaps, borders, border radius, and shadows.
- Use consistent typography with appropriate font sizes and weights.
- Do not use italic text unless it is explicitly required by the existing design system or content semantics.
- Design mobile-first and ensure layouts remain usable down to a minimum viewport width of 280px.
- Prefer responsive layouts that adapt cleanly across small, medium, and large screens.
- Preserve visual hierarchy, readability, accessibility, and clear interaction states.
- Avoid ad-hoc styling that breaks consistency with the rest of the application.

## Testing requirements

For every non-trivial change:

1. Add or update tests.
2. Prefer the smallest test set that proves correctness.
3. Cover happy path, important edge cases, and regressions.
4. Keep tests readable and deterministic.
5. Avoid brittle snapshot tests unless already standard in the repo.

A task is not complete unless the changed behavior is validated by tests or there is a clear, explicit reason why tests are not applicable.

## Validation commands

After relevant code changes, run the applicable validation commands from this repository:

- `npm run lint`
- `tsc --noEmit`
- `npm test`

If the repository uses alternatives, use the project-standard equivalents.

## Security requirements

Treat security as part of correctness.

- Never expose secrets or tokens.
- Never edit `.env`, `.env.*`, secret stores, deployment credentials, or CI secrets unless explicitly asked.
- Never move sensitive logic from server-side to client-side.
- Validate and sanitize untrusted input.
- Avoid unsafe HTML rendering.
- Flag possible XSS, CSRF, SSRF, injection, auth, authz, CORS, redirect, and deserialization issues when touched by the task.
- Prefer least-privilege patterns.
- Do not add telemetry, tracking, or external network calls unless explicitly required.

## File and scope constraints

Unless explicitly requested:

- Only modify files relevant to the task.
- Do not rewrite unrelated modules.
- Do not change lockfiles or dependencies without approval.
- Do not alter CI/CD, infra, Docker, or deployment scripts without approval.
- Do not edit generated files directly unless the repo convention requires it.

## Working style

Before editing:

- Inspect the relevant local code path and nearby tests.
- Infer the project’s conventions from existing code.
- Keep a concise plan in mind.

While editing:

- Make the smallest change that fully solves the problem.
- Prefer fixing root causes over patching symptoms.
- Maintain backward compatibility when reasonable.

Before finishing:

- Re-read the diff for simplicity and consistency.
- Ensure the code is clean, typed, and tested.
- Summarize what changed, why, and any residual risks or follow-ups.

## Response expectations

When reporting back:

- State exactly what was changed.
- Mention tests run and their outcome.
- Mention any assumptions.
- Mention any issues that need human review.
