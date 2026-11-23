
import json
import sys
from pathlib import Path

from deepeval.test_case import LLMTestCase

# Resolve project directories
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEEPEVAL_DIR = PROJECT_ROOT / "deepeval"

# Add deepeval directory to Python import path
sys.path.insert(0, str(DEEPEVAL_DIR))

# Project imports
from evaluation.acceptance_gate import evaluate_acceptance
from custom_metrics.scenario_coverage import (
    create_scenario_coverage_metric,
)
from custom_metrics.assertion_quality import (
    create_assertion_quality_metric,
)


def load_dataset():
    dataset_path = (
        DEEPEVAL_DIR / "datasets" / "playwright_test_cases.json"
    )

    with dataset_path.open("r", encoding="utf-8") as file:
        return json.load(file)


def evaluate_case(case):
    source_path = PROJECT_ROOT / case["source_file"]

    if not source_path.exists():
        raise FileNotFoundError(
            f"Test source not found: {source_path}"
        )

    actual_output = source_path.read_text(encoding="utf-8")

    expected_output = "\n".join(
        f"- {behaviour}"
        for behaviour in case["expected_behaviour"]
    )

    test_case = LLMTestCase(
        input=(
            f"Requirement {case['requirement_id']}: "
            f"{case['requirement']}"
        ),
        actual_output=actual_output,
        expected_output=expected_output,
    )

    # Build a separate evaluation context for assertion quality.
    coverage_records = case["human_review"]["behaviour_coverage"]

    covered_behaviour_ids = {
        record["behaviour_id"]
        for record in coverage_records
        if record["status"] == "covered"
    }

    implemented_behaviours = [
        behaviour["description"]
        for behaviour in case["expected_behaviour"]
        if behaviour["id"] in covered_behaviour_ids
    ]

    assertion_test_case = LLMTestCase(
        input=(
            f"Requirement {case['requirement_id']}: "
            f"{case['requirement']}"
        ),
        actual_output=actual_output,
        expected_output="\n".join(
            f"- {behaviour}"
            for behaviour in implemented_behaviours
        ),
    )


    scenario_metric = create_scenario_coverage_metric()
    scenario_metric.measure(test_case)

    assertion_metric = create_assertion_quality_metric()
    assertion_metric.measure(assertion_test_case)

    acceptance = evaluate_acceptance(case)

    print(f"\nCase ID: {case['case_id']}")
    print(f"Test: {case['test_name']}")

    print("\n--- GEval: Scenario Coverage ---")
    print(f"Score: {scenario_metric.score:.2f}")
    print(f"Threshold: {scenario_metric.threshold}")
    print(f"GEval Passed: {scenario_metric.is_successful()}")
    print(f"Reason: {scenario_metric.reason}")

    print("\n--- Mandatory Behaviour Gate ---")
    print(f"Mandatory behaviours: {acceptance['mandatory_count']}")
    print(f"Covered behaviours: {acceptance['covered_count']}")
    print(f"Missing behaviours: {acceptance['missing_behaviours']}")
    print(f"Acceptance Gate: {'PASS' if acceptance['passed'] else 'FAIL'}")

    overall_passed = (
        scenario_metric.is_successful()
        and assertion_metric.is_successful() 
        and acceptance["passed"]
        )

    print("\n--- Overall Evaluation ---")
    print(f"Overall Result: {'PASS' if overall_passed else 'FAIL'}")
    
    print("\n--- GEval: Assertion Quality ---")
    print(f"Score: {assertion_metric.score:.2f}")
    print(f"Threshold: {assertion_metric.threshold}")
    print(f"GEval Passed: {assertion_metric.is_successful()}")
    print(f"Reason: {assertion_metric.reason}")


def main():
    dataset = load_dataset()

    for case in dataset:
        evaluate_case(case)


if __name__ == "__main__":
    main()
