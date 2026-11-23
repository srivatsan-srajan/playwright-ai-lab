
import asyncio
import json
import urllib.error
import urllib.request

from deepeval.models import DeepEvalBaseLLM


class OllamaModel(DeepEvalBaseLLM):

    def __init__(
        self,
        model_name="qwen2.5:7b",
        base_url="http://localhost:11434",
    ):
        self.model_name = model_name
        self.base_url = base_url.rstrip("/")
        super().__init__(model=model_name)

    def load_model(self):
        # Ollama manages the model process.
        # No separate model object needs to be loaded here.
        return self

    def get_model_name(self):
        return f"ollama/{self.model_name}"

    def generate(self, prompt, schema=None, **kwargs):
        url = f"{self.base_url}/api/chat"

        payload = {
            "model": self.model_name,
            "messages": [
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            "stream": False,
            "options": {
                "temperature": 0,
            },
        }

        if schema is not None:
            if isinstance(schema, dict):
                payload["format"] = schema
            elif hasattr(schema, "model_json_schema"):
                payload["format"] = schema.model_json_schema()

        request = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        try:
            with urllib.request.urlopen(request, timeout=180) as response:
                result = json.loads(response.read().decode("utf-8"))

            return result["message"]["content"]

        except urllib.error.URLError as exc:
            raise RuntimeError(
                f"Unable to connect to Ollama at {self.base_url}: {exc}"
            ) from exc

    async def a_generate(self, prompt, schema=None, **kwargs):
        return await asyncio.to_thread(
            self.generate,
            prompt,
            schema,
            **kwargs,
        )
