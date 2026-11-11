# Initial Project Baseline

**Date:** 11 November 2026

## 1. System Under Test

- **Application:** Spring PetClinic
- **Repository:** https://github.com/spring-projects/spring-petclinic
- **Branch:** `main`
- **Version:** 4.1.0
- **Baseline commit:** `500158f732419217507c7656904b8e6aa1bcc0d6`

PetClinic is maintained as an independent Git repository inside the project workspace. Its source code is excluded from the parent repository through `.gitignore`.

No modifications have been made to the PetClinic application.

## 2. Automation Environment

| Component | Version / Configuration |
|---|---|
| Node.js | 25.2.1 |
| npm | 11.6.2 |
| Playwright | 1.62.1 |
| Browser | Chromium |
| Test framework | Playwright Test |
| Base URL | http://localhost:8080 |
| Parallel workers | 5 |

## 3. Existing Test Inventory

- Total tests: 24
- Test files: 15
- PetClinic functional and robustness tests: 23
- Seed test: 1

Coverage areas:

- Owner creation and editing
- Pet management
- Visit recording
- Owner search and pagination
- Field validation
- Application navigation
- Veterinarian directory
- Route robustness and error handling

## 4. Initial Regression Results

| Metric | Result |
|---|---:|
| Tests executed | 24 |
| Passed | 24 |
| Failed | 0 |
| Skipped | 0 |
| Execution time | 6.1 seconds |

Application availability was verified using an HTTP HEAD request to `http://localhost:8080`, which returned HTTP 200.

## 5. AI Experiment Infrastructure

Existing components:

- Playwright Test Planner agent
- Playwright Test Generator agent
- Playwright Test Healer agent
- Planner, Generator and Healer experiment documentation
- Experiment transcripts
- Existing end-to-end test plan

## 6. Baseline Limitations

- Regression execution has been validated only in Chromium.
- Firefox and WebKit execution remain to be validated.
- CI reproducibility has not yet been established.
- AI-generated test quality has not yet been evaluated through a validated DeepEval pipeline.
- The baseline represents the current local execution environment.

## 7. Reproducibility

The PetClinic commit hash and automation environment are recorded above to provide a reproducible starting point for subsequent experiments.