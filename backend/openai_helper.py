"""
API methods for OpenAI
"""

from openai import OpenAI
from dotenv import load_dotenv
import os
import asyncio

load_dotenv()
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def create_image(prompt: str):
    model = "dall-e-3"
    response = client.images.generate(
        model=model,
        prompt=prompt,
        n=1,
    )

    print(response.data[0]["url"])


if __name__ == "__main__":
    prompt = "A cute cat"
    create_image(prompt)


