# Forma · Recruitment demo workspace

A responsive recruitment dashboard built with React, TypeScript and Vite. Overview metrics and pipeline counts come from the same candidate records as the directory. Search, role/status filters, sorting and pagination are preserved in the URL. Candidate intake, editing, shortlisting, rejection and reopening work entirely in this browser.

**Demo only. Use fictional information. No application reaches an employer.** There is no backend, account, authentication, email delivery, AI ranking or remote API connection.

## Local setup

Use Node.js 22.12+ and npm 10+.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To inspect a production build locally:

```sh
npm run build
npm run preview
```

## Validation

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium --only-shell
npm run test:e2e
```

Playwright uses an isolated headless browser and a loopback server, not your personal browser profile. To use a separately downloaded test browser, set `PLAYWRIGHT_BROWSERS_PATH`; optionally set `CHROMIUM_PATH` to its executable. Tests cover form validation, combined filtering, sorting, status transitions, persistence validation/recovery, full intake-to-reload flow, editing, reset confirmation, save failure, keyboard focus containment/restoration, legacy redirects and mobile overflow. The full workflow also asserts that no external requests occur. CI performs a clean install, lint, typecheck, unit tests, build and Chromium end-to-end tests, uploading screenshots and failure traces. CI has been configured, but no remote run is claimed until this branch is pushed.

## Architecture

- `src/features/candidates/model.ts`: Zod runtime schemas, domain types, status transitions and pure filter/sort helpers.
- `src/features/candidates/repository.ts`: typed repository boundary, deterministic fixtures and versioned browser storage. Replacing this adapter is the integration seam for a future approved backend.
- `src/features/candidates/CandidateList.tsx`: the single reusable searchable/filterable/paginated directory.
- `src/features/candidates/CandidateForm.tsx`: shared validated create/edit form.
- `src/components/Modal.tsx`: native modal dialog with Escape, focus containment and focus restoration.
- `src/App.tsx`: workspace navigation, overview, intake and mutation orchestration. Mutations update React state only after a successful storage write; pending buttons and inline success/errors make the outcome explicit.
- `src/styles.css`: responsive visual system with local system typography, no font/CDN dependencies.

Sixteen deterministic fictional records use reserved `example.com` email addresses. The overview counts are computed, not hard-coded metrics. Dates display in UTC. New records use the actual local creation time, and identities use browser-generated UUIDs.

## Persistence and limitations

Storage key: `forma.candidates.v1`, envelope `{ version: 1, candidates: [...] }`. All records are validated on load and save, including duplicate IDs. Missing storage starts with fixtures. Malformed data, unsupported versions or denied reads show a recovery warning and temporary fixtures; writes stay blocked until the user confirms reset. Reset replaces saved records only after a successful write. Storage failures never report success or silently change the displayed records.

Local storage is unencrypted, origin-specific, limited by browser quota and removable by browser settings. This is a single-tab demo; concurrent tabs do not synchronize and the last successful writer wins. Clearing browser storage removes local changes. A future version must explicitly migrate its envelope rather than reinterpret unsupported data. There is no server authorization, multi-user concurrency, audit log, delivery service or production data protection. No production-readiness or legacy-service availability claim is made.

## Migration from CRA

Baseline: `bcc63ca40e4b7a60f99197b263e736cd15aefea0` on `master`.

CRA 4 / React 17 / Router 5 / Axios / Bootstrap CDN were replaced with Vite, React 19, TypeScript and current compatible Router dependencies. The legacy render-time fetches, duplicate role tables and stale mutation/details state were removed. Root `index.html` is now Vite's entry. Build output changes from `build/` to `dist/`; development changes from `npm start` to `npm run dev`. Future public build variables use `import.meta.env.VITE_*`, rather than `process.env.REACT_APP_*`. Never place secrets in either client environment format. No environment variables are required today.

Routes: `/home` redirects to `/`, `/register` to `/intake`, and `/dashboard/*` to `/candidates`, preserving known role links (`frontend`, `nodejs`, `meanstack`, `fullstack`) as role filters. Other unknown routes redirect to overview. The future hosting configuration must serve `index.html` for non-asset application paths so deep links work. This task does not alter hosting settings or deploy.

The former HTTP Heroku API is disabled: there is no client or automatic request. Source-derived contracts, for migration planning only:

| Method | Path                                 | Payload                                          |
| ------ | ------------------------------------ | ------------------------------------------------ |
| GET    | `/users/application-forms`           | none                                             |
| GET    | `/users/application-form/:id`        | none                                             |
| POST   | `/users/application-form`            | name, email, phone, skills, jobTitle, experience |
| PUT    | `/users/application-form/update/:id` | status                                           |

Legacy record fields: `_id`, name, email, phone, skills, jobTitle, experience, createdAt, status. Domain IDs now use `id`; a future adapter must explicitly map `_id`, validate data, normalize experience/dates, and handle server errors. Status values remain `applied`, `shortlisted`, `rejected` (`applied` is displayed as “In review”). There were no demonstrated server edit, delete or login endpoints; local profile editing is a demo feature, not a claim about remote support. A real integration needs a separately designed and approved HTTPS backend, authorization, data governance and tests.

## Screenshots

Generated by the isolated browser suite into `artifacts/`:

- [Desktop overview](artifacts/overview-desktop.png)
- [Desktop intake](artifacts/intake-desktop.png)
- [Candidate details](artifacts/candidate-detail.png)
- [Mobile overview](artifacts/overview-mobile.png)
- [Mobile intake](artifacts/intake-mobile.png)

This rebuild is proposed for review only. It does not merge into the default branch or configure a deployment. The review commit and draft PR title use `[skip netlify]` to suppress Netlify branch and preview deploys while GitHub Actions validates the changes. Existing unrelated repository metadata is preserved.
