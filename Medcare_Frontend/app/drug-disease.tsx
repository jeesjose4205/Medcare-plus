import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";

const API_URL = "http://10.128.4.91:8000";

export default function DrugDiseaseScreen() {

  const [drug, setDrug] = useState("");
  const [disease, setDisease] = useState("");

  const [drugSuggestions, setDrugSuggestions] = useState<string[]>([]);
  const [diseaseSuggestions, setDiseaseSuggestions] = useState<string[]>([]);

  const [risk, setRisk] = useState("");
  const [interaction, setInteraction] = useState("");

  const [loading, setLoading] = useState(false);

  const disabled = !drug.trim() || !disease.trim();

  // SAVE HISTORY
  const saveHistory = async (
    type: string,
    title: string,
    risk: string,
    interaction: string
  ) => {

    try {

      const existing = await AsyncStorage.getItem("interaction_history");

      let history = existing ? JSON.parse(existing) : [];

      history.unshift({
        type,
        title,
        risk,
        interaction,
      });

      await AsyncStorage.setItem(
        "interaction_history",
        JSON.stringify(history)
      );

    } catch {
      console.log("Error saving history");
    }

  };

  // SEARCH DRUG
  const searchDrugs = async (text: string) => {

    setDrug(text);

    if (text.length === 0) {
      setDrugSuggestions([]);
      return;
    }

    try {

      const res = await fetch(
        `${API_URL}/drug-list?q=${encodeURIComponent(text)}`
      );

      const data = await res.json();

      setDrugSuggestions(data.results || []);

    } catch {
      setDrugSuggestions([]);
    }

  };

  // SEARCH DISEASE
  const searchDisease = async (text: string) => {

    setDisease(text);

    if (text.length === 0) {
      setDiseaseSuggestions([]);
      return;
    }

    try {

      const res = await fetch(
        `${API_URL}/disease-list?q=${encodeURIComponent(text)}`
      );

      const data = await res.json();

      setDiseaseSuggestions(data.results || []);

    } catch {
      setDiseaseSuggestions([]);
    }

  };

  // CHECK INTERACTION
  const checkInteraction = async () => {

    try {

      const d = drug.trim().toLowerCase();
      const dis = disease.trim().toLowerCase();

      setLoading(true);
      setRisk("");
      setInteraction("");

      const response = await fetch(
        `${API_URL}/drug-disease?item1=${encodeURIComponent(d)}&item2=${encodeURIComponent(dis)}`
      );

      const data = await response.json();

      if (data.found) {

        setRisk(data.risk_level);
        setInteraction(data.interaction);

        await saveHistory(
          "Drug-Disease Interaction",
          `${drug} + ${disease}`,
          data.risk_level,
          data.interaction
        );

      } else {

        setInteraction("No interaction found.");

      }

    } catch {

      setInteraction("Unable to connect to the server.");

    } finally {

      setLoading(false);

    }

  };

  const resetForm = () => {

    setDrug("");
    setDisease("");
    setRisk("");
    setInteraction("");
    setDrugSuggestions([]);
    setDiseaseSuggestions([]);

  };

  // FIXED STYLE FUNCTION
  const getRiskStyle = (): ViewStyle => {

    if (!risk) return styles.lowRisk;

    const level = risk.toLowerCase();

    if (level.includes("high")) return styles.highRisk;

    if (level.includes("moderate")) return styles.moderateRisk;

    return styles.lowRisk;

  };

  const getRiskIcon = () => {

    const level = risk.toLowerCase();

    if (level.includes("high")) return "alert-circle";

    if (level.includes("moderate")) return "warning";

    return "checkmark-circle";

  };

  const getRiskTextColor = () => {

    const level = risk.toLowerCase();

    if (level.includes("high")) return "#dc2626";

    if (level.includes("moderate")) return "#f59e0b";

    return "#16a34a";

  };

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      <SafeAreaView style={styles.container}>

        <Text style={styles.title}>
          Drug-Disease Interaction
        </Text>

        <Text style={styles.subtitle}>
          Check if a medicine is safe for your condition
        </Text>

        {/* MEDICINE */}
        <Text style={styles.label}>Medicine</Text>

        <TextInput
          style={styles.inputBox}
          placeholder="Enter medicine"
          placeholderTextColor="#9ca3af"
          value={drug}
          onChangeText={searchDrugs}
        />

        {drugSuggestions.length > 0 && (

          <View style={styles.dropdown}>

            <ScrollView style={{ maxHeight: 200 }}>

              {drugSuggestions.map((item) => (

                <TouchableOpacity
                  key={item}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setDrug(item);
                    setDrugSuggestions([]);
                  }}
                >

                  <Text>{item}</Text>

                </TouchableOpacity>

              ))}

            </ScrollView>

          </View>

        )}

        {/* DISEASE */}
        <Text style={styles.label}>Disease</Text>

        <TextInput
          style={styles.inputBox}
          placeholder="Enter disease"
          placeholderTextColor="#9ca3af"
          value={disease}
          onChangeText={searchDisease}
        />

        {diseaseSuggestions.length > 0 && (

          <View style={styles.dropdown}>

            <ScrollView style={{ maxHeight: 200 }}>

              {diseaseSuggestions.map((item) => (

                <TouchableOpacity
                  key={item}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setDisease(item);
                    setDiseaseSuggestions([]);
                  }}
                >

                  <Text>{item}</Text>

                </TouchableOpacity>

              ))}

            </ScrollView>

          </View>

        )}

        {/* BUTTON */}
        <TouchableOpacity
          style={[styles.button, disabled && styles.buttonDisabled]}
          disabled={disabled}
          onPress={checkInteraction}
        >
          <Text style={styles.buttonText}>
            Check Interaction
          </Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#f25c05"
            style={{ marginTop: 20 }}
          />
        )}

        {/* RESULT */}
        {interaction !== "" && (

          <View style={[styles.resultBox, getRiskStyle()]}>

            {risk !== "" && (

              <View style={styles.riskHeader}>

                <Ionicons
                  name={getRiskIcon()}
                  size={22}
                  color={getRiskTextColor()}
                />

                <Text
                  style={[styles.riskTitle, { color: getRiskTextColor() }]}
                >
                  {risk}
                </Text>

              </View>

            )}

            <Text style={styles.interactionText}>
              {interaction}
            </Text>

          </View>

        )}

        {/* RESET */}
        {interaction !== "" && (

          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetForm}
          >

            <Text style={styles.resetText}>
              Check Another Combination
            </Text>

          </TouchableOpacity>

        )}

        {/* WARNING */}
        <View style={styles.warningBox}>

          <Ionicons name="warning" size={20} color="#b45309" />

          <Text style={styles.warningText}>
            {" "}
            This is an informational tool only. Always consult your doctor
            before taking medicines with existing conditions.
          </Text>

        </View>

      </SafeAreaView>

    </KeyboardAvoidingView>

  );

}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#f3f4f6",
    paddingHorizontal:20,
    paddingTop:40
  },

  title:{
    fontSize:26,
    fontWeight:"700",
    color:"#f25c05",
    textAlign:"center",
    marginBottom:8
  },

  subtitle:{
    fontSize:16,
    color:"#6b7280",
    marginBottom:20,
    textAlign:"center"
  },

  label:{
    marginTop:20,
    fontSize:16,
    fontWeight:"600",
    color:"#374151"
  },

  inputBox:{
    marginTop:10,
    backgroundColor:"#ffffff",
    borderRadius:16,
    padding:18,
    borderWidth:1,
    borderColor:"#e5e7eb",
    fontSize:16
  },

  dropdown:{
    backgroundColor:"#fff",
    borderRadius:16,
    borderWidth:1,
    borderColor:"#e5e7eb",
    marginTop:5
  },

  dropdownItem:{
    padding:16,
    borderBottomWidth:1,
    borderBottomColor:"#f1f5f9"
  },

  button:{
    marginTop:30,
    backgroundColor:"#f25c05",
    padding:18,
    borderRadius:20,
    alignItems:"center"
  },

  buttonDisabled:{
    backgroundColor:"#cbd5e1"
  },

  buttonText:{
    color:"#ffffff",
    fontSize:18,
    fontWeight:"600"
  },

  resultBox:{
    marginTop:25,
    padding:20,
    borderRadius:20,
    borderLeftWidth:6
  },

  riskHeader:{
    flexDirection:"row",
    alignItems:"center",
    marginBottom:10
  },

  riskTitle:{
    fontSize:20,
    fontWeight:"700",
    marginLeft:8
  },

  interactionText:{
    fontSize:15,
    color:"#374151",
    lineHeight:22
  },

  highRisk:{
    backgroundColor:"#fee2e2",
    borderLeftColor:"#dc2626"
  },

  moderateRisk:{
    backgroundColor:"#fef3c7",
    borderLeftColor:"#f59e0b"
  },

  lowRisk:{
    backgroundColor:"#dcfce7",
    borderLeftColor:"#16a34a"
  },

  resetButton:{
    marginTop:20,
    borderWidth:2,
    borderColor:"#f25c05",
    borderRadius:20,
    padding:16,
    alignItems:"center"
  },

  resetText:{
    color:"#f25c05",
    fontSize:16,
    fontWeight:"600"
  },

  warningBox:{
    marginTop:30,
    backgroundColor:"#fef3c7",
    padding:18,
    borderRadius:20,
    flexDirection:"row",
    borderLeftWidth:6,
    borderLeftColor:"#f59e0b"
  },

  warningText:{
    marginLeft:8,
    flex:1,
    fontSize:14,
    color:"#92400e"
  }

});




//completed//