import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DrugInfoScreen() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const STORAGE_KEY = "SEARCH_HISTORY";

  // ✅ LOAD HISTORY ON APP START
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.log("Load error:", e);
    }
  };

  // ✅ SAVE HISTORY (MAX 20 ITEMS)
  const saveHistory = async (newHistory: string[]) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(newHistory)
      );
    } catch (e) {
      console.log("Save error:", e);
    }
  };

  // 🔎 SEARCH HANDLER
  const handleSearch = async (value: string) => {
    if (!value.trim()) return;

    console.log("Searching:", value);

    let updatedHistory = [
      value,
      ...history.filter((item) => item !== value),
    ];

    // ✅ LIMIT TO 20 ITEMS
    if (updatedHistory.length > 20) {
      updatedHistory = updatedHistory.slice(0, 20);
    }

    setHistory(updatedHistory);
    await saveHistory(updatedHistory);

    // ✅ Navigate
    router.push({
    pathname: "/drug-details",
  params: { name: value.toString() },
});

    setQuery("");
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* TITLE */}
      <Text style={styles.title}>Drug Information</Text>

      {/* SEARCH BAR */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Enter medicine name..."
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSearch(query)}
        >
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* RECENT SEARCHES */}
      <Text style={styles.historyTitle}>Recent Searches</Text>

      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.historyItem}
            onPress={() => handleSearch(item)}
          >
            <Text style={styles.historyText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f7fb",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
  },

  searchBox: {
    flexDirection: "row",
    marginBottom: 20,
  },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    fontSize: 16,
  },

  button: {
    marginLeft: 10,
    backgroundColor: "#0ea5a4",
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 16,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  historyItem: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  historyText: {
    fontSize: 15,
    color: "#374151",
  },
});