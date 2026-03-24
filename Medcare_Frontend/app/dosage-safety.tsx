import React, { useState } from "react";
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// -----------------------------
// DROPDOWN COMPONENT
// -----------------------------
const DropdownSearch = ({ label, data, selected, setSelected }: any) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = data.filter((item: string) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ marginBottom: 20, zIndex: 100 }}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dropdownInput}
        onPress={() => setVisible(!visible)}
      >
        <Text style={{ color: selected ? "#222" : "#999" }}>
          {selected || `Select ${label}`}
        </Text>
      </TouchableOpacity>

      {visible && (
        <View style={styles.dropdownContainer}>
          <TextInput
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

          {/* ✅ SCROLL FIX */}
          <FlatList
            data={filtered}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={true}
            keyExtractor={(item, i) => i.toString()}
            style={{ maxHeight: 200 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelected(item);
                  setVisible(false);
                  setSearch("");
                }}
              >
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

// -----------------------------
// MAIN SCREEN
// -----------------------------
export default function OverdoseChecker() {
  const [medicine, setMedicine] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [condition, setCondition] = useState("");
  const [allergy, setAllergy] = useState("");
  const [result, setResult] = useState<any>(null);

  const medicines = [
    "Paracetamol",
    "Dolo 650",
    "Ibuprofen",
    "Aspirin",
    "Metformin",
    "Insulin",
    "Amlodipine",
    "Atenolol",
    "Atorvastatin",
    "Losartan",
    "Furosemide",
    "Pantoprazole",
    "ORS",
  ];

  const ages = ["Child", "Adult", "Elderly"];
  const weights = ["<40 kg", "40-60 kg", "60-80 kg", ">80 kg"];
  const conditions = ["None", "Liver disease", "Kidney disease", "Diabetes"];
  const allergies = ["None", "Drug allergy", "NSAID allergy"];

  const checkSafety = () => {
    let maxDose = "";
    let gap = "";
    let warnings: string[] = [];

    if (medicine === "Paracetamol") {
      if (age === "Child") {
        maxDose = "60 mg/kg per day";
        gap = "4–6 hours";
        warnings.push("Strictly weight-based dosing");
      } else if (age === "Elderly") {
        maxDose = "3000 mg per day";
        gap = "6 hours";
        warnings.push("Lower limit due to age");
      } else {
        maxDose = "Up to 4000 mg per day";
        gap = "4–6 hours";
      }

      warnings.push("⚠ Liver damage risk if exceeded");

      if (condition === "Liver disease") {
        warnings.push("Lower limits apply due to liver disease");
      }
    }

    else if (medicine === "Ibuprofen") {
      maxDose =
        age === "Child"
          ? "40 mg/kg per day"
          : age === "Elderly"
          ? "2400 mg per day"
          : "3200 mg per day";

      gap = "6–8 hours";
      warnings.push("⚠ Kidney damage & stomach bleeding");
    }

    else if (medicine === "Aspirin") {
      if (age === "Child") {
        maxDose = "Not recommended";
        gap = "N/A";
        warnings.push("⚠ Risk of Reye’s syndrome");
      } else {
        maxDose = "Up to 4000 mg";
        gap = "4–6 hours";
        warnings.push("⚠ Bleeding risk");
      }
    }

    else {
      maxDose = "Refer guidelines";
      gap = "Varies";
      warnings.push("Consult doctor");
    }

    setResult({ maxDose, gap, warnings });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ FIXED: ScrollView instead of FlatList */}
      <ScrollView keyboardShouldPersistTaps="always">
        <Text style={styles.title}>💊 Overdose Safety Checker</Text>

        <View style={styles.card}>
          <DropdownSearch
            label="Medicine"
            data={medicines}
            selected={medicine}
            setSelected={setMedicine}
          />

          <DropdownSearch
            label="Age Group"
            data={ages}
            selected={age}
            setSelected={setAge}
          />

          <DropdownSearch
            label="Weight"
            data={weights}
            selected={weight}
            setSelected={setWeight}
          />

          <DropdownSearch
            label="Health Condition"
            data={conditions}
            selected={condition}
            setSelected={setCondition}
          />

          <DropdownSearch
            label="Allergies"
            data={allergies}
            selected={allergy}
            setSelected={setAllergy}
          />

          <TouchableOpacity style={styles.button} onPress={checkSafety}>
            <Text style={styles.buttonText}>Check Safety</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.output}>
              ✔ Maximum safe daily limit:{" "}
              <Text style={styles.bold}>{result.maxDose}</Text>
            </Text>

            <Text style={styles.output}>
              ⏱ Minimum gap between doses:{" "}
              <Text style={styles.bold}>{result.gap}</Text>
            </Text>

            {result.warnings.map((w: string, i: number) => (
              <Text key={i} style={styles.warning}>
                {w}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// -----------------------------
// STYLES
// -----------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef2f7" },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 18,
    borderRadius: 18,
    elevation: 5,
  },

  label: { fontWeight: "600", marginBottom: 6 },

  dropdownInput: {
    backgroundColor: "#f9fbff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e6ed",
  },

  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#e0e6ed",
    elevation: 6,
  },

  searchInput: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#f2f2f2",
  },

  itemText: { fontSize: 15 },

  button: {
    backgroundColor: "#6C9EFF",
    padding: 15,
    borderRadius: 14,
    marginTop: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  resultCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 4,
  },

  output: { fontSize: 16, marginBottom: 8 },
  warning: { color: "#e53935", marginTop: 5 },
  bold: { fontWeight: "bold" },
});