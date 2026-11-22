
import json
import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load environment variables
ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(ENV_PATH)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is missing from the environment.")

# Configure timeout and retries
http_options = types.HttpOptions(
    timeout=90000,
    retry_options=types.HttpRetryOptions(
        attempts=3,
        initial_delay=2,
        max_delay=10,
        http_status_codes=[408, 429, 500, 502, 503, 504]
    )
)

client = genai.Client(
    api_key=GEMINI_API_KEY,
    http_options=http_options
)

MODEL_NAME = "gemini-3.5-flash"


async def analyze_civic_complaint(
    image_data: bytes,
    mime_type: str,
    citizen_description: str,
    location: str
):
    prompt = f"""
    You are JanPulse AI, an AI-powered civic complaint
    image validation and analysis assistant.

    FIRST: Validate the uploaded photograph.

    Citizen description: {citizen_description}
    Reported location: {location}

    Determine whether the actual photograph clearly shows
    a civic infrastructure or public service issue.

    Examples of valid civic issues:
    - Road potholes and damaged roads
    - Garbage accumulation
    - Blocked drainage and sewage overflow
    - Water leakage
    - Damaged streetlights
    - Broken public infrastructure

    Examples of invalid images:
    - Job advertisements
    - Posters and banners
    - Screenshots unrelated to civic issues
    - Selfies and personal photographs
    - Random objects unrelated to public infrastructure

    IMPORTANT VALIDATION RULES:
    - Judge the actual visible image, not just the citizen's description.
    - Never assume an image contains a civic issue.
    - Do not invent objects, damage, locations or hazards.
    - If the image is unrelated, set is_civic_issue to false.
    - If the image is unclear or insufficient, set
      is_civic_issue to false.
    - A false result must not receive a severity or department
      recommendation.
    - Do not assign high confidence without sufficient visual evidence.

    IF THE IMAGE IS VALID:
    Identify:
    1. Actual civic issue visible.
    2. Appropriate issue category.
    3. Clear complaint description.
    4. Severity: Low, Medium, High or Critical.
    5. Public safety risk and explanation.
    6. Recommended responsible department.
    7. Confidence level.
    8. Whether human review is required.

    IF THE IMAGE IS INVALID:
    - Explain why the image cannot be accepted.
    - Ask the citizen to upload a relevant civic issue photograph.
    - Do not generate a complaint assessment.
    - Do not recommend a department.
    - Set severity and public risk to "Not assessed".
    - Set confidence to "Low".
    - Set requires_human_review to true.

    Return only valid JSON using this structure:

    {{
        "is_civic_issue": false,
        "image_validation_message": "",
        "issue_detected": "",
        "category": "",
        "complaint_description": "",
        "severity": "",
        "public_risk": "",
        "risk_explanation": "",
        "recommended_department": "",
        "confidence": "",
        "requires_human_review": true
    }}
    """

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=[
            types.Part.from_bytes(
                data=image_data,
                mime_type=mime_type
            ),
            prompt
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.1
        )
    )

    try:
        analysis = json.loads(response.text)

        if not isinstance(analysis, dict):
            raise ValueError("Gemini returned an invalid analysis structure.")

        if not isinstance(analysis.get("is_civic_issue"), bool):
            raise ValueError("Gemini returned an invalid image validation result.")

        if not analysis["is_civic_issue"]:
            analysis["issue_detected"] = ""
            analysis["category"] = ""
            analysis["complaint_description"] = ""
            analysis["severity"] = "Not assessed"
            analysis["public_risk"] = "Not assessed"
            analysis["risk_explanation"] = ""
            analysis["recommended_department"] = ""
            analysis["confidence"] = "Low"
            analysis["requires_human_review"] = True

        return analysis

    except (json.JSONDecodeError, TypeError):
        raise ValueError("Gemini returned an invalid analysis response.")
