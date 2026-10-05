# Experiment 2 — Generator

## Why?

Evaluate how well Playwright's Generator agent can turn a structured end-to-end
plan into executable browser tests for a real application.

The goal here was not just to see whether the agent could produce code, but to
see how closely that generated code matched the real behavior of the application
and how much cleanup was still needed before it could be trusted.

## What did we ask?

> Use the PetClinic end-to-end plan as the source of truth and generate
> Playwright tests for the scenarios it defines.
>
> Target the Spring PetClinic app running at http://localhost:8080 and create
> the test files needed to cover navigation, owner search, pet and owner CRUD,
> validation, visit flows, and error handling.

## What did it produce?

The Generator produced a full set of Playwright specs under the PetClinic test
folder, including:

- [tests/petclinic/global-navigation.spec.ts](../../tests/petclinic/global-navigation.spec.ts)
- [tests/petclinic/veterinarians.spec.ts](../../tests/petclinic/veterinarians.spec.ts)
- [tests/petclinic/owner-search.spec.ts](../../tests/petclinic/owner-search.spec.ts)
- [tests/petclinic/owner-search-boundaries.spec.ts](../../tests/petclinic/owner-search-boundaries.spec.ts)
- [tests/petclinic/owner-pagination.spec.ts](../../tests/petclinic/owner-pagination.spec.ts)
- [tests/petclinic/create-owner.spec.ts](../../tests/petclinic/create-owner.spec.ts)
- [tests/petclinic/edit-owner.spec.ts](../../tests/petclinic/edit-owner.spec.ts)
- [tests/petclinic/pet-management.spec.ts](../../tests/petclinic/pet-management.spec.ts)
- [tests/petclinic/create-visit.spec.ts](../../tests/petclinic/create-visit.spec.ts)
- [tests/petclinic/visit-validation.spec.ts](../../tests/petclinic/visit-validation.spec.ts)
- [tests/petclinic/owner-validation.spec.ts](../../tests/petclinic/owner-validation.spec.ts)
- [tests/petclinic/pet-validation.spec.ts](../../tests/petclinic/pet-validation.spec.ts)
- [tests/petclinic/route-robustness.spec.ts](../../tests/petclinic/route-robustness.spec.ts)
- [tests/petclinic/error-page.spec.ts](../../tests/petclinic/error-page.spec.ts)

This was a strong result. The agent took the plan and converted it into a
real test suite with the right organization, naming, and coverage pattern. It
covered the major flows described in the plan and used the application's actual
UI structure as the base for the generated assertions.

## What did it miss?

The generator was generally solid, but it did not always match the subtle
behavior of the app exactly.

- Redirects include the servlet session ID suffix, so a URL like
  /owners/1 may appear as /owners/1;jsessionid=... after a successful post.
- Validation errors are field-oriented and can appear as multiple independent
  error blocks rather than a single uniform error box.
- The visit and pet forms enforce browser/HTML constraints before the app even
  reaches server-side validation.
- Some UI labels are plain text instead of heading elements, so a locator that
  assumes a heading tag can fail despite the content being present.

These are not structural problems in the test approach; they are normal
implementation details that a generator will miss if it is working from a
conceptual plan rather than the live DOM.

## What did we learn?

- The Generator agent is very effective at producing the first version of a
  meaningful Playwright suite from a plan.
- It understands the test structure, the expected business flows, and the right
  place to put assertions.
- It is less reliable when it comes to the fine-grained behavior of the live
  app: redirects, validation markup, and DOM-specific details.
- In other words, the Generator is a strong starting point, but it still needs
  a validation pass before the tests can be considered production-quality.

This was a useful outcome. It showed that the planner-to-generator flow can get
most of the way to a real working suite quickly, which is exactly the kind of
acceleration we want from AI-assisted testing.
