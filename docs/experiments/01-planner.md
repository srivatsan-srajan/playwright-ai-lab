# Experiment 1 — Planner

## Why?

Evaluate how effectively Playwright's Planner agent can explore an unfamiliar
application and derive a comprehensive end-to-end test plan.

## What did we ask?

> Explore the Spring PetClinic application running at http://localhost:8080.
>
> Identify the key use cases and user scenarios supported by the application,
> and prepare a comprehensive end-to-end test plan covering those scenarios.

## What did it produce?

[PetClinic E2E Test Plan](../../specs/petclinic-e2e-test-plan.md)

The Planner produced a detailed E2E plan covering:

- Global navigation and read-only views
- Owner search and profiles
- Owner and pet management
- Visit recording
- Validation and robustness

## What did it miss?

- **Navigation menu titles:** The plan verifies navigation to the expected
  routes but does not verify the actual titles/text of the menu entries.
- **Navigation hover behavior:** The plan does not cover the visual state
  change when hovering over a menu item.
- **Individual owner selection:** The owner-search flow opens a representative
  owner profile but does not independently verify clicking individual owner
  links and opening the corresponding profile.

## What did we learn?

- The Planner was effective at discovering the major functional workflows and
  business scenarios in PetClinic.
- It produced a detailed and structured E2E plan with meaningful expected
  outcomes across navigation, CRUD, validation, pagination, and error handling.
- The gaps were primarily around lower-level UI interactions and separating
  individual interactions into distinct scenarios.
- AI-generated test plans can provide strong initial coverage, but human QA
  review remains important for UI details, scenario boundaries, and completeness.