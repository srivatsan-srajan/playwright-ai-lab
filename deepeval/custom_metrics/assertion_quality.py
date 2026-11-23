
from deepeval.metrics import GEval
from deepeval.test_case import SingleTurnParams

from custom_models.ollama_model import OllamaModel


def create_assertion_quality_metric() -> GEval:
    return GEval(
        name="Assertion Quality",
        model=OllamaModel(model_name="qwen2.5:7b"),
        evaluation_params=[
            SingleTurnParams.INPUT,
            SingleTurnParams.ACTUAL_OUTPUT,
            SingleTurnParams.EXPECTED_OUTPUT,
        ],
        
criteria=(
    "Evaluate the quality of the assertions actually present in the "
    "generated Playwright test. Focus on assertion strength rather "
    "than overall scenario completeness, which is evaluated separately. "
    "Assess whether assertions verify specific expected values, meaningful "
    "application state, and observable outcomes. Evaluate specificity, "
    "correctness, reliability, and resistance to false positives. "
    "Distinguish between weak assertions such as checking only that an "
    "element is visible and stronger assertions that verify the expected "
    "content or state. Identify assertions that are redundant, overly "
    "permissive, or insufficient to establish the claimed outcome. "
    "Do not penalize this metric simply because an entire expected "
    "behaviour is absent; that belongs to Scenario Coverage. "
    "Evaluate the quality of assertions for behaviours the test actually "
    "attempts to verify.Every criticism must cite a specific assertion or missing "
    "verification in the supplied source. Do not claim that assertions "
    "lack specific expected values when the source compares against "
    "explicit values, variables, or regular expressions. Distinguish "
    "between exact-value assertions, visibility assertions, navigation "
    "assertions, and collection/state assertions. Do not penalize "
    "missing functional behaviours already evaluated by Scenario Coverage."
    ),
evaluation_steps=[
    "Identify the behaviours the test attempts to verify.",
    "Locate the corresponding Playwright assertions.",
    "Assess whether assertions verify specific expected values or only generic conditions.",
    "Evaluate whether assertions establish meaningful application outcomes.",
    "Identify weak, redundant, overly permissive, or unreliable assertions.",
    "Assess whether the assertions could pass despite an incorrect application outcome.",
    "Assign a score between 0 and 1 based on assertion quality alone.",
    "Explain the score with specific evidence from the source.Support every identified weakness with a specific code-level example. "
    "Do not infer weaknesses that are not demonstrable from the source."
],
        threshold=0.70,
        async_mode=False,
        verbose_mode=True,
    )
