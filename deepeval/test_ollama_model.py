
import asyncio

from custom_models.ollama_model import OllamaModel


def main():
    model = OllamaModel(model_name="qwen2.5:7b")

    prompt = """
    A test requirement says:

    1. Create a new owner.
    2. Verify the owner profile.
    3. Search for the newly created owner.

    The generated test creates the owner and verifies the profile,
    but does not perform the search.

    Identify the missing requirement in one sentence.
    """

    print("Model:", model.get_model_name())
    print("Sending prompt to Ollama...")

    response = model.generate(prompt)

    print("\nModel response:")
    print(response)


if __name__ == "__main__":
    main()
