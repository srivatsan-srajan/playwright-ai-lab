# Experiment 4 — Repeatability

## Objective

Evaluate whether the existing Playwright test suite produces consistent results when executed repeatedly against the same Spring PetClinic instance.

## Environment

- Date: 2026-11-11
- Application: Spring PetClinic 4.1.0
- Playwright: 1.62.1
- Browser: Chromium
- Workers: 5
- Test suite: 24 tests across 15 files

## Execution

Command:

```bash
npx playwright test --project=chromium --repeat-each=3
```

## Results

| Metric | Result |
|---|---:|
| Tests per execution | 24 |
| Repetitions | 3 |
| Total test executions | 72 |
| Passed | 72 |
| Failed | 0 |
| Skipped | 0 |
| Total duration | 11.8 seconds |

## Observations

- All 24 tests passed across three consecutive repetitions.
- No intermittent failures were observed during this experiment.
- The suite completed successfully using five parallel workers.
- Existing tests use a mixture of timestamp-generated records and shared demonstration data.
- Some tests modify existing PetClinic records.
- No explicit test-data cleanup or application-state reset mechanism was identified.

## Limitations

- Three repetitions do not establish long-term reliability.
- The experiment does not prove that tests are independently executable.
- Shared application data may introduce order-dependent behaviour or side effects.
- Only Chromium was evaluated.
- CI execution and reproducibility have not yet been validated.

## Conclusion

The current suite demonstrated short-run repeatability, with 72 successful executions and no observed failures.

However, test-data isolation and independence remain unresolved. Further work is required before treating the suite as deterministic or production-ready.