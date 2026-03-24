from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pickle
import requests
import os
from dotenv import load_dotenv
from openai import OpenAI

# -----------------------------
# LOAD ENV VARIABLES
# -----------------------------
load_dotenv(".env")

API_KEY = os.getenv("OPENAI_API_KEY")
print("API KEY:", API_KEY)

# -----------------------------
# INIT APP (SINGLE INSTANCE)
# -----------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# INIT OPENAI
# -----------------------------
client = OpenAI(api_key=API_KEY)

# =========================================================
# ✅ PART 1: INTERACTION SYSTEM (YOUR FIRST API)
# =========================================================

# -----------------------------
# LOAD DATASET
# -----------------------------
with open("interaction_lookup.pkl", "rb") as f:
    interaction_lookup = pickle.load(f)

# -----------------------------
# BUILD SEARCH LISTS
# -----------------------------
drug_set = set()
disease_set = set()
food_set = set()

for (item1, item2), data in interaction_lookup.items():

    interaction_type = data["type"].lower()

    if interaction_type == "drug-drug":
        drug_set.add(item1)
        drug_set.add(item2)

    elif interaction_type == "drug-disease":
        drug_set.add(item1)
        disease_set.add(item2)

    elif interaction_type in ["drug-food", "food-drug"]:
        drug_set.add(item1)
        food_set.add(item2)

drug_list = sorted(drug_set)
disease_list = sorted(disease_set)
food_list = sorted(food_set)

# -----------------------------
# AUTOCOMPLETE SEARCH
# -----------------------------
def search_items(items, query):
    query = query.lower()
    results = [item for item in items if item.startswith(query)]
    return results[:10]

@app.get("/drug-list")
def drug_list_api(q: str = Query(...)):
    return {"results": search_items(drug_list, q)}

@app.get("/disease-list")
def disease_list_api(q: str = Query(...)):
    return {"results": search_items(disease_list, q)}

@app.get("/food-list")
def food_list_api(q: str = Query(...)):
    return {"results": search_items(food_list, q)}

# -----------------------------
# DRUG-DRUG INTERACTION
# -----------------------------
@app.get("/drug-drug")
def drug_drug(item1: str, item2: str):

    item1 = item1.lower().strip()
    item2 = item2.lower().strip()

    data = interaction_lookup.get((item1, item2)) \
        or interaction_lookup.get((item2, item1))

    if data and data["type"].lower() == "drug-drug":
        return {
            "found": True,
            "risk_level": data["risk"],
            "interaction": data["interaction"]
        }

    return {"found": False}

# -----------------------------
# DRUG-DISEASE INTERACTION
# -----------------------------
@app.get("/drug-disease")
def drug_disease(item1: str, item2: str):

    item1 = item1.lower().strip()
    item2 = item2.lower().strip()

    data = interaction_lookup.get((item1, item2))

    if data and data["type"].lower() == "drug-disease":
        return {
            "found": True,
            "risk_level": data["risk"],
            "interaction": data["interaction"]
        }

    return {"found": False}

# -----------------------------
# FOOD-DRUG INTERACTION
# -----------------------------
@app.get("/food-drug")
def food_drug(item1: str, item2: str):

    item1 = item1.lower().strip()
    item2 = item2.lower().strip()

    data = interaction_lookup.get((item1, item2))

    if data and data["type"].lower() in ["food-drug", "drug-food"]:
        return {
            "found": True,
            "risk_level": data["risk"],
            "interaction": data["interaction"]
        }

    return {"found": False}


# =========================================================
# ✅ PART 2: AI MEDICINE SEARCH SYSTEM (YOUR SECOND API)
# =========================================================

# -----------------------------
# FETCH DRUG DATA
# -----------------------------
def get_drug_data(drug_name: str):
    try:
        url = f"https://api.fda.gov/drug/label.json?search=openfda.generic_name:{drug_name}+OR+openfda.brand_name:{drug_name}&limit=1"

        response = requests.get(url, timeout=5)

        if response.status_code != 200:
            return None

        data = response.json()

        if "results" not in data:
            return None

        result = data["results"][0]

        return {
            "uses": result.get("indications_and_usage", ["No data"])[0],
            "side_effects": result.get("adverse_reactions", ["No data"])[0],
            "warnings": result.get("warnings", ["No data"])[0],
        }

    except Exception as e:
        print("FDA ERROR:", e)
        return None


# -----------------------------
# AI SUMMARY
# -----------------------------
def generate_ai_summary(drug_name: str, drug_data: dict):
    try:
        uses = drug_data["uses"]
        side_effects = drug_data["side_effects"]
        warnings = drug_data["warnings"]

        prompt = f"""
You are a medical assistant.

Rewrite the given drug information into clear, professional sentences.

DO NOT copy raw text.
DO NOT cut sentences.
Make proper readable sentences.

FORMAT:

Summary:
- 1–2 clean sentences explaining {drug_name}

Uses:
- Rewrite clearly from: {uses}

Side Effects:
- Rewrite clearly from: {side_effects}

Warnings:
- Rewrite clearly from: {warnings}

RULES:
- Keep meaning SAME as data
- Do not add new info
- Use simple but professional English
- Max 2 bullet points per section
- Each bullet must be a COMPLETE sentence
"""

        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You rewrite medical data clearly."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )

        ai_text = response.choices[0].message.content.strip()

        if "Summary:" not in ai_text:
            raise Exception("Invalid AI format")

        return ai_text

    except Exception as e:
        print("AI ERROR:", e)

        return f"""Summary:
- {drug_name} is used for medical treatment.

Uses:
- This medicine is used for: {uses[:100]}.

Side Effects:
- Possible side effects include: {side_effects[:100]}.

Warnings:
- Important precautions include: {warnings[:100]}.
"""


# -----------------------------
# MAIN SEARCH API
# -----------------------------
@app.get("/search-medicine")
def search_medicine(name: str = Query(...)):
    
    drug_data = get_drug_data(name)

    if not drug_data:
        return {
            "status": "error",
            "message": "Medicine not found"
        }

    ai_summary = generate_ai_summary(name, drug_data)

    return {
        "status": "success",
        "medicine": name,
        "uses": drug_data["uses"],
        "side_effects": drug_data["side_effects"],
        "warnings": drug_data["warnings"],
        "ai_summary": ai_summary
    }


# -----------------------------
# SUGGESTIONS
# -----------------------------
@app.get("/search-suggestions")
def search_suggestions(q: str = Query(...)):
    try:
        url = f"https://api.fda.gov/drug/label.json?search={q}&limit=5"
        response = requests.get(url, timeout=5)

        data = response.json()

        if "results" not in data:
            return {"suggestions": []}

        suggestions = []

        for item in data["results"]:
            names = item.get("openfda", {}).get("brand_name", [])
            suggestions.extend(names)

        return {"suggestions": list(set(suggestions))[:5]}

    except:
        return {"suggestions": []}


# -----------------------------
# ROOT
# -----------------------------
@app.get("/")
def home():
    return {"message": "AI Medicine + Interaction API is running 🚀"}