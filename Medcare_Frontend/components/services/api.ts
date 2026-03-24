
const BASE_URL = "http://10.128.203.91:8000";
// Drug-Drug
export const checkDrugDrug = async (drug1: string, drug2: string) => {

  const res = await fetch(
    `${BASE_URL}/drug-drug?item1=${drug1}&item2=${drug2}`
  );

  return res.json();
};


// Drug-Disease
export const checkDrugDisease = async (drug: string, disease: string) => {

  const res = await fetch(
    `${BASE_URL}/drug-disease?item1=${drug}&item2=${disease}`
  );

  return res.json();
};


// Food-Drug
export const checkFoodDrug = async (drug: string, food: string) => {

  const res = await fetch(
    `${BASE_URL}/food-drug?item1=${drug}&item2=${food}`
  );

  return res.json();
};