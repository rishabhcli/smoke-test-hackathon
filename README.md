# Smoke Test Hackathon

Minimal static web app scaffold for this workspace.

## What was built
- `app/index.html` contains a one-page landing screen for the hackathon workspace.
- `scripts/server.mjs` serves the app locally using only Node built-ins.
- `tests/smoke.test.mjs` and `scripts/verify.mjs` provide a local smoke path without extra infrastructure.

## Local usage
- `npm run serve` starts a local server on `http://127.0.0.1:4173`
- `npm test` runs the smoke tests
- `npm run verify` checks that the file exists and that the page serves successfully
