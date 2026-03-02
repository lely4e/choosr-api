from google import genai
from google.genai import types
from app.core.config import settings
import json
import re

client = genai.Client(api_key=settings.GEMINI_API_KEY)


# AI prompting
def ai_prompt(
    event_type,
    recipient_relation,
    recipient_age,
    recipient_hobbies,
    gift_type,
    budget_range,
):
    """Generate gift suggestions using Gemini AI."""

    prompt_text = f"""
I need help finding the perfect gift.
Generate a gift suggestion and return ONLY valid JSON.

Event: {event_type}, ignore names, just take the event type, like Birthday, Anniversary etc.
Recipient: {recipient_relation} 
Age: {recipient_age}
Hobbies/Interests: {recipient_hobbies}
Gift type/mood: {gift_type}
Budget range: {budget_range}

Please suggest 5 gift ideas that match all of these details. 
For each suggestion, provide the JSON which should have:
a list of objects where every object has key name with the Name of the gift


Make the recommendations creative, practical, and aligned with the recipient’s interests and preferences.

    """

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        config=types.GenerateContentConfig(
            system_instruction="You are a helpful gift suggestion assistant."
        ),
        contents=prompt_text,
    )

    return extract_json_from_gemini(response)


def extract_json_from_gemini(response):
    """
    Extract the JSON from:
    response.candidates[0].content.parts[0].text
    Remove ```json fences, then parse.
    """
    try:
        raw = response.candidates[0].content.parts[0].text
    except Exception:
        raise RuntimeError("No text output found in model response")

    # Remove ```json ... ``` fences
    cleaned = re.sub(r"^```json\s*|\s*```$", "", raw.strip(), flags=re.IGNORECASE)

    # Parse JSON
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        print("Raw cleaned output:", cleaned)
        raise RuntimeError(f"JSON parsing failed: {e}")
