from fastapi import FastAPI, Query
import pickle

app = FastAPI()

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