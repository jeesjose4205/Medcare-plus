import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {

  const router = useRouter();

  useEffect(() => {

    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);

  }, []);

  return (
    <View style={styles.container}>

      <Ionicons
        name="medkit"
        size={80}
        color="#ffffff"
      />

      <Text style={styles.title}>MedCare+</Text>

      <Text style={styles.subtitle}>
        Medication Safety Companion
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#1c8ca6",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 16,
    color: "#e0f2fe",
    marginTop: 10,
  },

});