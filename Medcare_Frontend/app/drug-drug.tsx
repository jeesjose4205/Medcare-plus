import { Ionicons } from "@expo/vector-icons";
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
} from "react-native";

const API_URL = "http://10.128.4.91:8000";

export default function DrugDrugScreen() {

  const [drug1, setDrug1] = useState("");
  const [drug2, setDrug2] = useState("");

  const [suggestions1, setSuggestions1] = useState<string[]>([]);
  const [suggestions2, setSuggestions2] = useState<string[]>([]);

  const [risk, setRisk] = useState("");
  const [interaction, setInteraction] = useState("");

  const [loading, setLoading] = useState(false);

  const disabled = !drug1.trim() || !drug2.trim();

  // --------------------------------
  // AUTOCOMPLETE SEARCH
  // --------------------------------
  const searchDrugs = async (text: string, setter: any) => {

    if (text.length === 0) {
      setter([]);
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/drug-list?q=${encodeURIComponent(text)}`
      );

      if (!response.ok) {
        setter([]);
        return;
      }

      const data = await response.json();

      setter(data.results || []);

    } catch {
      setter([]);
    }

  };

  // --------------------------------
  // CHECK INTERACTION
  // --------------------------------
  const checkInteraction = async () => {

    try {

      const d1 = drug1.trim().toLowerCase();
      const d2 = drug2.trim().toLowerCase();

      setLoading(true);
      setRisk("");
      setInteraction("");

      const response = await fetch(
        `${API_URL}/drug-drug?item1=${encodeURIComponent(d1)}&item2=${encodeURIComponent(d2)}`
      );

      if (!response.ok) {
        setInteraction("Server error occurred.");
        return;
      }

      const data = await response.json();

      if (data.found) {
        setRisk(data.risk_level);
        setInteraction(data.interaction);
      } else {
        setInteraction("No interaction found for these medicines.");
      }

    } catch {
      setInteraction("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }

  };

  // --------------------------------
  // RESET
  // --------------------------------
  const resetForm = () => {
    setDrug1("");
    setDrug2("");
    setRisk("");
    setInteraction("");
    setSuggestions1([]);
    setSuggestions2([]);
  };

  // --------------------------------
  // RISK UI
  // --------------------------------
  const getRiskStyle = () => {

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

        {/* TITLE */}
        <Text style={styles.title}>Drug-Drug Interaction</Text>

        <Text style={styles.subtitle}>
          Check if two medicines can be safely taken together
        </Text>

        {/* FIRST MEDICINE */}
        <Text style={styles.label}>First Medicine</Text>

        <TextInput
          style={styles.inputBox}
          placeholder="Enter first medicine"
          value={drug1}
          onChangeText={(text) => {
            setDrug1(text);
            searchDrugs(text, setSuggestions1);
          }}
        />

        {suggestions1.length > 0 && (

          <View style={styles.suggestionBox}>
            <ScrollView style={{ maxHeight: 180 }}>

              {suggestions1.map((item) => (

                <TouchableOpacity
                  key={item}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setDrug1(item);
                    setSuggestions1([]);
                  }}
                >
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>

              ))}

            </ScrollView>
          </View>

        )}

        {/* SECOND MEDICINE */}
        <Text style={styles.label}>Second Medicine</Text>

        <TextInput
          style={styles.inputBox}
          placeholder="Enter second medicine"
          value={drug2}
          onChangeText={(text) => {
            setDrug2(text);
            searchDrugs(text, setSuggestions2);
          }}
        />

        {suggestions2.length > 0 && (

          <View style={styles.suggestionBox}>
            <ScrollView style={{ maxHeight: 180 }}>

              {suggestions2.map((item) => (

                <TouchableOpacity
                  key={item}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setDrug2(item);
                    setSuggestions2([]);
                  }}
                >
                  <Text style={styles.suggestionText}>{item}</Text>
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
          <Text style={styles.buttonText}>Check Interaction</Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#1c8ca6"
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

                <Text style={[styles.riskTitle, { color: getRiskTextColor() }]}>
                  {risk}
                </Text>

              </View>

            )}

            <Text style={styles.interactionText}>
              {interaction}
            </Text>

          </View>

        )}

        {/* CHECK ANOTHER */}
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
            This is an informational tool only. Always consult your doctor or
            pharmacist before taking any medication combination.
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
    paddingTop:20
  },

  title:{
    fontSize:22,
    fontWeight:"700",
    textAlign:"center",
    marginTop:25,
    marginBottom:10
  },

  subtitle:{
    fontSize:16,
    color:"#6b7280",
    marginBottom:20
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

  suggestionBox:{
    backgroundColor:"#fff",
    borderRadius:16,
    borderWidth:1,
    borderColor:"#e5e7eb",
    marginTop:5
  },

  suggestionItem:{
    padding:16,
    borderBottomWidth:1,
    borderBottomColor:"#f1f5f9"
  },

  suggestionText:{
    fontSize:16,
    color:"#111827"
  },

  button:{
    marginTop:30,
    backgroundColor:"#1c8ca6",
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
    borderColor:"#1c8ca6",
    borderRadius:20,
    padding:16,
    alignItems:"center"
  },

  resetText:{
    color:"#1c8ca6",
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