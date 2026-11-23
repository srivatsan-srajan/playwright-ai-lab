
import copy
import json
import sys
from pathlib import Path

import pytest

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEEPEVAL_DIR = PROJECT_ROOT / "deepeval"

sys.path.insert(0, str(DEEPEVAL_DIR))

from evaluation.acceptance_gate import evaluate_acceptance


@pytest.fixture
def test_case():
    dataset_path = (
        DEEPEVAL_DIR / "datasets" / "playwright_test_cases.json"
    )

    with dataset_path.open(encoding="utf-8") as file:
        return json.load(file)[0]


def test_rejects_missing_mandatory_behaviour(test_case):
    result = evaluate_acceptance(test_case)

    assert result["passed"] is False
    assert result["missing_behaviours"] == ["EB-07"]


def test_accepts_complete_mandatory_coverage(test_case):
    case = copy.deepcopy(test_case)

    for record in case["human_review"]["behaviour_coverage"]:
        record["status"] = "covered"

    result = evaluate_acceptance(case)

    assert result["passed"] is True
    assert result["covered_count"] == 7


def test_rejects_missing_assessment(test_case):
    case = copy.deepcopy(test_case)
    case["human_review"]["behaviour_coverage"].pop()

    result = evaluate_acceptance(case)

    assert result["passed"] is False
    assert "EB-07" in result["missing_assessments"]


def test_rejects_duplicate_coverage_records(test_case):
    case = copy.deepcopy(test_case)
    records = case["human_review"]["behaviour_coverage"]
    records.append(copy.deepcopy(records[0]))

    result = evaluate_acceptance(case)

    assert result["passed"] is False
    assert any("Duplicate coverage" in error for error in result["errors"])


def test_rejects_unknown_behaviour_id(test_case):
    case = copy.deepcopy(test_case)
    records = case["human_review"]["behaviour_coverage"]
    records.append({
        "behaviour_id": "EB-99",
        "status": "covered",
        "evidence": "Unknown behaviour"
    })

    result = evaluate_acceptance(case)

    assert result["passed"] is False
    assert any("Unknown behaviour IDs" in error for error in result["errors"])


def test_rejects_invalid_status(test_case):
    case = copy.deepcopy(test_case)
    case["human_review"]["behaviour_coverage"][0]["status"] = "partially_covered"

    result = evaluate_acceptance(case)

    assert result["passed"] is False
    assert any("Invalid status" in error for error in result["errors"])


def test_rejects_duplicate_expected_behaviour_ids(test_case):
    case = copy.deepcopy(test_case)
    case["expected_behaviour"][1]["id"] = "EB-01"

    result = evaluate_acceptance(case)

    assert result["passed"] is False
    assert any("Duplicate expected" in error for error in result["errors"])

def test_rejects_empty_expected_behaviours(test_case):
    case = copy.deepcopy(test_case)
    case["expected_behaviour"] = []

    result = evaluate_acceptance(case)

    assert result["passed"] is False
    assert "No expected behaviours defined." in result["errors"]
