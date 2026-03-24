import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function DrugDetails() {
  const { name } = useLocalSearchParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://10.128.4.91:8000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/search-medicine?name=${name}`
      );

      const json = await res.json();

      console.log("FULL API RESPONSE:", json);

      setData(json);
    } catch (e) {
      console.log("ERROR:", e);
    }

    setLoading(false);
  };

  // ✅ SAFE DISPLAY FUNCTION
  const formatText = (value) => {
    if (!value) return "Not available";

    if (typeof value === "string") return value;

    if (Array.isArray(value)) return value.join("\n\n");

    return "Not available";
  };

  // 🔄 Loading Screen
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  // ❌ Error / No Data
  if (!data || data.status === "error") {
    return (
      <SafeAreaView style={styles.center}>
        <Text>{data?.message || "No data found"}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 🔥 TITLE (LOWER POSITIONED) */}
      <Text style={styles.title}>{data.medicine}</Text>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* AI Summary */}
        <View style={styles.card}>
          <Text style={styles.heading}>🧠 AI Summary</Text>
          <Text style={styles.text}>
            {data.ai_summary || "AI summary not available"}
          </Text>
        </View>

        {/* Uses */}
        <View style={styles.card}>
          <Text style={styles.heading}>💊 Uses</Text>
          <Text style={styles.text}>
            {formatText(data.uses)}
          </Text>
        </View>

        {/* Side Effects */}
        <View style={styles.card}>
          <Text style={styles.heading}>⚠️ Side Effects</Text>
          <Text style={styles.text}>
            {formatText(data.side_effects)}
          </Text>
        </View>

        {/* Warnings */}
        <View style={styles.card}>
          <Text style={styles.heading}>🚨 Warnings</Text>
          <Text style={styles.text}>
            {formatText(data.warnings)}
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f4f7fb",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // ✅ TITLE MOVED LOWER
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 30,   // 🔥 moved lower (main fix)
    marginBottom: 10,
    color: "#0f172a",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 2,
  },

  heading: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 16,
  },

  text: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
});


////completed///