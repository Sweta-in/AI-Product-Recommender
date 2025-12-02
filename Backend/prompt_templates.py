from typing import List, Dict


def build_recommendation_prompt(products: List[Dict], user_preferences: str) -> str:
    """
    Build a clear, strict prompt for the AI model so it returns only valid JSON.
    """

    product_lines = "\n".join(
        [
            f"- ID: {p['id']}, name: {p['name']}, category: {p['category']}, price: {p['price']}"
            for p in products
        ]
    )

    prompt = f"""
You are a precise product recommendation engine.

You are given:
1) A fixed catalog of products.
2) A user's free-text preferences.

Your job:
- Select up to 3 products from the catalog that best match the user's preferences.
- If no products match well, return an empty array [].
- You MUST ONLY choose from the provided product IDs.
- You MUST respond with VALID JSON: a simple array of integers representing product IDs.

CATALOG:
{product_lines}

USER PREFERENCES:
"{user_preferences}"

RESPONSE FORMAT (important):
- Respond with ONLY a JSON array of product IDs.
- No explanation, no extra keys, no comments.
- Examples of valid responses:
  - [1, 3]
  - []
If you are unsure, return an empty array: [].
"""
    return prompt.strip()
