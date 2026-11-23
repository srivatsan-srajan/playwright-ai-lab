
from deepeval.metrics import GEval
from deepeval.test_case import SingleTurnParams

from custom_models.ollama_model import OllamaModel


def create_scenario_coverage_metric() -> GEval:
    return GEval(
        name="Scenario Coverage",
        model=OllamaModel(model_name="qwen2.5:7b"),
        evaluation_params=[
            SingleTurnParams.INPUT,
            SingleTurnParams.ACTUAL_OUTPUT,
            SingleTurnParams.EXPECTED_OUTPUT,
        ],
        criteria=(
            "Evaluate how completely the generated Playwright test implements "
            "the functional requirement and its expected behaviours. Assess "
            "whether the intended workflow, essential actions, and expected "
            "outcomes are implemented and verified through assertions. "
            "Identify missing, incomplete, or substituted behaviours. "
            "Do not award credit merely because the test is syntactically "
            "valid or executable. Evaluate only behaviour demonstrably "
            "implemented in the supplied test source."
        ),
        evaluation_steps=[
            "Identify the functional requirement and its expected behaviours.",
            "Inspect the generated Playwright test source.",
            "Map each expected behaviour to corresponding test actions and assertions.",
            "Identify expected behaviours that are missing or only partially verified.",
            "Identify unrelated or substituted behaviour.",
            "Assign a score between 0 and 1 based on overall scenario coverage.",
            "Explain the score with specific evidence from the test source.",
        ],
        threshold=0.70,
        async_mode=False,
        verbose_mode=True,
    )
