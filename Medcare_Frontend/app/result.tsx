import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import SafetyBadge from "../components/SafetyBadge";
import { Colors } from "../constants/colors";

export default function Result() {
  const { title, description, level } = useLocalSearchParams<{
    title: string;
    description: string;
    level: "safe" | "warning" | "danger";
  }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <SafetyBadge level={level} />
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: Colors.background },
  title: { fontSize: 20, fontWeight: "bold" },
  description: { marginTop: 10 },
});