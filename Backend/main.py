import os
import json
import re

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

from products import PRODUCTS
from prompt_templates import build_recommendation_prompt

# Load env vars
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY not set in environment")

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI(
    title="AI Product Recommendation API",
    description="FastAPI backend that uses GROQ API to recommend products",
    version="1.0.0",
)

# CORS (allow React dev server)
origins = [
    "http://localhost:5173",  # Vite default
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Preference(BaseModel):
    preferences: str


@app.get("/")
async def root():
    return {"status": "ok", "message": "AI Product Recommender backend running"}


@app.get("/products")
async def get_products():
    return {"products": PRODUCTS}


@app.post("/recommend")
async def recommend(pref: Preference):
    """
    Accepts a free-text preference and returns recommended products
    using the OpenAI Responses API.
    """
    prompt = build_recommendation_prompt(PRODUCTS, pref.preferences)

    # Call OpenAI
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a product recommendation engine."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2
    )

    # Extract model message text
    text = response.choices[0].message.content

    # Parse JSON output
    import json, re
    try:
        ids = json.loads(text)
    except:
        match = re.search(r"\[.*\]", text, re.S)
        ids = json.loads(match.group()) if match else []

    # Validate IDs
    valid_ids = {p["id"] for p in PRODUCTS}
    ids = [i for i in ids if isinstance(i, int) and i in valid_ids]

    recommended = [p for p in PRODUCTS if p["id"] in ids]

    return {"ids": ids, "recommendedProducts": recommended}