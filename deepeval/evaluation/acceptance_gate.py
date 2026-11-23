
def evaluate_acceptance(case: dict) -> dict:
    """
    Validate behaviour coverage and evaluate mandatory requirements.

    Acceptance is granted only when:
    1. Expected behaviour IDs are valid and unique.
    2. Coverage records contain valid, unique behaviour IDs.
    3. All mandatory behaviours have a valid coverage assessment.
    4. Every mandatory behaviour is marked as covered.
    """

    errors = []

    expected_behaviours = case.get("expected_behaviour", [])
    if not expected_behaviours:
        return {
        "passed": False,
        "mandatory_count": 0,
        "covered_count": 0,
        "missing_behaviours": [],
        "missing_assessments": [],
        "errors": ["No expected behaviours defined."],
    }
    coverage_records = case.get(
        "human_review", {}
    ).get("behaviour_coverage", [])

    # Validate expected behaviours.
    expected_ids = [
        behaviour.get("id")
        for behaviour in expected_behaviours
    ]

    if not all(expected_ids):
        errors.append("Expected behaviour contains a missing ID.")

    if len(expected_ids) != len(set(expected_ids)):
        errors.append("Duplicate expected behaviour IDs found.")

    valid_priorities = {"mandatory", "optional"}

    for behaviour in expected_behaviours:
        if behaviour.get("priority") not in valid_priorities:
            errors.append(
                f"Invalid priority for behaviour: "
                f"{behaviour.get('id')}"
            )

    expected_id_set = set(expected_ids)

    # Validate coverage records.
    coverage_ids = [
        record.get("behaviour_id")
        for record in coverage_records
    ]

    if len(coverage_ids) != len(set(coverage_ids)):
        errors.append("Duplicate coverage records found.")

    unknown_ids = set(coverage_ids) - expected_id_set

    if unknown_ids:
        errors.append(
            f"Unknown behaviour IDs: {sorted(unknown_ids)}"
        )

    valid_statuses = {"covered", "not_covered"}

    for record in coverage_records:
        if record.get("status") not in valid_statuses:
            errors.append(
                f"Invalid status for behaviour: "
                f"{record.get('behaviour_id')}"
            )

    # Calculate mandatory coverage.
    mandatory_ids = {
        behaviour["id"]
        for behaviour in expected_behaviours
        if behaviour.get("priority") == "mandatory"
        and behaviour.get("id")
    }

    valid_covered_ids = {
        record["behaviour_id"]
        for record in coverage_records
        if record.get("status") == "covered"
        and record.get("behaviour_id") in expected_id_set
    }

    missing_assessments = mandatory_ids - set(coverage_ids)

    missing_behaviours = (
        mandatory_ids - valid_covered_ids
    )

    covered_count = len(
        mandatory_ids & valid_covered_ids
    )

    if missing_assessments:
        errors.append(
            f"Missing mandatory assessments: "
            f"{sorted(missing_assessments)}"
        )

    passed = (
        not errors
        and not missing_behaviours
    )

    return {
        "passed": passed,
        "mandatory_count": len(mandatory_ids),
        "covered_count": covered_count,
        "missing_behaviours": sorted(missing_behaviours),
        "missing_assessments": sorted(missing_assessments),
        "errors": errors,
    }