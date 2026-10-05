# Experiment 3 — Healer

## Why?

Measure how effectively Playwright's Healer agent can debug and recover from
real test failures against a live application.

The generated tests were a good start, but they were not guaranteed to match the
actual runtime behavior of PetClinic. This experiment was meant to answer a
practical question: if the generated suite fails against the real app, can the
healer reliably identify the root cause and bring the tests back into a working
state?

## What did we ask?

> Run the generated Playwright suite against the Spring PetClinic app and fix any
> failing tests until the assertions reflect the real behavior of the application.
>
> Focus on selectors, validation behavior, redirect handling, and live DOM
> differences rather than on changing the intent of the tests.

## What did it produce?

The Healer process produced a corrected version of the generated suite, with a
number of targeted fixes across the PetClinic specs. The main corrections were:

- Accepting redirect URLs with the session ID suffix
- Tightening validation selectors to match the actual field-level error blocks
- Replacing malformed date inputs with valid dates that reflect the app's real
  HTML date validation rules
- Updating the expected page element for "Previous Visits" to match the real DOM
- Preserving the original scenario intent while adjusting to the app's actual
  runtime behavior

The result was a suite that matched the real application behavior much more
closely and passed when re-run in Chromium.

## What did it miss?

The healer did not miss the core requirements of the tests; instead, it exposed
some of the assumptions that the generator had made too early.

The most important examples were:

- The app does not always redirect to a clean /owners/1 URL.
- Several validation errors are rendered as separate sibling blocks instead of
  one single error container.
- The browser rejects impossible date strings before submission, so a test must
  use a valid date string if it wants to test the app's validation rules.
- The visit page renders the visit history as plain text rather than as a
  heading element.

This is a reminder that real UI behavior is often more nuanced than a plan or a
starter generator can capture.

## What did we learn?

- The Healer agent is effective at narrowing failures to the actual root cause.
- It works best when the test intent is valid and the failure is caused by a
  mismatched assumption about the DOM or redirect behavior.
- It is especially useful for cleaning up generated tests that are conceptually
  correct but not yet aligned with the app's real runtime semantics.
- The combination of Generator + Healer is much stronger than either one alone:
  the generator creates the initial suite quickly, and the healer turns it into a
  reliable suite against a live system.

In practice, the Healer was not inventing a different test strategy; it was
repairing the gap between the intended test and the observed behavior of the
application. That makes it a very valuable step in an AI-assisted QA workflow.
